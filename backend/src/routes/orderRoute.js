import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { isAdmin, protectedRoute } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protectedRoute);

// user routes
router.post("/", createOrder);
router.get("/me", getMyOrders);

// admin routes
router.get("/", isAdmin, getAllOrders);
router.put("/:id", isAdmin, updateOrderStatus);

export default router;
