import { describe, expect, it } from "vitest";
import {
  getTotalOrders,
  getTotalPrice,
  getUniqueCountries,
} from "./order.selectors";
import type { Order } from "./order.types";

const orders: Order[] = [
  {
    id: "1",
    destinationCountry: "Poland",
    shippingDate: "2026-03-10",
    price: 100.4,
  },
  {
    id: "2",
    destinationCountry: "Germany",
    shippingDate: "2026-03-11",
    price: 200,
  },
  {
    id: "3",
    destinationCountry: "Poland",
    shippingDate: "2026-03-12",
    price: 50,
  },
];

describe("order selectors", () => {
  it("returns total orders count", () => {
    expect(getTotalOrders(orders)).toBe(3);
  });

  it("returns total price sum", () => {
    expect(getTotalPrice(orders)).toBe(350.4);
  });

  it("returns unique country count", () => {
    expect(getUniqueCountries(orders)).toBe(2);
  });
});
