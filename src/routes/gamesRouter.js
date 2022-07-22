import { Router } from "express";

import { getGames, postGame } from "../controllers/gamesController.js";
import {
  validationGameBody,
  checkNameDuplicate,
  checkIfExistCategoryId,
} from "../middlewares/gamesMiddlewares.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post(
  "/games",
  validationGameBody,
  checkNameDuplicate,
  checkIfExistCategoryId,
  postGame
);

export default gamesRouter;
