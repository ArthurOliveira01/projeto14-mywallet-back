import { getDeal, postDeal } from "../controllers/deal.controllers";
import { Router } from "express";

const dealRouter = Router();

dealRouter.post("/nova-transacao/:tipo", postDeal);
dealRouter.get("home", getDeal);

export default dealRouter;