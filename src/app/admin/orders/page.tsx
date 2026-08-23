"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  address: string;
  phone: string;
  notes: string;
  createdAt: string;
  user: { name: string; email: string };
  items: Array<{
    vegetableName: string;
    quantity: number;
    unit: string;
    lineTotal: number;
  }>;
};

const STATUSES = [
  "PENDING",
  "CONFIRMED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
] as const;

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/orders");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Admin access required");
      return;
    }
    setOrders(data.orders);
  }

  useEffect(() => {
    load();
  }, []);

  async function patch(id: string, body: Record<string, string>) {
    const res = await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...body }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Update failed");
      return;
    }
    await load();
  }

  return (
    <div className="admin-shell">
      <h1
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          color: "var(--leaf-deep)",
          margin: 0,
        }}
      >
        Incoming orders
      </h1>
      <p style={{ color: "rgba(42,36,28,0.7)" }}>
        Customer orders appear here. The same details are sent to WhatsApp.
      </p>
      <div className="admin-tabs">
        <Link href="/admin">Overview</Link>
        <Link href="/admin/vegetables">Vegetables & prices</Link>
        <Link href="/admin/orders" className="active">
          Orders
        </Link>
      </div>

      {error && <p className="error">{error}</p>}
      {orders.length === 0 && !error && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "0.75rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong>#{order.id.slice(-8).toUpperCase()}</strong> ·{" "}
              {order.user.name} ({order.user.email})
              <div style={{ fontSize: "0.9rem", marginTop: "0.25rem" }}>
                📞 {order.phone} · 📍 {order.address}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>
                <strong>₹{order.totalAmount.toFixed(0)}</strong>
              </div>
              <div style={{ fontSize: "0.85rem" }}>
                {order.paymentMethod} / {order.paymentStatus}
              </div>
            </div>
          </div>

          <ul style={{ margin: "0.7rem 0", paddingLeft: "1.1rem" }}>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.vegetableName} — {item.quantity} {item.unit} (₹
                {item.lineTotal.toFixed(0)})
              </li>
            ))}
          </ul>
          {order.notes && (
            <div style={{ fontSize: "0.9rem", marginBottom: "0.6rem" }}>
              Note: {order.notes}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <select
              value={order.status}
              onChange={(e) => patch(order.id, { status: e.target.value })}
              style={{ maxWidth: 200 }}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
            {order.paymentStatus !== "PAID" && (
              <button
                type="button"
                className="btn btn-sm"
                onClick={() => patch(order.id, { paymentStatus: "PAID" })}
              >
                Mark as paid
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
