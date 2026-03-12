import type { Dispatch, SetStateAction } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import type { Order } from "../model/order.types";

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
  draftErrorMessage?: string;
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
  draftErrorMessage,
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
          className="w-full rounded-lg border border-[var(--border-soft)] bg-white px-2 py-1 outline-none transition focus:border-[var(--accent)]"
        />
      ) : (
        row.original.destinationCountry
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
          className="w-full rounded-lg border border-[var(--border-soft)] bg-white px-2 py-1 outline-none transition focus:border-[var(--accent)]"
        />
      ) : (
        row.original.shippingDate
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
          onChange={(e) => setDraft((prev) => ({ ...prev, price: e.target.value }))}
          className="w-full rounded-lg border border-[var(--border-soft)] bg-white px-2 py-1 outline-none transition focus:border-[var(--accent)]"
        />
      ) : (
        `$${row.original.price.toFixed(2)}`
      ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          {editingId === row.original.id ? (
            <>
              <button
                onClick={() => onSaveEdit(row.original.id)}
                disabled={!canSaveEdit || isMutating}
                className="rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800 hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isMutating ? "Saving..." : "Save"}
              </button>
              <button
                onClick={onCancelEdit}
                disabled={isMutating}
                className="rounded-lg border border-[var(--border-soft)] px-3 py-1 text-sm font-medium text-[var(--text-muted)] hover:bg-[#f3ebe0] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onStartEdit(row.original)}
                disabled={isMutating}
                className="rounded-lg bg-[#dbe9ff] px-3 py-1 text-sm font-medium text-[#244d8f] hover:bg-[#c6ddff] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await onDeleteOrder(row.original.id);
                }}
                disabled={isMutating}
                className="rounded-lg bg-[#ffe4dc] px-3 py-1 text-sm font-medium text-[#992f12] hover:bg-[#ffd7cc] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isMutating ? "Deleting..." : "Delete"}
              </button>
            </>
          )}
        </div>
        {editingId === row.original.id && !canSaveEdit ? (
          <span className="text-xs text-red-600">{draftErrorMessage}</span>
        ) : null}
      </div>
    ),
  },
];
