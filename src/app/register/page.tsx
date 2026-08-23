"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          name: form.get("name"),
          email: form.get("email"),
          phone: form.get("phone"),
          address: form.get("address"),
          password: form.get("password"),
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
        <p>Sign up to browse vegetables and place orders.</p>
        <div className="form-grid">
          <label>
            Full name
            <input name="name" required minLength={2} placeholder="Your name" />
          </label>
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
