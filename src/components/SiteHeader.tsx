"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

export function SiteHeader() {
  const [user, setUser] = useState<User>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));

    const sync = () => {
      const cart = readCart();
      setCartCount(cart.reduce((n, i) => n + i.quantity, 0));
    };
    sync();
    window.addEventListener("cart-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("cart-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  async function logout() {
    await fetch("/api/auth/me", { method: "DELETE" });
    setUser(null);
    window.location.href = "/";
  }

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand">
          <span className="brand-mark" aria-hidden>
            🥬
          </span>
          <span className="brand-text">
            Fresh <em>Veg Mart</em>
          </span>
        </Link>

        <nav className="nav-links">
          <Link href="/#menu">Vegetables</Link>
          <Link href="/cart">Cart{cartCount > 0 ? ` (${cartCount})` : ""}</Link>
          {user ? (
            <>
              <Link href="/orders">My Orders</Link>
              {user.role === "ADMIN" && <Link href="/admin">Admin</Link>}
              <button type="button" className="link-btn" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login">Sign in</Link>
              <Link href="/register" className="btn btn-sm">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
