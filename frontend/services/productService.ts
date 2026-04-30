import axiosInstance from "@/lib/axios";
import {
  Product,
  GetProductsParams,
  GetProductsResult,
  CreateProductPayload,
} from "@/types";

export const getProducts = async (
  params: GetProductsParams = {},
): Promise<GetProductsResult> => {
  const { data } = await axiosInstance.get<{ result: GetProductsResult }>(
    "/products",
    { params },
  );
  return data.result;
};

export const getProductById = async (id: string): Promise<Product> => {
  const { data } = await axiosInstance.get<{ product: Product }>(
    `/products/${id}`,
  );
  return data.product;
};

export const createProduct = async (
  payload: CreateProductPayload,
): Promise<Product> => {
  const { data } = await axiosInstance.post<{ product: Product }>(
    "/products",
    payload,
  );
  return data.product;
};
