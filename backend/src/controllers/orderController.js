import Order from "../models/Order.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const { customerName, phone, email, shippingAddress, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng của bạn đang trống!" });
    }

    if (!customerName || !phone || !email || !shippingAddress) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin!" });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: "Không tìm thấy sản phẩm!" });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const newOrder = new Order({
      userId: req.user._id,
      customerName,
      phone,
      email,
      shippingAddress,
      items: orderItems,
      totalAmount
    });

    await newOrder.save();

    return res.status(201).json({ message: "Tạo đơn hàng thành công!" , order: newOrder });
    
  } catch (error) {
    console.error("Lỗi khi gọi createOrder", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("items.product", "name imageUrl price")
      .sort({ createdAt: -1 })
    
    return res.status(200).json({ orders });

  } catch (error) {
    console.error("Lỗi khi gọi getMyOrders", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = [];
    if (status) query.status = status;

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 20);
    const skip = (safePage - 1) * safeLimit;

    const [orders, totalItems] = await Promise.all([
      Order.find(query)
        .populate("userId", "username email")
        .populate("items.product", "name imageUrl")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(safeLimit),
      Order.countDocuments(query),
    ]);

    return res.status(200).json({
      orders,
      pagination: {
        totalItems,
        currentPage: safePage,
        totalPages: Math.ceil(totalItems / safeLimit),
        itemsPerPage: safeLimit,
      },
    });

  } catch (error) {
    console.error("Lỗi khi gọi getAllOrders", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Trạng thái không hợp lệ!"
      });
    }

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { returnDocument: "after", runValidators: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng!" });
    }

    return res.status(200).json({ message: "Cập nhật trạng thái đơn hàng thành công!", order });

  } catch (error) {
    console.error("Lỗi khi gọi updateOrderStatus", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
}
