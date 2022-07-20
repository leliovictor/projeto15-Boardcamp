import { Router } from "express";

import { getRentals } from "../controllers/rentalsController.js";

const rentalsController = Router();

rentalsController.get("/rentals", getRentals);

export default rentalsController;