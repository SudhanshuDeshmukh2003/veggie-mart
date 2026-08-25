"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CartItem, cartTotal, clearCart, readCart } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { formatQuantity } from "@/lib/qty";

type Me = { name: string; phone: string; address: string } | null;

export default function CheckoutPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [me, setMe] = useState<Me>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        paymentMethod: "COD",
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
          <h1>{t("nothingCheckout")}</h1>
          <Link href="/#menu" className="btn">
            {t("addVeg")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="panel" style={{ maxWidth: 720 }}>
      <form className="card-form" onSubmit={onSubmit}>
        <h1>{t("checkoutTitle")}</h1>
        <p>
          {t("total")} <strong>₹{total.toFixed(0)}</strong> — {t("checkoutSub")}
        </p>

        <ul style={{ margin: "0 0 1rem", paddingLeft: "1.1rem", fontSize: "0.95rem" }}>
          {items.map((i) => (
            <li key={i.vegetableId}>
              {i.name} — {formatQuantity(i.quantity, i.unit)} (₹
              {(i.price * i.quantity).toFixed(0)})
            </li>
          ))}
        </ul>

        <div className="form-grid">
          <label>
            {t("deliveryAddress")}
            <textarea
              name="address"
              required
              minLength={5}
              placeholder={t("addressPh")}
              defaultValue={me?.address || ""}
            />
          </label>
          <label>
            {t("phone")}
            <input
              name="phone"
              required
              minLength={10}
              defaultValue={me?.phone || ""}
            />
          </label>
          <label>
            {t("notes")}
            <input name="notes" placeholder={t("notesPh")} />
          </label>

          <div>
            <strong style={{ display: "block", marginBottom: "0.5rem" }}>
              {t("payment")}
            </strong>
            <div className="pay-options">
              <label className="pay-option selected">
                <input type="radio" name="pay" checked readOnly />
                <span>
                  <strong>{t("codTitle")}</strong>
                  <br />
                  {t("codBody")}
                </span>
              </label>
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? t("placing") : t("placeOrder")}
          </button>
        </div>
      </form>
    </div>
  );
}
