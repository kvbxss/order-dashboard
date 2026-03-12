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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {orders.length === 0 ? (
        <p className="text-sm text-slate-500">No orders yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-200 text-slate-500">
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
                <tr key={row.id} className="border-b border-slate-100">
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
