import { Router } from "express";

import {
  getCategories,
  postCategories,
} from "../controllers/categoriesController.js";

import {
  validationCategoryBody,
  checkDuplicate,
} from "../middlewares/categoriesMiddlewares.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", validationCategoryBody, checkDuplicate, postCategories);

export default categoriesRouter;
