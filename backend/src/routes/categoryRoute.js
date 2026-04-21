import express from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/categoryController.js";
import { isAdmin, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

// public
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// admin
router.post("/", protectedRoute, isAdmin, createCategory);
router.put("/:id", protectedRoute, isAdmin, updateCategory);
router.delete("/:id", protectedRoute, isAdmin, deleteCategory);

export default router;
