import { useOrderStore } from "../domains/orders/model/order.store";
import { OrderForm } from "../domains/orders/ui/OrderForm";
import { OrdersTable } from "../domains/orders/ui/OrdersTable";

export default function OrdersPage() {
  const orders = useOrderStore((state) => state.orders);
  const isMutating = useOrderStore((state) => state.isMutating);
  const mutationError = useOrderStore((state) => state.mutationError);
  const clearMutationError = useOrderStore((state) => state.clearMutationError);
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
        <h2 className="text-4xl font-bold tracking-tight">Orders</h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Create and manage orders from a single source of truth.
        </p>
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
