import { ResponseError } from "../error/response-error.js";

export const validate = (schema, request) => {
  const result = schema.safeParse(request);

  if (result.error) {
    throw new ResponseError(400, result.error.errors[0].message);
  } else {
    return result;
  }
};
