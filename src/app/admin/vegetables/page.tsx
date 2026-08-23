"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

type Veg = {
  id: string;
  name: string;
  description: string;
  unit: string;
  price: number;
  stockKg: number;
  emoji: string;
  isActive: boolean;
};

export default function AdminVegetablesPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const [vegetables, setVegetables] = useState<Veg[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [adding, setAdding] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/vegetables/admin");
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Admin access required");
      return;
    }
    setVegetables(data.vegetables);
  }

  useEffect(() => {
    load();
  }, []);

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setAdding(true);

    const form = formRef.current ?? e.currentTarget;
    const formData = new FormData(form);

    const name = String(formData.get("name") ?? "").trim();
    const price = Number(formData.get("price"));
    const stockKg = Number(formData.get("stockKg"));

    if (!name) {
      setError("Name is required");
      setAdding(false);
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid price greater than 0");
      setAdding(false);
      return;
    }
    if (!Number.isFinite(stockKg) || stockKg < 0) {
      setError("Enter a valid stock amount");
      setAdding(false);
      return;
    }

    try {
      const res = await fetch("/api/vegetables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description: String(formData.get("description") ?? "").trim(),
          unit: formData.get("unit") || "kg",
          price,
          stockKg,
          emoji: String(formData.get("emoji") ?? "").trim() || "🥬",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not add vegetable");
        return;
      }

      form.reset();
      setSuccess(`${name} added successfully`);
      await load();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  async function savePrice(veg: Veg, price: number, stockKg: number) {
    if (!Number.isFinite(price) || price <= 0) {
      setError("Enter a valid price greater than 0");
      return;
    }
    if (!Number.isFinite(stockKg) || stockKg < 0) {
      setError("Enter a valid stock amount");
      return;
    }

    setError("");
    setSuccess("");
    setSavingId(veg.id);

    try {
      const res = await fetch("/api/vegetables", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: veg.id, price, stockKg }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Update failed");
        return;
      }
      setSuccess(`${veg.name} updated`);
      await load();
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setSavingId(null);
    }
  }

  async function remove(id: string) {
    if (!confirm("Hide this vegetable from the shop?")) return;
    setError("");
    const res = await fetch(`/api/vegetables?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Could not hide vegetable");
      return;
    }
    setSuccess("Vegetable hidden from shop");
    await load();
    setTimeout(() => setSuccess(""), 3000);
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
        Vegetables & daily prices
      </h1>
      <div className="admin-tabs">
        <Link href="/admin">Overview</Link>
        <Link href="/admin/vegetables" className="active">
          Vegetables & prices
        </Link>
        <Link href="/admin/orders">Orders</Link>
      </div>

      {error && <p className="error">{error}</p>}
      {success && (
        <p style={{ color: "var(--leaf)", fontWeight: 600 }}>{success}</p>
      )}

      <form
        ref={formRef}
        className="card-form"
        onSubmit={onAdd}
        style={{ marginBottom: "1.5rem" }}
      >
        <h2 style={{ marginTop: 0, fontFamily: "var(--font-display), Georgia, serif" }}>
          Add a new vegetable
        </h2>
        <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
          <label>
            Name
            <input name="name" required />
          </label>
          <label>
            Emoji
            <input name="emoji" placeholder="🥬" />
          </label>
          <label>
            Unit
            <select name="unit" defaultValue="kg">
              <option value="kg">kg</option>
              <option value="piece">piece</option>
              <option value="bunch">bunch</option>
            </select>
          </label>
          <label>
            Price (₹)
            <input name="price" type="number" step="0.5" min="1" required />
          </label>
          <label>
            Stock
            <input name="stockKg" type="number" step="0.5" min="0" defaultValue={10} required />
          </label>
          <label style={{ gridColumn: "1 / -1" }}>
            Description
            <input name="description" placeholder="Optional short description" />
          </label>
        </div>
        <button className="btn" type="submit" style={{ marginTop: "0.9rem" }} disabled={adding}>
          {adding ? "Adding…" : "Add vegetable"}
        </button>
      </form>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Price ₹</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vegetables.length === 0 && (
              <tr>
                <td colSpan={4}>No vegetables yet. Add one above.</td>
              </tr>
            )}
            {vegetables.map((veg) => (
              <tr key={veg.id} style={{ opacity: veg.isActive ? 1 : 0.45 }}>
                <td>
                  {veg.emoji} <strong>{veg.name}</strong>
                  <div style={{ fontSize: "0.82rem" }}>
                    / {veg.unit} · {veg.description || "—"}
                  </div>
                </td>
                <td>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    defaultValue={veg.price}
                    id={`price-${veg.id}`}
                    style={{ maxWidth: 100 }}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    defaultValue={veg.stockKg}
                    id={`stock-${veg.id}`}
                    style={{ maxWidth: 100 }}
                  />
                </td>
                <td>
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    <button
                      type="button"
                      className="btn btn-sm"
                      disabled={savingId === veg.id}
                      onClick={() => {
                        const price = Number(
                          (document.getElementById(`price-${veg.id}`) as HTMLInputElement)
                            .value,
                        );
                        const stockKg = Number(
                          (document.getElementById(`stock-${veg.id}`) as HTMLInputElement)
                            .value,
                        );
                        savePrice(veg, price, stockKg);
                      }}
                    >
                      {savingId === veg.id ? "Saving…" : "Save"}
                    </button>
                    {veg.isActive && (
                      <button
                        type="button"
                        className="btn btn-sm btn-ghost"
                        onClick={() => remove(veg.id)}
                      >
                        Hide
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
