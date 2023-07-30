import express from "express";
import dotenv from "dotenv";
import connectionDB from "./config/db.js";
import morgan from "morgan";
import authRouter from "./routers/authRouter.js";
import categoryRouter from "./routers/categoryRouter.js";
import productRouter from "./routers/productRouter.js";
import cors from "cors";
import bodyParser from 'body-parser'
dotenv.config();

connectionDB();

const app = express();
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json())
app.use((req, res , next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next()
})

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/product", productRouter);

app.get("/", (req, res) => {
  res.send("<h1>this is E-commerse App</h1>");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`server on port ${process.env.DEV_MODE} on ${PORT}`);
});
