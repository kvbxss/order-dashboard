import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Order } from "./order.types";
import { orderApi } from "./order.api";
import { sanitizeOrder, sanitizeOrderData } from "./order.validation";

type OrderState = {
  orders: Order[];
  isMutating: boolean;
  mutationError: string | null;
  createOrder: (order: Order) => Promise<boolean>;
  updateOrder: (
    id: string,
    data: Pick<Order, "destinationCountry" | "shippingDate" | "price">,
  ) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  clearMutationError: () => void;
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isMutating: false,
      mutationError: null,
      createOrder: async (order) => {
        set({ isMutating: true, mutationError: null });

        try {
          const created = await orderApi.createOrder(order);

          if (
            get().orders.some(
              (existingOrder) => existingOrder.id === created.id,
            )
          ) {
            throw new Error("Order id already exists.");
          }

          set((state) => ({
            orders: [...state.orders, created],
          }));

          return true;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Creating order failed.";
          set({ mutationError: message });
          return false;
        } finally {
          set({ isMutating: false });
        }
      },
      updateOrder: async (id, data) => {
        set({ isMutating: true, mutationError: null });

        try {
          const sanitized = await orderApi.updateOrder(data);
          const hasOrder = get().orders.some((order) => order.id === id);

          if (!hasOrder) {
            throw new Error("Order not found.");
          }

          set((state) => ({
            orders: state.orders.map((order) =>
              order.id === id ? { ...order, ...sanitized } : order,
            ),
          }));

          return true;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Updating order failed.";
          set({ mutationError: message });
          return false;
        } finally {
          set({ isMutating: false });
        }
      },
      deleteOrder: async (id) => {
        set({ isMutating: true, mutationError: null });

        try {
          await orderApi.deleteOrder(id);
          const hasOrder = get().orders.some((order) => order.id === id);

          if (!hasOrder) {
            throw new Error("Order not found.");
          }

          set((state) => ({
            orders: state.orders.filter((order) => order.id !== id),
          }));

          return true;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Deleting order failed.";
          set({ mutationError: message });
          return false;
        } finally {
          set({ isMutating: false });
        }
      },
      clearMutationError: () => set({ mutationError: null }),
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
