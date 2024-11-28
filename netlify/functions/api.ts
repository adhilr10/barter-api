import express, { Router } from "express";
import serverless from "serverless-http";
import userRouter from "../../src/routes/user";
import cors from "cors";

const api = express();

// Middleware
api.use(cors());
api.use(express.json());

// Routes
api.use("/api/v1", userRouter);

// Health check
api.get("/", (req, res) => {
  res.send("API is running");
});

// Setup serverless handler
export const handler = serverless(api); 