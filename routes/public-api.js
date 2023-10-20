import express from "express";
import {
  loginController,
  registerController,
} from "../controllers/user-controller.js";

export const publicRouter = express.Router();

publicRouter.post("/api/v1/users/register", registerController);
publicRouter.post("/api/v1/users/login", loginController);
