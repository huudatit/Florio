import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectedRoute = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);
          return res
            .status(403)
            .json({ message: "Access token hết hạn hoặc không đúng!" });
        }

        const user = await User.findById(decodedUser.userId).select(
          "-password",
        );

        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }

        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const isAdmin = (req, res, next) => {
  try {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: "Truy cập bị từ chối! Tính năng chỉ dảnh cho admin!" });
    }
  } catch (error) {
    console.error("Lỗi khi xác minh role", error);
    return res.status(500).json({ message: "Lỗi hệ thống!" });
  }
}
