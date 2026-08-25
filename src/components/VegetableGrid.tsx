"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { KG_QTY_OPTIONS, PIECE_QTY_OPTIONS } from "@/lib/qty";

export type VegCard = {
  id: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  stockKg: number;
  emoji: string;
};

export function VegetableGrid({ vegetables }: { vegetables: VegCard[] }) {
  const { t, qtyLabel } = useI18n();
  const [toast, setToast] = useState<string | null>(null);
  const [selected, setSelected] = useState<Record<string, number>>({});

  function getQty(veg: VegCard) {
    return selected[veg.id] ?? (veg.unit === "kg" ? 0.5 : 1);
  }

  function handleAdd(veg: VegCard) {
    const qty = getQty(veg);
    addToCart(
      {
        vegetableId: veg.id,
        name: veg.name,
        emoji: veg.emoji,
        unit: veg.unit,
        price: veg.price,
      },
      qty,
    );
    setToast(`${veg.name} — ${qtyLabel(qty, veg.unit)} ${t("addedToast")}`);
    setTimeout(() => setToast(null), 1800);
  }

  return (
    <>
      <div className="veg-grid">
        {vegetables.map((veg) => {
          const qty = getQty(veg);
          const options =
            veg.unit === "kg"
              ? KG_QTY_OPTIONS.map((o) => ({
                  value: o.value,
                  label: t(o.labelKey),
                }))
              : PIECE_QTY_OPTIONS.map((n) => ({
                  value: n,
                  label: `${n} ${veg.unit}`,
                }));

          return (
            <article key={veg.id} className="veg-item veg-item-stack">
              <div className="veg-item-top">
                <div className="veg-emoji" aria-hidden>
                  {veg.emoji}
                </div>
                <div className="veg-meta">
                  <h3>{veg.name}</h3>
                  <p>{veg.description || `Fresh ${veg.name.toLowerCase()}`}</p>
                  <strong>
                    ₹{veg.price}
                    <span>
                      {" "}
                      {veg.unit === "kg" ? t("perKg") : `${t("perUnit")} ${veg.unit}`}
                    </span>
                  </strong>
                </div>
              </div>

              <div className="qty-pills" role="group" aria-label="Quantity">
                {options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    className={`qty-pill ${qty === opt.value ? "active" : ""}`}
                    onClick={() =>
                      setSelected((s) => ({ ...s, [veg.id]: opt.value }))
                    }
                    disabled={veg.stockKg <= 0}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-sm"
                onClick={() => handleAdd(veg)}
                disabled={veg.stockKg <= 0}
                style={{ width: "100%" }}
              >
                {veg.stockKg <= 0 ? t("outOfStock") : t("addToCart")}
              </button>
            </article>
          );
        })}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
