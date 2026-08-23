"use client";

import { useState } from "react";
import { addToCart } from "@/lib/cart";

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
  const [toast, setToast] = useState<string | null>(null);

  function handleAdd(veg: VegCard) {
    addToCart({
      vegetableId: veg.id,
      name: veg.name,
      emoji: veg.emoji,
      unit: veg.unit,
      price: veg.price,
    });
    setToast(`${veg.name} added to cart`);
    setTimeout(() => setToast(null), 1800);
  }

  return (
    <>
      <div className="veg-grid">
        {vegetables.map((veg) => (
          <article key={veg.id} className="veg-item">
            <div className="veg-emoji" aria-hidden>
              {veg.emoji}
            </div>
            <div className="veg-meta">
              <h3>{veg.name}</h3>
              <p>{veg.description || `Fresh ${veg.name.toLowerCase()}`}</p>
              <div className="veg-price-row">
                <strong>
                  ₹{veg.price}
                  <span> / {veg.unit}</span>
                </strong>
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => handleAdd(veg)}
                  disabled={veg.stockKg <= 0}
                >
                  {veg.stockKg <= 0 ? "Out of stock" : "Add to cart"}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
