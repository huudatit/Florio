// ─── Auth ──────────────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface SignUpPayload {
  username: string;
  email: string;
  password: string;
}

export interface SignInPayload {
  username: string;
  password: string;
}

export interface SignInResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export interface Category {
  _id: string;
  id: string; // slug, vd: "hoa-valentine"
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  id: string;
  name: string;
  description?: string;
}

export interface UpdateCategoryPayload {
  name: string;
  description?: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  _id: string;
  name: string;
  category: Pick<Category, "_id" | "id" | "name">;
  price: number;
  tags: string[];
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string; // MongoDB ObjectId của Category
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "newest";
}

export interface Pagination {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
}

export interface GetProductsResult {
  data: Product[];
  pagination: Pagination;
}

export interface CreateProductPayload {
  name: string;
  category: string; // ObjectId
  price: number;
  tags?: string[];
  imageUrl?: string;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface OrderItem {
  product: Pick<Product, "_id" | "name" | "imageUrl" | "price">;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  userId: string | Pick<User, "_id" | "username" | "email">;
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderPayload {
  customerName: string;
  phone: string;
  email: string;
  shippingAddress: string;
  items: { productId: string; quantity: number }[];
}

export interface GetAllOrdersParams {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export interface GetAllOrdersResult {
  orders: Order[];
  pagination: Pagination;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}
