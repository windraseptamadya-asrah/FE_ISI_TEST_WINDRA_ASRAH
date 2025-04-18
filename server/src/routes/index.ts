import { Router } from "express";
import { generateResponse } from "../entities/response";
import { router as auth } from "./auth";
import { router as todo } from "./todo";
import { router as user } from "./users";

export const router = Router();

router.get("/", (_, res) => {
  generateResponse(res, "API is running");
});
router.use("/", auth);
router.use("/user", user);
router.use("/todo", todo);
