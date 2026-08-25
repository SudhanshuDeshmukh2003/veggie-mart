import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: {
      adminWhatsapp: "919325667461",
      shopName: "Sabzi Bazaar",
      upiName: "Sabzi Bazaar",
    },
    create: {
      id: 1,
      adminWhatsapp: "919325667461",
      shopName: "Sabzi Bazaar",
      upiId: "veggieshop@upi",
      upiName: "Sabzi Bazaar",
    },
  });
  console.log("Shop settings updated — Sabzi Bazaar / WhatsApp 919325667461");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
