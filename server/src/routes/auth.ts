import { Router } from "express";
import { UserController } from "../controllers/users";

export const router = Router();

router.post("/register", (req, res, next) => {
  UserController.createUser(req, res, next);
})
router.post("/login", (req, res, next) => {
  UserController.login(req, res, next);
});