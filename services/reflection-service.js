import { validate } from "../validation/validation.js";
import { reflectionValidation } from "../validation/reflection-validation.js";
import { pool } from "../models/pg-config.js";
import { ResponseError } from "../error/response-error.js";

export const createReflection = async (user, request) => {
  const reflection = validate(reflectionValidation, request);

  const { success, low_point, take_away } = reflection.data;

  const { id } = user;

  try {
    await pool.query("BEGIN");

    const reflectionQueryInsert = `
    INSERT INTO reflection (user_id, success, low_point, take_away)
    VALUES ($1, $2, $3, $4)
    RETURNING id, success, low_point, take_away
  `;

    const reflectionValues = [id, success, low_point, take_away];

    const { rows: reflectionRows } = await pool.query(
      reflectionQueryInsert,
      reflectionValues
    );

    await pool.query("COMMIT");

    return {
      dataSuccess: reflectionRows[0].success,
      dataLowPoint: reflectionRows[0].low_point,
      dataTakeAaway: reflectionRows[0].take_away,
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw new ResponseError(500, error);
  }
};

export const getReflection = async (user, request) => {
  const { id } = user;
  const { page, itemsPerPage } = request;

  try {
    const getTotalItemCountQuery = `
      SELECT COUNT(*) FROM reflection
      WHERE user_id = $1
    `;

    const { rows: countResult } = await pool.query(getTotalItemCountQuery, [
      id,
    ]);

    const totalItem = parseInt(countResult[0].count, 10);
    const totalPages = Math.ceil(totalItem / itemsPerPage);
    const offset = (page - 1) * itemsPerPage;

    const getReflectionQuery = `
    SELECT * FROM reflection
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT $2
    OFFSET $3
    `;

    const { rows } = await pool.query(getReflectionQuery, [
      id,
      itemsPerPage,
      offset,
    ]);

    return {
      data: rows.map((row) => ({
        id: row.id,
        success: row.success,
        low_point: row.low_point,
        take_away: row.take_away,
        UserId: row.user_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      paging: {
        page,
        total_page: totalPages,
        total_item: totalItem,
      },
    };
  } catch (error) {
    throw new ResponseError(500, error);
  }
};
