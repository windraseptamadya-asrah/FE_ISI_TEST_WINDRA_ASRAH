import { Request, Response, NextFunction } from "express";
import { Todos } from "../entities/todo";
import { generateResponse } from "../entities/response";
import Query from "../helpers/query-builder";
import { BadRequestError, NotFoundError, UnauthorizedError } from "../views/error";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { CreateTodoDto } from "../dto/todo";
import { Users } from "../entities/users";

export class TodoController {
  private static validateStatus(status: string) {
    if (status && (status !== "Not Started" && status !== "On Progress" && status !== "Done" && status !== "Reject")) {
      throw new BadRequestError("Status must be either Not Started, On Progress, Done or Reject");
    }
  }

  private static validateDeadline(deadline: Date) {
    if (deadline && deadline < new Date()) {
      throw new BadRequestError("Deadline cannot be in the past");
    }
  }

  static async getTodos(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) throw new UnauthorizedError("User not authenticated");
      const todos = await Query()
        .from(Todos, "todos")
        .leftJoinAndMapOne("todos.assignedUser", Users, "assigned_user", "todos.assignedTo = assigned_user.id")
        .leftJoinAndMapOne("todos.createdUser", Users, "created_user", "todos.createdBy = created_user.id")      
        .select([
          "todos.*",
          "assigned_user.name AS assigned_to_name",
          "created_user.name AS created_by_name",
        ])
        .where(() => {
          if (user.role !== "lead") {
            return "todos.assignedTo = :id";
          }
        }, { id: user.id })
        .getRawMany();
        return generateResponse(res, todos);
    } catch (err) {
      next(err);
    }
  }

  static async getTodoById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      if (!user) throw new UnauthorizedError("User not authenticated");
      const todos = await Query()
        .from(Todos, "todos")
        .leftJoinAndMapOne("todos.assignedUser", Users, "assigned_user", "todos.assignedTo = assigned_user.id")
        .leftJoinAndMapOne("todos.createdUser", Users, "created_user", "todos.createdBy = created_user.id")      
        .select([
          "todos.*",
          "assigned_user.name AS assigned_to_name",
          "created_user.name AS created_by_name",
        ])
        .where("todos.id = :id", { id: req.params.id })
        .getRawOne();
        return generateResponse(res, todos);
    } catch (err) {
      next(err);
    }
  }

  static async createTodo(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.body || Object.keys(req.body).length === 0)
        throw new BadRequestError("Request body is empty");
      if (!req.user) throw new BadRequestError("User not authenticated");

      const todoDTO = plainToInstance(CreateTodoDto, req.body);
      const errors = await validate(todoDTO);

      this.validateDeadline(todoDTO.deadline);

      if (errors.length > 0) {
        const constraints = errors[0].constraints;
        if (constraints) {
          const firstConstraint = Object.values(constraints)[0];
          throw new BadRequestError(firstConstraint);
        }
        throw new BadRequestError("Validation failed");
      }

      todoDTO.createdBy = req.user.id;

      const newTodo = await Query()
        .insert()
        .into(Todos)
        .values(todoDTO)
        .execute();
      return generateResponse(
        res,
        {
          id: newTodo.identifiers[0].id,
          ...todoDTO,
        },
        201,
        "Todo created successfully"
      );
    } catch (err) {
      next(err);
    }
  }

  static async assignTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;
      if (!assignedTo) throw new BadRequestError("Assigned user (as in assignedTo) is required");

      const todo = await Query().select("todo").from(Todos, "todo").where("id = :id", { id }).getOne();
      if (!todo) throw new NotFoundError("Todo not found");

      const assignedUser = await Query().select("user").from(Users, "user").where("id = :id", { id: assignedTo }).getOne();
      if (!assignedUser) throw new NotFoundError("Assigned user not found");
      
      await Query().update(Todos).set({ assignedTo }).where("id = :id", { id }).execute();
      return generateResponse(res, {
        ...todo,
        assignedTo: assignedUser.id,
      }, 200, `Todo "${todo.title}" (id: ${todo.id}) was assigned to ${assignedUser.name}`);
    } catch (err) {
      next(err);
    }
  }
  
  static async updateTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { title, description, deadline, status } = req.body;
      if (!title && !description && !deadline) throw new BadRequestError("At least one field is required");

      const todo = await Query().select("todo").from(Todos, "todo").where("id = :id", { id }).getOne();
      if (!todo) throw new NotFoundError("Todo not found");

      this.validateStatus(status);

      await Query()
        .update(Todos)
        .set({ title, description, deadline, status })
        .where("id = :id", { id })
        .execute();

      return generateResponse(res, {
        ...todo,
        title: title ?? todo.title,
        description: description ?? todo.description,
        deadline: deadline ?? todo.deadline,
        status: status ?? todo.status,
        updatedAt: new Date(),
      }, 200);
    }
    catch (e) {
      next(e)
    }
  }


  static async updateTodoTeam(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { description, status } = req.body;

      const todo = await Query().select("todo").from(Todos, "todo").where("id = :id", { id }).getOne();
      if (!todo) throw new NotFoundError("Todo not found");

      this.validateStatus(status);

      await Query()
        .update(Todos)
        .set({ description, status })
        .where("id = :id", { id })
        .execute();

      return generateResponse(res, {
        ...todo,
        description: description ?? todo.description,
        status: status ?? todo.status,
        updatedAt: new Date(),
      }, 200);
    }
    catch (err) {
      next(err);
    }
  }

  static async deleteTodo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const isAvailable = await Query()
        .select("todos")
        .from(Todos, "todos")
        .where("id = :id", { id })
        .getOne();
      if (!isAvailable) throw new NotFoundError("Todo not found");

      await Query().delete().from(Todos).where("id = :id", { id }).execute();
      return generateResponse(res, null, 200, "Todo deleted successfully");
    } catch (err) {
      next(err);
    }
  }
}
