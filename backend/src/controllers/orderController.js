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
      customerName,
      phone,
      email,
      shippingAddress,
      items: orderItems,
      totalAmount
    });

    await newOrder.save();

    return res.status(201).json({ newOrder });
    
  } catch (error) {
    console.error("Lỗi khi gọi createOrder", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
