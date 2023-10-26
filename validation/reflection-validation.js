import { z } from "zod";

export const reflectionValidation = z.object({
  success: z.string({ required_error: "Success notes is required" }).max(500, {
    message: "success notes should not be longer than 500 characters",
  }),
  low_point: z.string({ required_error: "low point is required" }).max(500, {
    message: "Low point should not be longer than 500 characters",
  }),
  take_away: z.string({ required_error: "take away is required" }).max(500, {
    message: "Take away should not be longer than 500 characters",
  }),
  reflectionId: z.string().optional(),
});
