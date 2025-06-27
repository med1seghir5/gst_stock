import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import db from "./config/db.js";
import authRoute from "./Routes/authRoute.js"
import productRoute from "./Routes/productRoute.js"

dotenv.config();
db();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true
}));


app.use("/auth", authRoute)
app.use("/api", productRoute)

const PORT = process.env.PORT || 3000 ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));