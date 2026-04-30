import axiosInstance from "@/lib/axios";
import {
  Order,
  CreateOrderPayload,
  GetAllOrdersParams,
  GetAllOrdersResult,
} from "@/types";

export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<Order> => {
  const { data } = await axiosInstance.post<{ order: Order }>(
    "/orders",
    payload,
  );
  return data.order;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const { data } = await axiosInstance.get<{ orders: Order[] }>("/orders/me");
  return data.orders;
};

export const getAllOrders = async (
  params: GetAllOrdersParams = {},
): Promise<GetAllOrdersResult> => {
  const { data } = await axiosInstance.get<GetAllOrdersResult>("/orders", {
    params,
  });
  return data;
};

export const updateOrderStatus = async (
  id: string,
  status: Order["status"],
): Promise<Order> => {
  const { data } = await axiosInstance.put<{ order: Order }>(`/orders/${id}`, {
    status,
  });
  return data.order;
};
