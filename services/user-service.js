import {
  loginUserValidation,
  registerUserValidation,
} from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import { pool } from "../models/pg-config.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token.js";

export const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const { email, password } = user.data;

  const checkQueryEmail = "SELECT * FROM users WHERE email = $1";
  const { rows: existingUsers } = await pool.query(checkQueryEmail, [email]);

  if (existingUsers.length > 0) {
    throw new ResponseError(400, "Email already exist");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const insertQueryUsers =
    "INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id";
  const { rows: insertedUser } = await pool.query(insertQueryUsers, [
    email,
    hashedPassword,
  ]);

  if (insertedUser.length > 0) {
    return {
      id: insertedUser[0].id,
      email,
    };
  } else {
    throw new ResponseError(500, "Failed to insert user");
  }
};

export const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const { email, password } = loginRequest.data;

  const queryText = "SELECT id, email, password FROM users WHERE email = $1";
  const { rows: users } = await pool.query(queryText, [email]);

  if (users.length === 0) {
    throw new ResponseError(401, "Email or password invalid!");
  }

  const user = users[0];

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ResponseError(401, "Email or password invalid!");
  }

  const token = generateToken(user.id, user.email);

  return {
    access_token: token,
  };
};
