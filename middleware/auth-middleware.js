import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const header = req.get("Authorization");

  if (!header) {
    return res.status(401).json({ errors: "Unauthorized" }).end();
  }

  const [type, token] = header.split(" ");

  if ((type !== "Bearer" && type !== "bearer") || !token) {
    return res.status(401).json({ errors: "Unauthorized" }).end();
  }

  const secretKey = process.env.SECRET_KEY_JWT;

  jwt.verify(token, secretKey, async (error, decode) => {
    if (error) {
      return res.status(401).json({ errors: "Unauthorized" }).end();
    }

    req.user = decode;

    next();
  });
};
