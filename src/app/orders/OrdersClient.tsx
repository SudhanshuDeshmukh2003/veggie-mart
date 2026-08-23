"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Order = {
  id: string;
  status: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  address: string;
  createdAt: string;
  items: Array<{
    vegetableName: string;
    quantity: number;
    unit: string;
    lineTotal: number;
  }>;
};

export default function OrdersClient() {
  const params = useSearchParams();
  const placed = params.get("placed");
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/orders")
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || "Failed to load orders");
        setOrders(data.orders);
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <div className="panel" style={{ maxWidth: 800 }}>
      <div className="card-form">
        <h1>My orders</h1>
        {placed && (
          <p style={{ color: "var(--leaf)" }}>
            Order placed successfully! A WhatsApp alert was opened for the shop,
            and the order also appears in the admin dashboard.
          </p>
        )}
        {error && (
          <p className="error">
            {error === "Unauthorized" || error.includes("Login") ? (
              <>
                Please <Link href="/login">sign in</Link> to view your orders.
              </>
            ) : (
              error
            )}
          </p>
        )}
        {orders.length === 0 && !error && <p>No orders yet.</p>}
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.5rem",
                flexWrap: "wrap",
              }}
            >
              <strong>#{order.id.slice(-8).toUpperCase()}</strong>
              <span className="badge">{order.status.replaceAll("_", " ")}</span>
            </div>
            <div style={{ fontSize: "0.9rem", marginTop: "0.35rem" }}>
              {new Date(order.createdAt).toLocaleString()} · {order.paymentMethod}{" "}
              ({order.paymentStatus}) · ₹{order.totalAmount.toFixed(0)}
            </div>
            <ul style={{ margin: "0.6rem 0 0", paddingLeft: "1.1rem" }}>
              {order.items.map((item, idx) => (
                <li key={idx}>
                  {item.vegetableName} — {item.quantity} {item.unit} (₹
                  {item.lineTotal.toFixed(0)})
                </li>
              ))}
            </ul>
            <div style={{ marginTop: "0.5rem", fontSize: "0.9rem" }}>
              📍 {order.address}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
