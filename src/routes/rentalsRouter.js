import { Router } from "express";

import { getRentals, postRentals, returnRental, deleteRental} from "../controllers/rentalsController.js";
import { checkBodyRentals, checkCustomerId, checkGameId, checkRentalExists } from "../middlewares/rentalsMiddlewares.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", checkBodyRentals, checkCustomerId, checkGameId, postRentals);
rentalsRouter.post("/rentals/:id/return", checkRentalExists, returnRental);
rentalsRouter.delete("/rentals/:id", checkRentalExists, deleteRental);

export default rentalsRouter;