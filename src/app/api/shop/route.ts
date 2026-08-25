import { NextResponse } from "next/server";
import { getAdminWhatsApp, getShopUpi } from "@/lib/whatsapp";

export async function GET() {
  const upi = getShopUpi();
  return NextResponse.json({
    shopName: "Sabzi Bazaar",
    upiId: upi.upiId,
    upiName: upi.upiName,
    whatsappConfigured: Boolean(getAdminWhatsApp()),
  });
}
