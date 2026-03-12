import type { Order } from "./order.types";

type OrderData = Pick<Order, "destinationCountry" | "shippingDate" | "price">;
type OrderDraft = {
  destinationCountry: string;
  shippingDate: string;
  price: string;
};

export type OrderValidationErrors = Partial<
  Record<"destinationCountry" | "shippingDate" | "price", string>
>;

const roundToCents = (value: number) => Math.round(value * 100) / 100;

const normalizeCountry = (value: string) =>
  value
    .trim()
    .replace(/\s+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

const isValidIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00Z`);

  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
};

export const validateOrderDraft = (draft: OrderDraft): OrderValidationErrors => {
  const errors: OrderValidationErrors = {};

  if (!normalizeCountry(draft.destinationCountry)) {
    errors.destinationCountry = "Destination country is required.";
  }

  if (!isValidIsoDate(draft.shippingDate)) {
    errors.shippingDate = "Shipping date must be a valid date.";
  }

  const parsedPrice = Number(draft.price);
  if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
    errors.price = "Price must be greater than 0.";
  }

  return errors;
};

export const validateOrderData = (data: OrderData): OrderValidationErrors => {
  return validateOrderDraft({
    destinationCountry: data.destinationCountry,
    shippingDate: data.shippingDate,
    price: data.price.toString(),
  });
};

export const sanitizeOrderData = (data: OrderData): OrderData | null => {
  const country = normalizeCountry(data.destinationCountry);
  const shippingDate = data.shippingDate.trim();
  const price = roundToCents(data.price);

  const errors = validateOrderData({
    destinationCountry: country,
    shippingDate,
    price,
  });

  if (Object.keys(errors).length > 0) {
    return null;
  }

  return {
    destinationCountry: country,
    shippingDate,
    price,
  };
};

export const sanitizeOrder = (value: unknown): Order | null => {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const order = value as Partial<Order>;

  if (typeof order.id !== "string" || !order.id.trim()) {
    return null;
  }

  if (
    typeof order.destinationCountry !== "string" ||
    typeof order.shippingDate !== "string" ||
    typeof order.price !== "number"
  ) {
    return null;
  }

  const sanitizedData = sanitizeOrderData({
    destinationCountry: order.destinationCountry,
    shippingDate: order.shippingDate,
    price: order.price,
  });

  if (!sanitizedData) {
    return null;
  }

  return {
    id: order.id,
    ...sanitizedData,
  };
};
