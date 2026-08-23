import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "ADMIN") redirect("/");

  const [orderCount, pending, vegCount] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.vegetable.count({ where: { isActive: true } }),
  ]);

  return (
    <div className="admin-shell">
      <h1
        style={{
          fontFamily: "var(--font-display), Georgia, serif",
          color: "var(--leaf-deep)",
          margin: 0,
        }}
      >
        Admin dashboard
      </h1>
      <p style={{ color: "rgba(42,36,28,0.7)" }}>
        Welcome, {session.name}. Manage vegetables, prices, and incoming orders.
      </p>

      <div className="admin-tabs">
        <Link href="/admin" className="active">
          Overview
        </Link>
        <Link href="/admin/vegetables">Vegetables & prices</Link>
        <Link href="/admin/orders">Orders</Link>
      </div>

      <div className="veg-grid">
        <div className="veg-item" style={{ display: "block" }}>
          <h3>Total orders</h3>
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: 700 }}>{orderCount}</p>
        </div>
        <div className="veg-item" style={{ display: "block" }}>
          <h3>Pending</h3>
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: 700 }}>{pending}</p>
        </div>
        <div className="veg-item" style={{ display: "block" }}>
          <h3>Active vegetables</h3>
          <p style={{ fontSize: "2rem", margin: 0, fontWeight: 700 }}>{vegCount}</p>
        </div>
      </div>
    </div>
  );
}
