import { validate } from "../validation/validation.js";
import { reflectionValidation } from "../validation/reflection-validation.js";
import { pool } from "../models/pg-config.js";
import { ResponseError } from "../error/response-error.js";

export const createReflection = async (user, request) => {
  const reflection = validate(reflectionValidation, request);

  const { id } = user;

  const { success, low_point, take_away } = reflection.data;

  try {
    await pool.query("BEGIN");

    const reflectionQueryInsert = `
    INSERT INTO reflection (user_id, success, low_point, take_away)
    VALUES ($1, $2, $3, $4)
    RETURNING id, success, low_point, take_away, user_id , createdat, updatedat
  `;

    const reflectionValues = [id, success, low_point, take_away];

    const { rows: reflectionRows } = await pool.query(
      reflectionQueryInsert,
      reflectionValues
    );

    await pool.query("COMMIT");

    return {
      id: reflectionRows[0].id,
      success: reflectionRows[0].success,
      low_point: reflectionRows[0].low_point,
      take_away: reflectionRows[0].take_away,
      user_id: reflectionRows[0].user_id,
      createdAt: reflectionRows[0].createdat,
      updatedAt: reflectionRows[0].updatedat,
    };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw new ResponseError(400, error.message);
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

    const totalItem = parseInt(countResult[0].count);
    const totalPages = Math.ceil(totalItem / itemsPerPage);
    const offset = (page - 1) * itemsPerPage;

    const getReflectionQuery = `
    SELECT * FROM reflection
    WHERE user_id = $1
    ORDER BY createdat DESC
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
        createdAt: row.createdat,
        updatedAt: row.updatedat,
      })),
      paging: {
        page,
        total_page: totalPages,
        total_item: totalItem,
      },
    };
  } catch (error) {
    throw new ResponseError(500, error.message);
  }
};

export const updateReflection = async (user, request) => {
  const reflection = validate(reflectionValidation, request);

  const { id } = user;
  const { reflectionId, success, low_point, take_away } = reflection.data;

  try {
    const updateReflectionQuery = `
      UPDATE reflection
      SET success = $1, low_point = $2, take_away = $3, updatedAt = now()
      WHERE id = $4 AND user_id = $5
      RETURNING id, success, low_point, take_away, user_id, createdat, updatedat
    `;

    const { rows } = await pool.query(updateReflectionQuery, [
      success,
      low_point,
      take_away,
      reflectionId,
      id,
    ]);

    if (rows.length > 0) {
      return {
        id: rows[0].id,
        success: rows[0].success,
        low_point: rows[0].low_point,
        take_away: rows[0].take_away,
        UserId: rows[0].user_id,
        createdAt: rows[0].createdat,
        updatedAt: rows[0].updatedat,
      };
    } else {
      throw new ResponseError(404, "Reflection not found");
    }
  } catch (error) {
    throw new ResponseError(500, error.message);
  }
};

export const removeReflection = async (user, request) => {
  const { id } = user;
  const { reflectionId } = request;

  try {
    const deleteReflectionQuery = `
      DELETE FROM reflection
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;

    const { rows } = await pool.query(deleteReflectionQuery, [
      reflectionId,
      id,
    ]);

    if (rows.length > 0) {
      return {
        message: "Success deleted",
      };
    } else {
      throw new ResponseError(404, "Reflection not found");
    }
  } catch (error) {
    throw new ResponseError(500, error.message);
  }
};
