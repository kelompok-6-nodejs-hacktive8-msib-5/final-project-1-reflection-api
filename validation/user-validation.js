import { z } from "zod";

export const registerUserValidation = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email not valid" })
    .max(100, { message: "Email should not be longer than 100 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(10, { message: "Password must be 10 characters" })
    .max(100, { message: "Password should not be longer than 100 characters" })
    .refine(
      (password) => {
        return /[A-Z]/.test(password) && /[0-9]/.test(password);
      },
      {
        message:
          "Password must contain at least one uppercase letter and one number",
      }
    ),
});

export const loginUserValidation = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email({ message: "Email not valid" })
    .max(100, { message: "Email should not be longer than 100 characters" }),
  password: z
    .string({ required_error: "Password is required" })
    .max(100, { message: "Password should not be longer than 100 characters" }),
});
