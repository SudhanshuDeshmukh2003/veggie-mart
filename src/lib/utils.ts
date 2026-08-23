export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function buildWhatsAppOrderUrl(params: {
  adminPhone: string;
  shopName: string;
  orderId: string;
  customerName: string;
  customerPhone: string;
  address: string;
  paymentMethod: string;
  totalAmount: number;
  items: { name: string; qty: number; unit: string; lineTotal: number }[];
}) {
  const lines = [
    `🛒 *New order — ${params.shopName}*`,
    `Order: #${params.orderId.slice(-8).toUpperCase()}`,
    ``,
    `👤 ${params.customerName}`,
    `📞 ${params.customerPhone}`,
    `📍 ${params.address}`,
    `💳 ${params.paymentMethod}`,
    ``,
    `*Items*`,
    ...params.items.map(
      (i) => `• ${i.name} — ${i.qty} ${i.unit} = ₹${Math.round(i.lineTotal)}`
    ),
    ``,
    `*Total: ₹${Math.round(params.totalAmount)}*`,
  ];

  const text = encodeURIComponent(lines.join("\n"));
  const phone = params.adminPhone.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${text}`;
}
