/** Quantity options for Sabzi Bazaar orders */

export type QtyOption = {
  value: number;
  labelKey: "qty_1kg" | "qty_500g" | "qty_250g" | "qty_125g";
  labelEn: string;
};

/** For kg-priced vegetables — stored as kg fraction */
export const KG_QTY_OPTIONS: QtyOption[] = [
  { value: 1, labelKey: "qty_1kg", labelEn: "1 kg" },
  { value: 0.5, labelKey: "qty_500g", labelEn: "½ kg (500 g)" },
  { value: 0.25, labelKey: "qty_250g", labelEn: "250 g" },
  { value: 0.125, labelKey: "qty_125g", labelEn: "125 g" },
];

/** For piece / bunch — integer count */
export const PIECE_QTY_OPTIONS: number[] = [1, 2, 3, 4, 5];

export function qtyOptionsForUnit(unit: string): { value: number; labelEn: string }[] {
  if (unit === "kg") {
    return KG_QTY_OPTIONS.map((o) => ({ value: o.value, labelEn: o.labelEn }));
  }
  return PIECE_QTY_OPTIONS.map((n) => ({
    value: n,
    labelEn: `${n} ${unit}${n > 1 ? "s" : ""}`,
  }));
}

/** Human-readable qty for cart / WhatsApp */
export function formatQuantity(quantity: number, unit: string): string {
  if (unit === "kg") {
    if (quantity >= 0.99) return `${quantity % 1 === 0 ? quantity : quantity.toFixed(2)} kg`;
    if (Math.abs(quantity - 0.5) < 0.001) return "½ kg (500 g)";
    if (Math.abs(quantity - 0.25) < 0.001) return "250 g";
    if (Math.abs(quantity - 0.125) < 0.001) return "125 g";
    const grams = Math.round(quantity * 1000);
    return `${grams} g`;
  }
  return `${quantity} ${unit}${quantity > 1 ? "s" : ""}`;
}

export function nearestQtyOption(quantity: number, unit: string): number {
  const opts = qtyOptionsForUnit(unit).map((o) => o.value);
  let best = opts[0];
  let bestDiff = Math.abs(quantity - best);
  for (const v of opts) {
    const d = Math.abs(quantity - v);
    if (d < bestDiff) {
      best = v;
      bestDiff = d;
    }
  }
  return best;
}
