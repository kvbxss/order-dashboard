import { Link } from "react-router";
import { useOrderStore } from "../store/order.store";
import { ui } from "../styles/ui";
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
        <h2 className={ui.pageTitle}>Dashboard</h2>
        <p className={ui.leadText}>
          Calculated metrics derived from the central store.
        </p>
      </div>

      {totalOrders === 0 ? (
        <div className="rounded-2xl border border-dashed border-(--border-soft) bg-(--bg-panel) p-4 text-sm text-(--text-muted)">
          No orders yet. Create your first order in{" "}
          <Link
            to="/orders"
            className="font-semibold text-(--accent) underline underline-offset-2"
          >
            Orders
          </Link>
          .
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className={`${ui.panel} ${ui.panelPadding} ${ui.panelShadow}`}>
          <p className={`text-sm uppercase tracking-wide ${ui.mutedText}`}>
            Total Orders
          </p>
          <p className="mt-2 text-3xl font-semibold">{totalOrders}</p>
        </div>

        <div className={`${ui.panel} ${ui.panelPadding} ${ui.panelShadow}`}>
          <p className={`text-sm uppercase tracking-wide ${ui.mutedText}`}>
            Total Revenue
          </p>
          <p className="mt-2 text-3xl font-semibold">
            ${totalPrice.toFixed(2)}
          </p>
        </div>

        <div className={`${ui.panel} ${ui.panelPadding} ${ui.panelShadow}`}>
          <p className={`text-sm uppercase tracking-wide ${ui.mutedText}`}>
            Unique Countries
          </p>
          <p className="mt-2 text-3xl font-semibold">{uniqueCountries}</p>
        </div>
      </div>
    </section>
  );
}
