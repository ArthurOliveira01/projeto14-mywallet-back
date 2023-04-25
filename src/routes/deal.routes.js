import { getDeal, postDeal } from "../controllers/deal.controllers.js";
import { Router } from "express";

const dealRouter = Router();

dealRouter.post("/nova-transacao/:tipo", postDeal);
dealRouter.get("/home", getDeal);

export default dealRouter;