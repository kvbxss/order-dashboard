import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { useOrderStore } from "../../../store/order.store";
import { useOrderMutations } from "./order.mutations";

vi.mock("./order.api", () => ({
  orderApi: {
    createOrder: vi.fn(async (order) => order),
    updateOrder: vi.fn(async (data) => data),
    deleteOrder: vi.fn(async (id) => id),
  },
}));

describe("useOrderMutations", () => {
  beforeEach(() => {
    useOrderStore.setState({ orders: [] });
    vi.clearAllMocks();
  });

  it("creates, updates and deletes orders via store actions", async () => {
    const { result } = renderHook(() => useOrderMutations());

    let created = false;
    await act(async () => {
      created = await result.current.createOrder({
        id: "order-1",
        destinationCountry: "Poland",
        shippingDate: "2026-03-12",
        price: 100,
      });
    });
    expect(created).toBe(true);
    expect(useOrderStore.getState().orders).toHaveLength(1);

    let updated = false;
    await act(async () => {
      updated = await result.current.updateOrder("order-1", {
        destinationCountry: "Germany",
        shippingDate: "2026-03-13",
        price: 150,
      });
    });
    expect(updated).toBe(true);
    expect(useOrderStore.getState().orders[0]?.destinationCountry).toBe(
      "Germany",
    );

    let deleted = false;
    await act(async () => {
      deleted = await result.current.deleteOrder("order-1");
    });
    expect(deleted).toBe(true);
    expect(useOrderStore.getState().orders).toEqual([]);
  });

  it("sets mutation error when updating a missing order", async () => {
    const { result } = renderHook(() => useOrderMutations());

    await act(async () => {
      await result.current.updateOrder("missing", {
        destinationCountry: "Poland",
        shippingDate: "2026-03-12",
        price: 100,
      });
    });

    expect(result.current.mutationError).toBe("Order not found.");

    act(() => {
      result.current.clearMutationError();
    });
    expect(result.current.mutationError).toBeNull();
  });
});
