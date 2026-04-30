import axiosInstance from "@/lib/axios";
import {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@/types";

export const getCategories = async (): Promise<Category[]> => {
  const { data } = await axiosInstance.get<{ categories: Category[] }>(
    "/categories",
  );
  return data.categories;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const { data } = await axiosInstance.get<{ category: Category }>(
    `/categories/${id}`,
  );
  return data.category;
};

export const createCategory = async (
  payload: CreateCategoryPayload,
): Promise<Category> => {
  const { data } = await axiosInstance.post<{ category: Category }>(
    "/categories",
    payload,
  );
  return data.category;
};

export const updateCategory = async (
  id: string,
  payload: UpdateCategoryPayload,
): Promise<Category> => {
  const { data } = await axiosInstance.put<{ category: Category }>(
    `/categories/${id}`,
    payload,
  );
  return data.category;
};

export const deleteCategory = async (id: string): Promise<string> => {
  const { data } = await axiosInstance.delete<{ message: string }>(
    `/categories/${id}`,
  );
  return data.message;
};
