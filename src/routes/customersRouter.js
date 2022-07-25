import { Router } from "express";

import { getCustomers, getCustomersById, postCustomer, updateCustomer } from "../controllers/customersControler.js";
import {checkCustomerId, checkBodyPostCustomer, checkDuplicateCpf} from "../middlewares/customersMiddlewares.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", checkCustomerId, getCustomersById);
customersRouter.post("/customers", checkBodyPostCustomer, checkDuplicateCpf, postCustomer);
customersRouter.put("/customers/:id", checkBodyPostCustomer, checkCustomerId, updateCustomer);

export default customersRouter;