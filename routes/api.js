import express from "express";
import {
  createReflectionController,
  getReflectionController,
} from "../controllers/reflection-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";

export const userRouter = express.Router();
userRouter.use(authMiddleware);

userRouter
  .route("/api/v1/reflections/:id?")
  .post(createReflectionController)
  .get(getReflectionController);
