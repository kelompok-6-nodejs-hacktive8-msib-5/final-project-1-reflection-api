import express from "express";
import "dotenv/config";
import { errorMiddleware } from "./middleware/error-middleware.js";
import { publicRouter } from "./routes/public-api.js";
import { userRouter } from "./routes/api.js";

const port = process.env.PORT_SERVER;

const web = express();

web.use(express.json());

web.get("/", (req, res) => {
  res.status(200).json({ message: "Hello Reflection API" });
});

web.use(publicRouter);
web.use(userRouter);
web.use(errorMiddleware);

web.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

export default web;
