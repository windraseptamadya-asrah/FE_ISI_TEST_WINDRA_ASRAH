import { Router } from "express";
import { TodoController } from "../controllers/todo";
import { authMiddleware, leadOnly } from "../middleware/auth";

export const router = Router();

router.use(authMiddleware);
router.get("/", (req, res, next) => {
  TodoController.getTodos(req, res, next);
});
router.get("/:id", (req, res, next) => {
  TodoController.getTodoById(req, res, next);
});
router.post("/", leadOnly, (req, res, next) => {
  TodoController.createTodo(req, res, next);
});
router.patch("/:id/assign", leadOnly, (req, res, next) => {
  TodoController.assignTodo(req, res, next);
});
router.patch("/:id", (req, res, next) => {
  TodoController.updateTodoTeam(req, res, next);
});
router.put("/:id", leadOnly, (req, res, next) => {
  TodoController.updateTodo(req, res, next);
});
router.delete("/:id", leadOnly, (req, res, next) => {
  TodoController.deleteTodo(req, res, next);
});