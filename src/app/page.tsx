import Link from "next/link";
import { VegetableGrid } from "@/components/VegetableGrid";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const vegetables = await prisma.vegetable.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            Fresh Veg Mart
            <span>farm fresh, delivered daily</span>
          </h1>
          <p>
            Order vegetables at today&apos;s market prices. Pay with cash on
            delivery or UPI. Every order is sent to the shop on WhatsApp and
            appears in the admin dashboard.
          </p>
          <div className="hero-actions">
            <a href="#menu" className="btn">
              Browse today&apos;s menu
            </a>
            <Link href="/register" className="btn btn-ghost">
              Create account
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="hero-visual-inner">
            <div className="big">🥕🍅🥬</div>
            <p>Daily price updates · Local delivery</p>
          </div>
        </div>
      </section>

      <section id="menu" className="section">
        <div className="section-head">
          <h2>Today&apos;s menu</h2>
          <p>Prices are updated daily by the shop admin.</p>
        </div>
        <VegetableGrid vegetables={vegetables} />
      </section>
    </>
  );
}
