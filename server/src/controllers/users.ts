import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { generateResponse } from "../entities/response";
import { CreateUserDto } from "../dto/users";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Users } from "../entities/users";
import { BadRequestError, UnauthorizedError } from "../views/error";
import Query from "../helpers/query-builder";
import { signToken } from "../helpers/jwt";

export class UserController {
  static async createUser(req: Request, res: Response, next: Function) {
    try {
      if (!req.body || Object.keys(req.body).length === 0)
        throw new BadRequestError("Request body is empty");

      const userDTO = plainToInstance(CreateUserDto, req.body);
      const errors = await validate(userDTO);

      if (errors.length > 0) {
        const constraints = errors[0].constraints;
        if (constraints) {
          const firstConstraint = Object.values(constraints)[0];
          throw new BadRequestError(firstConstraint);
        }
        throw new BadRequestError("Validation failed");
      }

      userDTO.password = bcrypt.hashSync(userDTO.password, 10);
      const newUser = await Query()
        .insert()
        .into(Users)
        .values(userDTO)
        .execute();
      const { password: _, ...userDTOWithoutPassword } = userDTO;
      return generateResponse(
        res,
        {
          id: newUser.identifiers[0].id,
          ...userDTOWithoutPassword,
        },
        201,
        "User created successfully"
      );
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: Function) {
    try {
      const { username, password } = req.body;
      if (!username || !password)
        throw new BadRequestError("Username and password are required");

      const user = await Query()
        .select("user")
        .from(Users, "user")
        .where("user.username = :username", { username })
        .getOne();
      if (!user) throw new UnauthorizedError("Invalid username or password");

      const isPasswordValid = bcrypt.compareSync(password, user.password);
      if (!isPasswordValid)
        throw new UnauthorizedError("Invalid username or password");

      const token = signToken({
        id: user.id,
        role: user.role,
      });

      return generateResponse(res, { token });
    } catch (error) {
      next(error);
    }
  }
}
