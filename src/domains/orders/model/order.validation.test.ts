import { describe, expect, it } from "vitest";
import {
  sanitizeOrder,
  sanitizeOrderData,
  validateOrderDraft,
} from "./order.validation";

describe("order validation", () => {
  it("normalizes valid order data", () => {
    const result = sanitizeOrderData({
      destinationCountry: "   united   STATES ",
      shippingDate: "2026-03-12",
      price: 12.345,
    });

    expect(result).toEqual({
      destinationCountry: "United States",
      shippingDate: "2026-03-12",
      price: 12.35,
    });
  });

  it("rejects invalid draft data", () => {
    const errors = validateOrderDraft({
      destinationCountry: " ",
      shippingDate: "2026-13-99",
      price: "0",
    });

    expect(errors.destinationCountry).toBeDefined();
    expect(errors.shippingDate).toBeDefined();
    expect(errors.price).toBeDefined();
  });

  it("rejects malformed persisted order payload", () => {
    const result = sanitizeOrder({
      id: "",
      destinationCountry: "Poland",
      shippingDate: "2026-03-12",
      price: 100,
    });

    expect(result).toBeNull();
  });
});
