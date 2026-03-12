import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  getTotalOrders,
  getTotalPrice,
  getUniqueCountries,
} from "../domains/orders/model/order.selectors";
import { useOrderStore } from "./order.store";

vi.mock("./order.api", () => ({
  orderApi: {
    createOrder: vi.fn(async (order) => order),
    updateOrder: vi.fn(async (data) => data),
    deleteOrder: vi.fn(async (id) => id),
  },
}));

describe("order store", () => {
  beforeEach(() => {
    localStorage.clear();
    useOrderStore.setState({
      orders: [],
      isMutating: false,
      mutationError: null,
    });
  });

  it("keeps dashboard metrics in sync with CRUD changes", async () => {
    const orderId = "order-1";

    const created = await useOrderStore.getState().createOrder({
      id: orderId,
      destinationCountry: "poland",
      shippingDate: "2026-03-12",
      price: 100,
    });
    expect(created).toBe(true);

    let orders = useOrderStore.getState().orders;
    expect(getTotalOrders(orders)).toBe(1);
    expect(getTotalPrice(orders)).toBe(100);
    expect(getUniqueCountries(orders)).toBe(1);

    const updated = await useOrderStore.getState().updateOrder(orderId, {
      destinationCountry: "Germany",
      shippingDate: "2026-03-13",
      price: 150,
    });
    expect(updated).toBe(true);

    orders = useOrderStore.getState().orders;
    expect(getTotalOrders(orders)).toBe(1);
    expect(getTotalPrice(orders)).toBe(150);
    expect(getUniqueCountries(orders)).toBe(1);

    const deleted = await useOrderStore.getState().deleteOrder(orderId);
    expect(deleted).toBe(true);

    orders = useOrderStore.getState().orders;
    expect(getTotalOrders(orders)).toBe(0);
    expect(getTotalPrice(orders)).toBe(0);
    expect(getUniqueCountries(orders)).toBe(0);
  });

  it("exposes clear mutation error on invalid update", async () => {
    const updated = await useOrderStore.getState().updateOrder("missing", {
      destinationCountry: "Poland",
      shippingDate: "2026-03-12",
      price: 200,
    });

    expect(updated).toBe(false);
    expect(useOrderStore.getState().mutationError).toBe("Order not found.");
  });
});
