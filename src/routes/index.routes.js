import userRouter from "./user.routes.js";
import dealRouter from "./deal.routes.js";
import { Router } from "express";

const router = Router();
router.use(userRouter);
router.use(dealRouter);

export default router;