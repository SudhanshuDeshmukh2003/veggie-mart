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
    `🛒 *New Order — Fresh Veg Mart*`,
    `Order ID: ${order.orderId.slice(-8).toUpperCase()}`,
    ``,
    `👤 ${order.customerName}`,
    `📞 ${order.customerPhone}`,
    `📍 ${order.address}`,
    `💳 Payment: ${order.paymentMethod}`,
    ``,
    `*Items:*`,
    ...order.items.map(
      (item) =>
        `• ${item.name} — ${item.quantity} ${item.unit} × ₹${item.price} = ₹${item.lineTotal.toFixed(0)}`,
    ),
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
    upiName: process.env.SHOP_UPI_NAME || "Fresh Veg Mart",
  };
}
