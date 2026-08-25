import { HomeClient } from "@/components/HomeClient";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const vegetables = await prisma.vegetable.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return <HomeClient vegetables={vegetables} />;
}
