import { createUser, getUser } from "../controllers/users";
import express, { RequestHandler } from "express";

const userRouter = express.Router();

userRouter.post("/users", createUser);
userRouter.get("/users", getUser);

export default userRouter;