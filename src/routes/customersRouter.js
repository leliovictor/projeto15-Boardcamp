import { Router } from "express";

import { getCustomers } from "../controllers/customersControler.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);

export default customersRouter;