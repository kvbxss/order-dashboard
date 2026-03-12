import { useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { Order } from "../model/order.types";
import { validateOrderDraft } from "../model/order.validation";
import {
  createOrdersTableColumns,
  type OrderDraft,
} from "./ordersTable.columns";

type OrdersTableProps = {
  orders: Order[];
  isMutating: boolean;
  onDeleteOrder: (id: string) => Promise<boolean>;
  onUpdateOrder: (
    id: string,
    data: Pick<Order, "destinationCountry" | "shippingDate" | "price">,
  ) => Promise<boolean>;
};

export function OrdersTable({
  orders,
  isMutating,
  onDeleteOrder,
  onUpdateOrder,
}: OrdersTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<OrderDraft>({
    destinationCountry: "",
    shippingDate: "",
    price: "",
  });

  const startEditing = (order: Order) => {
    setEditingId(order.id);
    setDraft({
      destinationCountry: order.destinationCountry,
      shippingDate: order.shippingDate,
      price: order.price.toString(),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft({
      destinationCountry: "",
      shippingDate: "",
      price: "",
    });
  };

  const draftErrors = validateOrderDraft(draft);
  const canSaveEdit = Object.keys(draftErrors).length === 0;

  const saveEditing = async (id: string) => {
    if (!canSaveEdit) {
      return;
    }

    const didSave = await onUpdateOrder(id, {
      destinationCountry: draft.destinationCountry.trim(),
      shippingDate: draft.shippingDate,
      price: Number(draft.price),
    });

    if (didSave) {
      cancelEditing();
    }
  };

  const columns = createOrdersTableColumns({
    editingId,
    draft,
    setDraft,
    onStartEdit: startEditing,
    onSaveEdit: saveEditing,
    onCancelEdit: cancelEditing,
    canSaveEdit,
    draftErrorMessage:
      draftErrors.destinationCountry ??
      draftErrors.shippingDate ??
      draftErrors.price,
    isMutating,
    onDeleteOrder,
  });

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5 shadow-[0_10px_24px_rgba(24,18,12,0.06)]">
      {orders.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-[var(--border-soft)] text-[var(--text-muted)]">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="py-3 pr-4 font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b border-[#ece3d8]">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="py-3 pr-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
