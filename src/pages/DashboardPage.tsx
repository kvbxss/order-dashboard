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
        <h2 className="text-4xl font-bold tracking-tight">Dashboard</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Calculated metrics derived from the central store.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5 shadow-[0_10px_24px_rgba(24,18,12,0.06)]">
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">Total Orders</p>
          <p className="mt-2 text-3xl font-semibold">{totalOrders}</p>
        </div>

        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5 shadow-[0_10px_24px_rgba(24,18,12,0.06)]">
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">Total Revenue</p>
          <p className="mt-2 text-3xl font-semibold">
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5 shadow-[0_10px_24px_rgba(24,18,12,0.06)]">
          <p className="text-sm uppercase tracking-wide text-[var(--text-muted)]">Unique Countries</p>
          <p className="mt-2 text-3xl font-semibold">{uniqueCountries}</p>
        </div>
      </div>
    </section>
  );
}
