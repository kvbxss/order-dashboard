import { useState } from "react";
import { validateOrderDraft } from "../model/order.validation";

type OrderFormProps = {
  onAddOrder: (data: {
    destinationCountry: string;
    shippingDate: string;
    price: number;
  }) => Promise<boolean>;
  isSubmitting: boolean;
};

export function OrderForm({ onAddOrder, isSubmitting }: OrderFormProps) {
  const [destinationCountry, setDestinationCountry] = useState("");
  const [shippingDate, setShippingDate] = useState("");
  const [price, setPrice] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const validationErrors = validateOrderDraft({
    destinationCountry,
    shippingDate,
    price,
  });
  const isValid = Object.keys(validationErrors).length === 0;

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!isValid) {
      return;
    }

    const didSave = await onAddOrder({
      destinationCountry: destinationCountry.trim(),
      shippingDate,
      price: Number(price),
    });

    if (!didSave) {
      return;
    }

    setDestinationCountry("");
    setShippingDate("");
    setPrice("");
    setSubmitAttempted(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-2xl border border-[var(--border-soft)] bg-[var(--bg-panel)] p-5 shadow-[0_10px_24px_rgba(24,18,12,0.06)] md:grid-cols-4"
    >
      <input
        type="text"
        placeholder="Destination country"
        value={destinationCountry}
        onChange={(e) => setDestinationCountry(e.target.value)}
        aria-invalid={Boolean(submitAttempted && validationErrors.destinationCountry)}
        className="rounded-xl border border-[var(--border-soft)] bg-white px-3 py-2 outline-none transition focus:border-[var(--accent)]"
      />

      <input
        type="date"
        value={shippingDate}
        onChange={(e) => setShippingDate(e.target.value)}
        aria-invalid={Boolean(submitAttempted && validationErrors.shippingDate)}
        className="rounded-xl border border-[var(--border-soft)] bg-white px-3 py-2 outline-none transition focus:border-[var(--accent)]"
      />

      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        aria-invalid={Boolean(submitAttempted && validationErrors.price)}
        className="rounded-xl border border-[var(--border-soft)] bg-white px-3 py-2 outline-none transition focus:border-[var(--accent)]"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-xl bg-[var(--accent)] px-4 py-2 font-semibold text-[var(--accent-contrast)] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-55"
      >
        {isSubmitting ? "Saving..." : "Add order"}
      </button>

      {submitAttempted && !isValid ? (
        <p className="md:col-span-4 text-sm text-red-600" role="status">
          {validationErrors.destinationCountry ??
            validationErrors.shippingDate ??
            validationErrors.price}
        </p>
      ) : null}
    </form>
  );
}
