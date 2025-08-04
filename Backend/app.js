import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db/db.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

connectDB();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from "./routes/user.route.js";
import captainRouter from "./routes/captain.route.js";

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/users", userRouter);
app.use("/captains", captainRouter);

export default app;
