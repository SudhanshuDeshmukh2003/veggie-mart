import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession, requireAdmin, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  buildOrderWhatsAppMessage,
  buildWhatsAppUrl,
  getAdminWhatsApp,
} from "@/lib/whatsapp";

const itemSchema = z.object({
  vegetableId: z.string(),
  quantity: z.number().positive(),
});

const createSchema = z.object({
  address: z.string().min(5),
  phone: z.string().min(10),
  paymentMethod: z.enum(["COD", "UPI"]),
  notes: z.string().optional(),
  items: z.array(itemSchema).min(1),
});

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role === "ADMIN") {
    const orders = await prisma.order.findMany({
      include: { items: true, user: { select: { name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  let session;
  try {
    session = await requireUser();
  } catch {
    return NextResponse.json({ error: "Login required" }, { status: 401 });
  }

  const data = createSchema.parse(await req.json());
  const vegIds = data.items.map((i) => i.vegetableId);
  const veggies = await prisma.vegetable.findMany({
    where: { id: { in: vegIds }, isActive: true },
  });

  if (veggies.length !== vegIds.length) {
    return NextResponse.json(
      { error: "Some vegetables are unavailable" },
      { status: 400 },
    );
  }

  const vegMap = new Map(veggies.map((v) => [v.id, v]));
  const orderItems = data.items.map((item) => {
    const veg = vegMap.get(item.vegetableId)!;
    const lineTotal = veg.price * item.quantity;
    return {
      vegetableId: veg.id,
      vegetableName: veg.name,
      unit: veg.unit,
      price: veg.price,
      quantity: item.quantity,
      lineTotal,
    };
  });

  const totalAmount = orderItems.reduce((s, i) => s + i.lineTotal, 0);

  const order = await prisma.order.create({
    data: {
      userId: session.id,
      address: data.address,
      phone: data.phone,
      paymentMethod: data.paymentMethod,
      paymentStatus: data.paymentMethod === "COD" ? "PENDING" : "PENDING",
      notes: data.notes || "",
      totalAmount,
      items: { create: orderItems },
    },
    include: { items: true },
  });

  const message = buildOrderWhatsAppMessage({
    orderId: order.id,
    customerName: session.name,
    customerPhone: data.phone,
    address: data.address,
    paymentMethod: data.paymentMethod,
    totalAmount,
    notes: data.notes,
    items: order.items.map((i) => ({
      name: i.vegetableName,
      quantity: i.quantity,
      unit: i.unit,
      price: i.price,
      lineTotal: i.lineTotal,
    })),
  });

  const adminPhone = getAdminWhatsApp();
  const whatsappUrl = adminPhone
    ? buildWhatsAppUrl(adminPhone, message)
    : null;

  return NextResponse.json({ order, whatsappUrl, message });
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const id = z.string().parse(body.id);
  const status = z
    .enum(["PENDING", "CONFIRMED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"])
    .optional()
    .parse(body.status);
  const paymentStatus = z.enum(["PENDING", "PAID"]).optional().parse(body.paymentStatus);

  const order = await prisma.order.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    },
    include: { items: true, user: { select: { name: true, email: true } } },
  });

  return NextResponse.json({ order });
}
