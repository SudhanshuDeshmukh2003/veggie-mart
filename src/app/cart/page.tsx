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

export default function CartPage() {
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
          <h1>Your cart is empty</h1>
          <p>Add some vegetables to get started.</p>
          <Link href="/#menu" className="btn">
            Browse vegetables
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="panel" style={{ maxWidth: 800 }}>
      <div className="card-form">
        <h1>Your cart</h1>
        <p>Adjust quantities, then proceed to checkout.</p>
        <div className="cart-list">
          {items.map((item) => (
            <div key={item.vegetableId} className="cart-row">
              <div className="veg-emoji">{item.emoji}</div>
              <div>
                <strong>{item.name}</strong>
                <div>
                  ₹{item.price} / {item.unit}
                </div>
              </div>
              <div className="qty-controls">
                <button
                  type="button"
                  onClick={() =>
                    updateCartQty(item.vegetableId, item.quantity - 0.5)
                  }
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  type="button"
                  onClick={() =>
                    updateCartQty(item.vegetableId, item.quantity + 0.5)
                  }
                >
                  +
                </button>
              </div>
            </div>
          ))}
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
          <strong style={{ fontSize: "1.2rem" }}>Total: ₹{total.toFixed(0)}</strong>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="button" className="btn btn-ghost" onClick={() => clearCart()}>
              Clear cart
            </button>
            <Link href="/checkout" className="btn">
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
