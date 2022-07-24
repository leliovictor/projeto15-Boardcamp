import { Router } from "express";

import { getCustomers, getCustomersById } from "../controllers/customersControler.js";
import {checkCustomerId} from "../middlewares/customersMiddlewares.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", checkCustomerId, getCustomersById);

export default customersRouter;