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
          className="w-full rounded-lg border border-slate-300 px-2 py-1 outline-none focus:border-slate-500"
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
          className="w-full rounded-lg border border-slate-300 px-2 py-1 outline-none focus:border-slate-500"
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
          className="w-full rounded-lg border border-slate-300 px-2 py-1 outline-none focus:border-slate-500"
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
              className="rounded-lg px-3 py-1 text-sm font-medium text-emerald-700 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:text-emerald-300"
            >
              {isMutating ? "Saving..." : "Save"}
            </button>
            <button
              onClick={onCancelEdit}
              disabled={isMutating}
              className="rounded-lg px-3 py-1 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => onStartEdit(row.original)}
              disabled={isMutating}
              className="rounded-lg px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:text-blue-300"
            >
              Edit
            </button>
            <button
              onClick={async () => {
                await onDeleteOrder(row.original.id);
              }}
              disabled={isMutating}
              className="rounded-lg px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:text-red-300"
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
