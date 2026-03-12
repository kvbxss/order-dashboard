import { useCallback, useState } from "react";
import { useOrderStore } from "../../../store/order.store";
import { orderApi } from "./order.api";
import type { Order } from "./order.types";

type MutationData = Pick<Order, "destinationCountry" | "shippingDate" | "price">;

export function useOrderMutations() {
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const clearMutationError = useCallback(() => {
    setMutationError(null);
  }, []);

  const createOrder = useCallback(async (order: Order): Promise<boolean> => {
    setIsMutating(true);
    setMutationError(null);

    try {
      const created = await orderApi.createOrder(order);
      const { orders, addOrder } = useOrderStore.getState();

      if (orders.some((existingOrder) => existingOrder.id === created.id)) {
        throw new Error("Order id already exists.");
      }

      addOrder(created);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Creating order failed.";
      setMutationError(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  }, []);

  const updateOrder = useCallback(
    async (id: string, data: MutationData): Promise<boolean> => {
      setIsMutating(true);
      setMutationError(null);

      try {
        const sanitized = await orderApi.updateOrder(data);
        const { orders, patchOrder } = useOrderStore.getState();

        if (!orders.some((order) => order.id === id)) {
          throw new Error("Order not found.");
        }

        patchOrder(id, sanitized);
        return true;
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Updating order failed.";
        setMutationError(message);
        return false;
      } finally {
        setIsMutating(false);
      }
    },
    [],
  );

  const deleteOrder = useCallback(async (id: string): Promise<boolean> => {
    setIsMutating(true);
    setMutationError(null);

    try {
      await orderApi.deleteOrder(id);
      const { orders, removeOrder } = useOrderStore.getState();

      if (!orders.some((order) => order.id === id)) {
        throw new Error("Order not found.");
      }

      removeOrder(id);
      return true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Deleting order failed.";
      setMutationError(message);
      return false;
    } finally {
      setIsMutating(false);
    }
  }, []);

  return {
    isMutating,
    mutationError,
    clearMutationError,
    createOrder,
    updateOrder,
    deleteOrder,
  };
}
