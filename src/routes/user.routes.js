import { signup, login } from "../controllers/user.controllers.js";
import { Router } from "express";


const userRouter = Router();

userRouter.post("/cadastro", signup);
userRouter.post("/", login);

export default userRouter;
