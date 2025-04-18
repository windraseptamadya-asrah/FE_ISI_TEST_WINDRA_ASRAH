import { Router } from "express";
import { UserController } from "../controllers/users";
import { authMiddleware, leadOnly } from "../middleware/auth";

export const router = Router();

router.use(authMiddleware);

router.get("/", (req, res, next) => {
  UserController.getSelf(req, res, next);
});
router.get("/all", leadOnly, (req, res, next) => {
  UserController.getUsers(req, res, next);
});