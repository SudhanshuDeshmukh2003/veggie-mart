"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/cart";
import { useI18n, type Lang } from "@/lib/i18n";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
} | null;

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const [user, setUser] = useState<User>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));

    const sync = () => {
      const cart = readCart();
      setCartCount(cart.length);
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
            Sabzi <em>Bazaar</em>
          </span>
        </Link>

        <nav className="nav-links">
          <label className="lang-select" title={t("language")}>
            <span className="sr-only">{t("language")}</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
              aria-label={t("language")}
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="mr">मराठी</option>
            </select>
          </label>
          <Link href="/#menu">{t("vegetables")}</Link>
          <Link href="/cart">
            {t("cart")}
            {cartCount > 0 ? ` (${cartCount})` : ""}
          </Link>
          {user ? (
            <>
              <Link href="/orders">{t("myOrders")}</Link>
              {user.role === "ADMIN" && <Link href="/admin">{t("admin")}</Link>}
              <button type="button" className="link-btn" onClick={logout}>
                {t("logout")}
              </button>
            </>
          ) : (
            <>
              <Link href="/login">{t("signIn")}</Link>
              <Link href="/register" className="btn btn-sm">
                {t("signUp")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
