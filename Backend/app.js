import dotenv from "dotenv";
dotenv.config();

import { connectDB } from "./db/db.js";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import { rateLimit } from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 1000,
  max: 1,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: "draft-8",
  legacyHeaders: false,
  ipv6Subnet: 56,
});

connectDB();

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", limiter);

import userRouter from "./routes/user.route.js";
import captainRouter from "./routes/captain.route.js";
import mapRouter from "./routes/map.route.js";

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/users", userRouter);
app.use("/captains", captainRouter);
app.use("/api", mapRouter);

export default app;
