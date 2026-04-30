import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { OrderStatus } from "@/types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

interface StatusMeta {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
}

export const ORDER_STATUS_MAP: Record<OrderStatus, StatusMeta> = {
  Pending: { label: "Chờ xử lý", variant: "secondary" },
  Processing: { label: "Đang xử lý", variant: "default" },
  Shipped: { label: "Đang giao", variant: "default" },
  Delivered: { label: "Đã giao", variant: "outline" },
  Cancelled: { label: "Đã hủy", variant: "destructive" },
};
