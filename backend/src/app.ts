import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import {db} from "./config/db";
import errorMiddleware from "./middlewares/error.middleware";
import  authRoutes  from "./modules/auth/auth.routes";
import storeRoutes from "./modules/store/store.routes";
import mascatRoutes from "./modules/masterCategory/masterCategory.routes"
import storeCategoryRoutes from "./modules/category/category.routes"

const app = express();

//middlewares
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());





//routes
app.use("/api/v1/auth", authRoutes)
app.use("/api/v1/store", storeRoutes);
app.use("/api/v1/master-categories", mascatRoutes)
app.use("/api/v1/store-categories", storeCategoryRoutes);



app.use(errorMiddleware);
export default app;