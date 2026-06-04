import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {db} from "./config/db";
import errorMiddleware from "./middlewares/error.middleware";
import  authRoutes  from "./modules/auth/auth.routes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({success: true, message: "StockWise backend is healthy!" });
});

app.get("/api/v1/health/db-check", async(req, res) => {
  const [rows] = await db.query("SELECT 1+1 AS result")
  res.status(200).json({success: true, message: "StockWise backend is healthy!" , data:rows });
});



app.use("/api/v1/auth", authRoutes)

app.use(errorMiddleware);
export default app;