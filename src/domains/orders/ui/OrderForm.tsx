import { useState } from "react";
import { validateOrderDraft } from "../model/order.validation";
import { ui } from "../../../styles/ui";

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
      className={`grid gap-4 md:grid-cols-4 ${ui.panel} ${ui.panelPadding} ${ui.panelShadow}`}
    >
      <input
        type="text"
        placeholder="Destination country"
        value={destinationCountry}
        onChange={(e) => setDestinationCountry(e.target.value)}
        aria-invalid={Boolean(submitAttempted && validationErrors.destinationCountry)}
        className={ui.formInput}
      />

      <input
        type="date"
        value={shippingDate}
        onChange={(e) => setShippingDate(e.target.value)}
        aria-invalid={Boolean(submitAttempted && validationErrors.shippingDate)}
        className={ui.formInput}
      />

      <input
        type="number"
        min="0"
        step="0.01"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        aria-invalid={Boolean(submitAttempted && validationErrors.price)}
        className={ui.formInput}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className={`${ui.buttonPrimary} ${ui.buttonDisabled}`}
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
