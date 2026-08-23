import { Suspense } from "react";
import OrdersClient from "./OrdersClient";

export default function OrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="panel">
          <div className="card-form">Loading…</div>
        </div>
      }
    >
      <OrdersClient />
    </Suspense>
  );
}
