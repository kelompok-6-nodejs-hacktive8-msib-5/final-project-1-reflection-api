import { login, register } from "../services/user-service.js";

export const registerController = async (req, res, next) => {
  try {
    const result = await register(req.body);

    res.status(200).json({
      id: result.id,
      email: result.email,
    });
  } catch (e) {
    next(e);
  }
};

export const loginController = async (req, res, next) => {
  try {
    const result = await login(req.body);

    res.status(200).json({
      access_token: result.access_token,
    });
  } catch (e) {
    next(e);
  }
};
