import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: {
      adminWhatsapp: "919325667461",
      shopName: "Fresh Veg Mart",
    },
    create: {
      id: 1,
      adminWhatsapp: "919325667461",
      shopName: "Fresh Veg Mart",
      upiId: "veggieshop@upi",
      upiName: "Fresh Veg Mart",
    },
  });
  console.log("Shop settings updated with WhatsApp 919325667461");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
