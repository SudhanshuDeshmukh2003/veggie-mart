"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/theme";

export default function RegisterPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirmPassword") || "");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    const firstName = String(form.get("firstName") || "").trim();
    const middleName = String(form.get("middleName") || "").trim();
    const lastName = String(form.get("lastName") || "").trim();
    const name = [firstName, middleName, lastName].filter(Boolean).join(" ");

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          firstName,
          middleName,
          lastName,
          name,
          email: form.get("email"),
          phone: form.get("phone"),
          address: form.get("address"),
          password,
          confirmPassword: confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Could not connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="panel">
      <form className="card-form" onSubmit={onSubmit}>
        <h1>Create account</h1>
        <p>Sign up to browse vegetables and place COD orders.</p>

        <div className="theme-choice" role="group" aria-label="Theme">
          <span className="theme-choice-label">Theme</span>
          <div className="theme-choice-btns">
            <button
              type="button"
              className={`theme-chip ${theme === "light" ? "active" : ""}`}
              onClick={() => setTheme("light")}
            >
              Light
            </button>
            <button
              type="button"
              className={`theme-chip ${theme === "dark" ? "active" : ""}`}
              onClick={() => setTheme("dark")}
            >
              Dark
            </button>
          </div>
        </div>

        <div className="form-grid">
          <div className="name-row">
            <label>
              First name
              <input name="firstName" required minLength={1} placeholder="First" />
            </label>
            <label>
              Middle name
              <input name="middleName" placeholder="Middle (optional)" />
            </label>
            <label>
              Last name
              <input name="lastName" required minLength={1} placeholder="Last" />
            </label>
          </div>
          <label>
            Email
            <input name="email" type="email" required placeholder="you@email.com" />
          </label>
          <label>
            Phone
            <input
              name="phone"
              required
              minLength={10}
              placeholder="10-digit mobile number"
            />
          </label>
          <label>
            Delivery address
            <textarea
              name="address"
              required
              minLength={5}
              placeholder="House no., street, area, landmark"
            />
          </label>
          <label>
            Password
            <input name="password" type="password" required minLength={6} />
          </label>
          <label>
            Re-enter password
            <input name="confirmPassword" type="password" required minLength={6} />
          </label>
          {error && <p className="error">{error}</p>}
          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </button>
        </div>
        <p style={{ marginTop: "1rem" }}>
          Already have an account? <Link href="/login">Sign in</Link>
        </p>
      </form>
    </div>
  );
}
