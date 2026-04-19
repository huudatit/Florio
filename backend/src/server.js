import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
import connectDB from "./config/db.js";
import productRoute from "./routes/productRoute.js";
import orderRoute from "./routes/orderRoute.js";
import authRoute from "./routes/authRoute.js";

dotenv.config();

const PORT = process.env.PORT || 5001;
const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// swagger
const swaggerDocument = JSON.parse(fs.readFileSync("./src/swagger.json", "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// api
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);

connectDB().then(
  app.listen(PORT, () => {
    console.log(`Server đang chạy tại cổng ${PORT}`);
  }),
);
