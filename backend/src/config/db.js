import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Kết nối CSDL thành công!");
  } catch (error) {
    console.error("Lỗi khi kết nối CSDL!", error);
    process.exit(1);
  }
};

export default connectDB;
