import type { Order } from "./order.types";

export const getTotalOrders = (orders: Order[]) => orders.length;

export const getTotalPrice = (orders: Order[]) =>
  orders.reduce((sum, order) => sum + order.price, 0);

export const getUniqueCountries = (orders: Order[]) =>
  new Set(orders.map((order) => order.destinationCountry)).size;
