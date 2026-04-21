import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy,
      page = 1,
      limit = 10,
    } = req.query;

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice) {
        query.price.$lte = Number(maxPrice);
      }
    }

    let sortOptions = {};
    if (sortBy === "price_asc") sortOptions.price = 1;
    if (sortBy === "price_desc") sortOptions.price = -1;
    if (sortBy === "newest") sortOptions.createdAt = -1;

    const safePage = Math.max(1, Number(page) || 1);
    const safeLimit = Math.max(1, Number(limit) || 10);
    const skip = (safePage - 1) * safeLimit;

    const [products, totalItems] = await Promise.all([
      Product.find(query)
        .populate("category", "name id")
        .sort(sortOptions)
        .skip(skip)
        .limit(safeLimit),
      Product.countDocuments(query),
    ]);

    const result = {
      data: products,
      pagination: {
        totalItems,
        currentPage: safePage,
        totalPages: Math.ceil(totalItems / safeLimit),
        itemsPerPage: safeLimit,
      },
    };
    return res.status(200).json({ result });
  } catch (error) {
    console.error("Lỗi khi gọi getProducts", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Lỗi id không hợp lệ!" });
    }

    const product = await Product.findById(id).populate("category", "name id");

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm này!" });
    }

    return res.status(200).json({ product });
  } catch (error) {
    console.error("Lỗi khi gọi getProductById", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, category, price, tags, imageUrl } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Thiếu thông tin sản phẩm!" });
    }

    const categroryExists = await Category.findById(category);
    if (!categroryExists) {
      return res.status(404).json({ message: "Danh mục không tồn tại!" });
    }

    const newProduct = new Product.create({
      name,
      category,
      price,
      tags: tags || [],
      imageUrl: imageUrl || "https://placehold.co/600x400?text=Florio+Flower"
    });

    return res.status(201).json({ message: "Tạo sản phẩm thành công!", product: newProduct });

  } catch (error) {
    console.error("Lỗi khi gọi createProduct", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
