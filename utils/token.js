import jwt from "jsonwebtoken";

const secretKey = process.env.SECRET_KEY_JWT;

const expiresIn = "7d";

export const generateToken = (id, email) => {
  const payload = {
    id: id,
    email: email,
  };

  return jwt.sign(payload, secretKey, { expiresIn });
};
