import type { Dispatch, SetStateAction } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "../../model/order.types";
import { ui } from "../../../../styles/ui";

export type OrderDraft = {
  destinationCountry: string;
  shippingDate: string;
  price: string;
};

type CreateOrdersTableColumnsArgs = {
  editingId: string | null;
  draft: OrderDraft;
  setDraft: Dispatch<SetStateAction<OrderDraft>>;
  onStartEdit: (order: Order) => void;
  onSaveEdit: (id: string) => Promise<void>;
  onCancelEdit: () => void;
  canSaveEdit: boolean;
  isMutating: boolean;
  onDeleteOrder: (id: string) => Promise<boolean>;
};

export const createOrdersTableColumns = ({
  editingId,
  draft,
  setDraft,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  canSaveEdit,
  isMutating,
  onDeleteOrder,
}: CreateOrdersTableColumnsArgs): ColumnDef<Order>[] => [
  {
    accessorKey: "destinationCountry",
    header: "Country",
    cell: ({ row }) =>
      editingId === row.original.id ? (
        <input
          type="text"
          value={draft.destinationCountry}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              destinationCountry: e.target.value,
            }))
          }
          className={ui.tableInput}
        />
      ) : (
        <span className={ui.rowValue}>
          {row.original.destinationCountry}
        </span>
      ),
  },
  {
    accessorKey: "shippingDate",
    header: "Shipping Date",
    cell: ({ row }) =>
      editingId === row.original.id ? (
        <input
          type="date"
          value={draft.shippingDate}
          onChange={(e) =>
            setDraft((prev) => ({
              ...prev,
              shippingDate: e.target.value,
            }))
          }
          className={ui.tableInput}
        />
      ) : (
        <span className={ui.rowValue}>
          {row.original.shippingDate}
        </span>
      ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) =>
      editingId === row.original.id ? (
        <input
          type="number"
          min="0"
          step="0.01"
          value={draft.price}
          onChange={(e) =>
            setDraft((prev) => ({ ...prev, price: e.target.value }))
          }
          className={ui.tableInput}
        />
      ) : (
        <span className={ui.rowValue}>{`$${row.original.price.toFixed(2)}`}</span>
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex h-9 items-center">
        <div className="flex gap-2">
          {editingId === row.original.id ? (
            <>
              <button
                onClick={() => onSaveEdit(row.original.id)}
                disabled={!canSaveEdit || isMutating}
                className={`${ui.actionButtonBase} bg-emerald-100 text-emerald-800 hover:bg-emerald-200`}
              >
                {isMutating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={onCancelEdit}
                disabled={isMutating}
                className={`${ui.actionButtonBase} border border-[var(--border-soft)] text-[var(--text-muted)] hover:bg-[#f3ebe0]`}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onStartEdit(row.original)}
                disabled={isMutating}
                className={`${ui.actionButtonBase} bg-[#dbe9ff] text-[#244d8f] hover:bg-[#c6ddff]`}
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await onDeleteOrder(row.original.id);
                }}
                disabled={isMutating}
                className={`${ui.actionButtonBase} bg-[#ffe4dc] text-[#992f12] hover:bg-[#ffd7cc]`}
              >
                {isMutating ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
      </div>
    ),
  },
];
