"use client";

import Link from "next/link";
import { VegetableGrid, type VegCard } from "@/components/VegetableGrid";
import { useI18n } from "@/lib/i18n";

export function HomeClient({ vegetables }: { vegetables: VegCard[] }) {
  const { t } = useI18n();

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <h1>
            {t("heroTitle")}
            <span>{t("heroTag")}</span>
          </h1>
          <p>{t("heroBody")}</p>
          <div className="hero-actions">
            <a href="#menu" className="btn">
              {t("browseMenu")}
            </a>
            <Link href="/register" className="btn btn-ghost">
              {t("createAccount")}
            </Link>
          </div>
        </div>
        <div className="hero-visual" aria-hidden>
          <div className="hero-visual-inner">
            <div className="big">🥕🍅🥬</div>
            <p>{t("heroSide")}</p>
          </div>
        </div>
      </section>

      <section id="menu" className="section">
        <div className="section-head">
          <h2>{t("todayMenu")}</h2>
          <p>{t("todayMenuSub")}</p>
        </div>
        <VegetableGrid vegetables={vegetables} />
      </section>
    </>
  );
}
