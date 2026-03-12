import { useOrderStore } from "../domains/orders/model/order.store";
import {
  getTotalOrders,
  getTotalPrice,
  getUniqueCountries,
} from "../domains/orders/model/order.selectors";

export default function DashboardPage() {
  const orders = useOrderStore((state) => state.orders);

  const totalOrders = getTotalOrders(orders);
  const totalPrice = getTotalPrice(orders);
  const uniqueCountries = getUniqueCountries(orders);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-600">
          Calculated metrics derived from the central store.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold">{totalOrders}</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold">
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Unique Countries</p>
          <p className="mt-2 text-3xl font-semibold">{uniqueCountries}</p>
        </div>
      </div>
    </section>
  );
}
