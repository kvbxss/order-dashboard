import type { Order } from "./order.types";
import { sanitizeOrderData } from "./order.validation";

type OrderPayload = Pick<Order, "destinationCountry" | "shippingDate" | "price">;

const LATENCY_MS = 350;

const wait = (ms: number) =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, ms);
  });

const withLatency = async <T>(value: T) => {
  await wait(LATENCY_MS);
  return value;
};

export const orderApi = {
  async createOrder(order: Order) {
    const sanitized = sanitizeOrderData(order);
    if (!sanitized) {
      throw new Error("Order data is invalid.");
    }

    return withLatency({
      ...order,
      ...sanitized,
    });
  },
  async updateOrder(data: OrderPayload) {
    const sanitized = sanitizeOrderData(data);
    if (!sanitized) {
      throw new Error("Order update is invalid.");
    }

    return withLatency(sanitized);
  },
  async deleteOrder(id: string) {
    if (!id.trim()) {
      throw new Error("Order id is invalid.");
    }

    return withLatency(id);
  },
};
