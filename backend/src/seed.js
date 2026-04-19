import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import rawData from "./data/flowers.json" with { type: "json" };

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Category.deleteMany({});
    await Product.deleteMany({});

    const createdCats = await Category.insertMany(rawData.categories);
    const catMap = {};
    createdCats.forEach((cat) => {
      catMap[cat.id] = cat._id;
    });

    const productData = rawData.products.map((p) => ({
      name: p.name,
      price: p.price,
      tags: p.tags,
      category: catMap[p.category],
    }));

    await Product.insertMany(productData);
    console.log("Seeding thành công: 70 sản phẩm đã được nhập!");

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Lỗi khi seeding:", error);
    process.exit(1);
  }
}

seed();
