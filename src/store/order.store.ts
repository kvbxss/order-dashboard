import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Order } from "../domains/orders/model/order.types";
import {
  sanitizeOrder,
  sanitizeOrderData,
} from "../domains/orders/model/order.validation";

type OrderState = {
  orders: Order[];
  addOrder: (order: Order) => void;
  patchOrder: (
    id: string,
    data: Pick<Order, "destinationCountry" | "shippingDate" | "price">,
  ) => void;
  removeOrder: (id: string) => void;
  resetOrders: () => void;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),
      patchOrder: (id, data) =>
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id ? { ...order, ...data } : order,
          ),
        })),
      removeOrder: (id) =>
        set((state) => ({
          orders: state.orders.filter((order) => order.id !== id),
        })),
      resetOrders: () => set({ orders: [] }),
    }),
    {
      name: "orders-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ orders: state.orders }),
      migrate: (persistedState) => {
        const state = persistedState as { orders?: unknown } | undefined;
        const rawOrders = Array.isArray(state?.orders) ? state.orders : [];

        const deduplicatedOrders = rawOrders
          .map((order) => sanitizeOrder(order))
          .filter((order): order is Order => order !== null)
          .filter(
            (order, index, list) =>
              list.findIndex((candidate) => candidate.id === order.id) ===
              index,
          );

        const orders = deduplicatedOrders
          .map((order) => ({
            id: order.id,
            data: sanitizeOrderData(order),
          }))
          .filter(
            (
              entry,
            ): entry is {
              id: string;
              data: NonNullable<ReturnType<typeof sanitizeOrderData>>;
            } => entry.data !== null,
          )
          .map((entry) => ({
            id: entry.id,
            ...entry.data,
          }));

        return { orders };
      },
    },
  ),
);
