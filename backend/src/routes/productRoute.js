import express from "express";
import {
  createProduct,
  getProductById,
  getProducts,
} from "../controllers/productController.js";
import { protectedRoute, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.post("/", protectedRoute, isAdmin, createProduct);

export default router;
