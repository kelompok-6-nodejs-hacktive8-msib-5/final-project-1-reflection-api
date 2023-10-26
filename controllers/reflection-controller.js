import {
  createReflection,
  getReflection,
  removeReflection,
  updateReflection,
} from "../services/reflection-service.js";

export const createReflectionController = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    const result = await createReflection(user, request);

    res.status(201).json(result);
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

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const updateReflectionController = async (req, res, next) => {
  try {
    const user = req.user;
    const request = req.body;
    request.reflectionId = req.params.reflectionId;

    const result = await updateReflection(user, request);

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};

export const removeReflectionController = async (req, res, next) => {
  try {
    const user = req.user;
    const request = { reflectionId: req.params.reflectionId };

    const result = await removeReflection(user, request);

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
};
