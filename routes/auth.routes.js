import { Router } from "express";
import { signUp, signIn, signout } from "../controllers/auth.controller.js";

const authRouter = Router();

//path api for sign up, sign in, and sign out
authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signout);

export default authRouter;