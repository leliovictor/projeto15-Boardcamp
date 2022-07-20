import { Router } from "express";

import categoriesRouter from "./categoriesRouter.js";
import rentalsRouter from "./rentalsRouter.js";

const router = Router();

router.use(categoriesRouter);
router.use(rentalsRouter);

export default router;