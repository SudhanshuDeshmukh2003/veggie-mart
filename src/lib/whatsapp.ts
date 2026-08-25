type OrderMessageInput = {
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  notes?: string;
  items: Array<{
    name: string;
    quantity: number;
    unit: string;
    price: number;
    lineTotal: number;
  }>;
};

export function buildOrderWhatsAppMessage(order: OrderMessageInput) {
  const lines = [
    `🛒 *New Order — Sabzi Bazaar*`,
    `Order ID: ${order.orderId.slice(-8).toUpperCase()}`,
    ``,
    `👤 ${order.customerName}`,
    `📞 ${order.customerPhone}`,
    `📍 ${order.address}`,
    `💳 Payment: COD (Cash on Delivery)`,
    ``,
    `*Items:*`,
    ...order.items.map((item) => {
      const qtyLabel =
        item.unit === "kg"
          ? Math.abs(item.quantity - 0.5) < 0.001
            ? "½ kg (500 g)"
            : Math.abs(item.quantity - 0.25) < 0.001
              ? "250 g"
              : Math.abs(item.quantity - 0.125) < 0.001
                ? "125 g"
                : item.quantity >= 0.99
                  ? `${item.quantity} kg`
                  : `${Math.round(item.quantity * 1000)} g`
          : `${item.quantity} ${item.unit}`;
      return `• ${item.name} — ${qtyLabel} × ₹${item.price}/${item.unit} = ₹${item.lineTotal.toFixed(0)}`;
    }),
    ``,
    `*Total: ₹${order.totalAmount.toFixed(0)}*`,
  ];

  if (order.notes?.trim()) {
    lines.push(``, `Note: ${order.notes.trim()}`);
  }

  return lines.join("\n");
}

export function buildWhatsAppUrl(phone: string, message: string) {
  const cleaned = phone.replace(/[^\d]/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

export function getAdminWhatsApp() {
  return process.env.ADMIN_WHATSAPP || "";
}

export function getShopUpi() {
  return {
    upiId: process.env.SHOP_UPI_ID || "",
    upiName: process.env.SHOP_UPI_NAME || "Sabzi Bazaar",
  };
}
