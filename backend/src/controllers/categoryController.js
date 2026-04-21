import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });

    return res.status(200).json({ categories });

  } catch (error) {
    console.error("Lỗi khi gọi getCategories", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    }

    return res.status(200).json({ category });

  } catch (error) {
    console.error("Lỗi khi gọi getCategoryById ", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    if (!id || !name) {
      return res.status(400).json({ message: "Thiếu id và name!" });
    }

    const existing = await Category.findOne({ id });
    if (existing) {
      return res.status(400).json({ message: "Danh mục đã tồn tại!" });
    }

    const newCategory = await Category.create({ id, name, description });

    return res.status(201).json({ message: "Tạo danh mục thành công!", category: newCategory });

  } catch (error) {
    console.error("Lỗi khi gọi createCategory ", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Thiếu name!" });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      { name, description },
      { returnDocument: "after", runValidators: true },
    );

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    }

    return res.status(200).json({ message: "Cập nhật danh mục thành công!", category: category });

  } catch (error) {
    console.error("Lỗi khi gọi updateCategory ", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return res.status(404).json({ message: "Không tìm thấy danh mục!" });
    }

    return res.status(200).json({ message: `Đã xóa danh mục '${category.name}' thành công!` });

  } catch (error) {
    console.error("Lỗi khi gọi deleteCategory ", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
