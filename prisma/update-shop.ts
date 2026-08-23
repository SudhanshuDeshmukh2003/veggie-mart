import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: {
      adminWhatsapp: "917517571339",
      shopName: "Fresh Veg Mart",
    },
    create: {
      id: 1,
      adminWhatsapp: "917517571339",
      shopName: "Fresh Veg Mart",
      upiId: "veggieshop@upi",
      upiName: "Fresh Veg Mart",
    },
  });
  console.log("Shop settings updated with WhatsApp 917517571339");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
