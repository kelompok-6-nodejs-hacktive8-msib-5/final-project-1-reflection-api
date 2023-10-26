import { login, register } from "../services/user-service.js";

export const registerController = async (req, res, next) => {
  try {
    const request = req.body;

    const result = await register(request);

    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const request = req.body;

    const result = await login(request);

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
