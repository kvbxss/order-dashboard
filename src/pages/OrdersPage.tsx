import { useOrderStore } from "../store/order.store";
import { ui } from "../styles/ui";
import { OrderForm } from "../domains/orders/ui/OrderForm";
import { OrdersTable } from "../domains/orders/ui/ordersTable/OrdersTable";

export default function OrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const isMutating = useOrderStore((state) => state.isMutating);
  const mutationError = useOrderStore((state) => state.mutationError);
  const clearMutationError = useOrderStore((state) => state.clearMutationError);
  const resetOrders = useOrderStore((state) => state.resetOrders);
  const createOrder = useOrderStore((state) => state.createOrder);
  const updateOrder = useOrderStore((state) => state.updateOrder);
  const deleteOrder = useOrderStore((state) => state.deleteOrder);

  const handleAddOrder = async (data: {
    destinationCountry: string;
    shippingDate: string;
    price: number;
  }) => {
    return createOrder({
      id: crypto.randomUUID(),
      destinationCountry: data.destinationCountry,
      shippingDate: data.shippingDate,
      price: data.price,
    });
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className={ui.pageTitle}>Orders</h2>
        {mutationError ? (
          <p
            className="mt-3 inline-flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="status"
          >
            {mutationError}{" "}
            <button
              type="button"
              onClick={clearMutationError}
              className="font-semibold underline underline-offset-2"
            >
              Dismiss
            </button>
          </p>
        ) : null}
        <div className="mt-3">
          <button
            type="button"
            onClick={resetOrders}
            className="rounded-md border border-(--border-soft) bg-[#f4ecdf] px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-(--text-muted) transition hover:bg-[#eadfcd]"
          >
            Reset orders
          </button>
        </div>
      </div>

      <OrderForm onAddOrder={handleAddOrder} isSubmitting={isMutating} />
      <OrdersTable
        orders={orders}
        isMutating={isMutating}
        onDeleteOrder={deleteOrder}
        onUpdateOrder={updateOrder}
      />
    </section>
  );
}
