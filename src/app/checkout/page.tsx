"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem, cartTotal, clearCart, readCart } from "@/lib/cart";

type Me = { name: string; phone: string; address: string } | null;

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [me, setMe] = useState<Me>(null);
  const [payment, setPayment] = useState<"COD" | "UPI">("COD");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [upiName, setUpiName] = useState("");

  useEffect(() => {
    setItems(readCart());
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.user) {
          router.push("/login");
          return;
        }
        setMe(d.user);
      });
    fetch("/api/shop")
      .then((r) => r.json())
      .then((d) => {
        if (d.upiId) setUpiId(d.upiId);
        if (d.upiName) setUpiName(d.upiName);
      })
      .catch(() => undefined);
  }, [router]);

  const total = cartTotal(items);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (items.length === 0) return;
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: form.get("address"),
        phone: form.get("phone"),
        notes: form.get("notes"),
        paymentMethod: payment,
        items: items.map((i) => ({
          vegetableId: i.vegetableId,
          quantity: i.quantity,
        })),
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Order failed");
      return;
    }

    clearCart();

    if (data.whatsappUrl) {
      window.open(data.whatsappUrl, "_blank");
    }

    router.push(`/orders?placed=${data.order.id}`);
  }

  if (items.length === 0) {
    return (
      <div className="panel">
        <div className="card-form">
          <h1>Nothing to checkout</h1>
          <Link href="/#menu" className="btn">
            Add vegetables
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="panel" style={{ maxWidth: 720 }}>
      <form className="card-form" onSubmit={onSubmit}>
        <h1>Checkout</h1>
        <p>
          Total <strong>₹{total.toFixed(0)}</strong> — the shop will also receive
          this order on WhatsApp.
        </p>

        <div className="form-grid">
          <label>
            Delivery address
            <textarea
              name="address"
              required
              minLength={5}
              placeholder="House no., street, area, landmark"
              defaultValue={me?.address || ""}
            />
          </label>
          <label>
            Phone
            <input
              name="phone"
              required
              minLength={10}
              defaultValue={me?.phone || ""}
            />
          </label>
          <label>
            Notes (optional)
            <input name="notes" placeholder="e.g. Deliver before 8 AM" />
          </label>

          <div>
            <strong style={{ display: "block", marginBottom: "0.5rem" }}>
              Payment method
            </strong>
            <div className="pay-options">
              <label
                className={`pay-option ${payment === "COD" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={payment === "COD"}
                  onChange={() => setPayment("COD")}
                />
                <span>
                  <strong>Cash on Delivery (COD)</strong>
                  <br />
                  Pay in cash when your order arrives — simplest for local shops.
                </span>
              </label>
              <label
                className={`pay-option ${payment === "UPI" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="pay"
                  checked={payment === "UPI"}
                  onChange={() => setPayment("UPI")}
                />
                <span>
                  <strong>UPI (GPay / PhonePe / Paytm)</strong>
                  <br />
                  Pay to the shop UPI ID — admin will confirm after payment.
                </span>
              </label>
            </div>
            {payment === "UPI" && (
              <div className="upi-box">
                <div>
                  Pay to: <strong>{upiName}</strong>
                </div>
                <div>
                  UPI ID: <strong>{upiId}</strong>
                </div>
                <div style={{ marginTop: "0.35rem", fontSize: "0.9rem" }}>
                  Amount: ₹{total.toFixed(0)} — mention UPI in the order notes.
                </div>
              </div>
            )}
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Placing order…" : "Place order & notify WhatsApp"}
          </button>
        </div>
      </form>
    </div>
  );
}
