import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const veggies = [
  { name: "Tomato", emoji: "🍅", unit: "kg", price: 40, stockKg: 50, description: "Fresh red tomatoes" },
  { name: "Onion", emoji: "🧅", unit: "kg", price: 35, stockKg: 80, description: "Local onions" },
  { name: "Potato", emoji: "🥔", unit: "kg", price: 28, stockKg: 100, description: "Farm potatoes" },
  { name: "Carrot", emoji: "🥕", unit: "kg", price: 45, stockKg: 30, description: "Crunchy carrots" },
  { name: "Cabbage", emoji: "🥬", unit: "piece", price: 30, stockKg: 25, description: "Green cabbage" },
  { name: "Capsicum", emoji: "🫑", unit: "kg", price: 60, stockKg: 20, description: "Green capsicum" },
  { name: "Coriander", emoji: "🌿", unit: "bunch", price: 10, stockKg: 40, description: "Fresh coriander" },
  { name: "Spinach", emoji: "🍃", unit: "bunch", price: 15, stockKg: 35, description: "Fresh spinach" },
  { name: "Cauliflower", emoji: "🥦", unit: "piece", price: 40, stockKg: 20, description: "Fresh cauliflower" },
  { name: "Brinjal", emoji: "🍆", unit: "kg", price: 35, stockKg: 25, description: "Fresh brinjal" },
];

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.vegetable.deleteMany();
  await prisma.user.deleteMany();
  await prisma.shopSettings.deleteMany();

  const adminPass = await bcrypt.hash("admin123", 10);
  const userPass = await bcrypt.hash("user123", 10);

  await prisma.user.create({
    data: {
      name: "Shop Admin",
      email: "admin@sabzi.com",
      phone: "9876543210",
      address: "123 Market Road, Shop No. 5",
      password: adminPass,
      role: "ADMIN",
    },
  });

  await prisma.user.create({
    data: {
      name: "Demo Customer",
      email: "user@sabzi.com",
      phone: "9123456780",
      address: "45 Green Lane, Apartment 2B, Near City Park",
      password: userPass,
      role: "USER",
    },
  });

  await prisma.vegetable.createMany({
    data: veggies.map((v) => ({
      ...v,
      emoji: v.emoji.trim() || "🥬",
    })),
  });

  await prisma.shopSettings.create({
    data: {
      id: 1,
      shopName: "Sabzi Bazaar",
      adminWhatsapp: process.env.ADMIN_WHATSAPP || "919325667461",
      upiId: process.env.SHOP_UPI_ID || "veggieshop@upi",
      upiName: process.env.SHOP_UPI_NAME || "Sabzi Bazaar",
    },
  });

  console.log("Seeded:");
  console.log("  Admin  → admin@sabzi.com / admin123");
  console.log("  User   → user@sabzi.com / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
