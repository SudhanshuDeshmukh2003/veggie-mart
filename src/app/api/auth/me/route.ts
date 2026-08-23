import { NextResponse } from "next/server";
import { destroySession, getSession } from "@/lib/auth";

export async function GET() {
  const user = await getSession();
  return NextResponse.json({ user });
}

export async function DELETE() {
  await destroySession();
  return NextResponse.json({ ok: true });
}
