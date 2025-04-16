import { Router } from "express";
import { generateResponse } from "../entities/response";
import { router as auth } from "./auth";

export const router = Router();

router.get("/", (_, res) => {
  generateResponse(res, "API is running");
});
router.use("/", auth);