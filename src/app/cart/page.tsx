"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  CartItem,
  cartTotal,
  clearCart,
  readCart,
  updateCartQty,
} from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { KG_QTY_OPTIONS, PIECE_QTY_OPTIONS, nearestQtyOption } from "@/lib/qty";

export default function CartPage() {
  const { t, qtyLabel } = useI18n();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const sync = () => setItems(readCart());
    sync();
    window.addEventListener("cart-updated", sync);
    return () => window.removeEventListener("cart-updated", sync);
  }, []);

  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="panel">
        <div className="card-form">
          <h1>{t("cartEmpty")}</h1>
          <p>{t("cartEmptySub")}</p>
          <Link href="/#menu" className="btn">
            {t("browseVeg")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="panel" style={{ maxWidth: 800 }}>
      <div className="card-form">
        <h1>{t("yourCart")}</h1>
        <p>{t("cartSub")}</p>
        <div className="cart-list">
          {items.map((item) => {
            const current = nearestQtyOption(item.quantity, item.unit);
            const options =
              item.unit === "kg"
                ? KG_QTY_OPTIONS.map((o) => ({
                    value: o.value,
                    label: t(o.labelKey),
                  }))
                : PIECE_QTY_OPTIONS.map((n) => ({
                    value: n,
                    label: `${n} ${item.unit}`,
                  }));

            return (
              <div key={item.vegetableId} className="cart-row">
                <div className="veg-emoji">{item.emoji}</div>
                <div>
                  <strong>{item.name}</strong>
                  <div>
                    ₹{item.price} / {item.unit} · {qtyLabel(current, item.unit)}
                  </div>
                  <div style={{ marginTop: "0.35rem", fontSize: "0.9rem" }}>
                    Line: ₹{(item.price * current).toFixed(0)}
                  </div>
                </div>
                <div className="qty-controls">
                  <select
                    value={current}
                    onChange={(e) =>
                      updateCartQty(item.vegetableId, Number(e.target.value))
                    }
                    aria-label="Quantity"
                    style={{ minWidth: 110 }}
                  >
                    {options.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-sm btn-ghost"
                    onClick={() => updateCartQty(item.vegetableId, 0)}
                  >
                    ×
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "1.25rem",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <strong style={{ fontSize: "1.2rem" }}>
            {t("total")}: ₹{total.toFixed(0)}
          </strong>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => clearCart()}
            >
              {t("clearCart")}
            </button>
            <Link href="/checkout" className="btn">
              {t("checkout")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
