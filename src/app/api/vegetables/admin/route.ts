import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const vegetables = await prisma.vegetable.findMany({
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ vegetables });
}
