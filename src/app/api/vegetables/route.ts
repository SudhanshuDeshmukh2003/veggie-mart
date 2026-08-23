import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const veggies = await prisma.vegetable.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json({ vegetables: veggies });
}

const vegSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  description: z.string().optional(),
  unit: z.enum(["kg", "piece", "bunch"]),
  price: z.number().positive("Price must be greater than 0"),
  stockKg: z.number().min(0, "Stock cannot be negative"),
  emoji: z.string().optional(),
  isActive: z.boolean().optional(),
});

function formatZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid input";
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const data = vegSchema.parse(await req.json());
    const veg = await prisma.vegetable.create({
      data: {
        name: data.name,
        description: data.description?.trim() || "",
        unit: data.unit,
        price: data.price,
        stockKg: data.stockKg,
        emoji: data.emoji?.trim() || "🥬",
        isActive: data.isActive ?? true,
      },
    });

    return NextResponse.json({ vegetable: veg });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: formatZodError(error) }, { status: 400 });
    }
    console.error("Add vegetable error:", error);
    return NextResponse.json(
      { error: "Could not add vegetable. Please try again." },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const id = z.string().parse(body.id);
    const patch = vegSchema.partial().parse(body);

    const veg = await prisma.vegetable.update({
      where: { id },
      data: patch,
    });

    return NextResponse.json({ vegetable: veg });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: formatZodError(error) }, { status: 400 });
    }
    console.error("Update vegetable error:", error);
    return NextResponse.json(
      { error: "Could not update vegetable. Please try again." },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.vegetable.update({
    where: { id },
    data: { isActive: false },
  });

  return NextResponse.json({ ok: true });
}
