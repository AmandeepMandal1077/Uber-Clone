import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db/db.js";
import cors from "cors";
import express from "express";

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import userRouter from "./routes/user.route.js";

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/users", userRouter);

export default app;
