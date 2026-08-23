import { NextResponse } from "next/server";
import { z } from "zod";
import {
  createSession,
  findUserByEmail,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";
import { prisma } from "@/lib/db";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().min(10, "Phone must be at least 10 digits").max(15),
  address: z.string().min(5, "Address must be at least 5 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

function formatZodError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid input";
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body.action as string;

    if (action === "register") {
      const data = registerSchema.parse(body);
      const exists = await findUserByEmail(data.email);
      if (exists) {
        return NextResponse.json(
          { error: "This email is already registered" },
          { status: 400 },
        );
      }

      const user = await prisma.user.create({
        data: {
          name: data.name.trim(),
          email: data.email.toLowerCase().trim(),
          phone: data.phone.trim(),
          address: data.address.trim(),
          password: await hashPassword(data.password),
          role: "USER",
        },
      });

      await createSession({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: "USER",
      });

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role: user.role,
        },
      });
    }

    if (action === "login") {
      const data = loginSchema.parse(body);
      const user = await findUserByEmail(data.email);
      if (!user || !(await verifyPassword(data.password, user.password))) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 },
        );
      }

      const role = user.role === "ADMIN" ? "ADMIN" : "USER";
      await createSession({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role,
      });

      return NextResponse.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
          role,
        },
      });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: formatZodError(error) }, { status: 400 });
    }
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
