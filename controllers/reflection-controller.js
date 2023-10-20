import {
  createReflection,
  getReflection,
} from "../services/reflection-service.js";

export const createReflectionController = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await createReflection(user, request);

    res.status(201).json({
      success: result.dataSuccess,
      low_point: result.dataLowPoint,
      take_away: result.dataTakeAaway,
    });
  } catch (e) {
    next(e);
  }
};

export const getReflectionController = async (req, res, next) => {
  try {
    const user = req.user;
    const request = {
      page: parseInt(req.query.page) || 1,
      itemsPerPage: parseInt(req.query.itemsPerPage) || 5,
    };

    const result = await getReflection(user, request);

    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};
