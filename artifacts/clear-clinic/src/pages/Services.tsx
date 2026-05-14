import { useState } from "react";
import { Link } from "wouter";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useListServices } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

type Category = "all" | "cosmetic" | "dental" | "both";

export default function Services() {
  const { t, lang } = useLanguage();
  const [category, setCategory] = useState<Category>("all");
  const { data: services, isLoading } = useListServices({ active: true });

  const filtered = services
    ? category === "all" ? services : services.filter(s => s.category === category)
    : [];

  const categories: { key: Category; labelAr: string; labelEn: string }[] = [
    { key: "all", labelAr: "الكل", labelEn: "All" },
    { key: "cosmetic", labelAr: "تجميل", labelEn: "Cosmetic" },
    { key: "dental", labelAr: "أسنان", labelEn: "Dental" },
    { key: "both", labelAr: "كلاهما", labelEn: "Both" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
            {lang === "ar" ? "خدماتنا" : "Our Services"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
            {t("ourServices")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {lang === "ar" ? "نقدم مجموعة شاملة من الخدمات التجميلية والسنية بأعلى المعايير العالمية" : "We offer a comprehensive range of cosmetic and dental services with the highest international standards"}
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map(c => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                category === c.key
                  ? "bg-primary text-primary-foreground border-primary shadow"
                  : "bg-card text-foreground/70 border-border hover:border-primary hover:text-primary"
              }`}
            >
              {lang === "ar" ? c.labelAr : c.labelEn}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72 rounded-2xl" />)}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((service) => (
              <motion.div key={service.id} variants={fadeUp}>
                <div className="group h-full rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  {service.imageUrl ? (
                    <div className="h-48 overflow-hidden">
                      <img src={service.imageUrl} alt={lang === "ar" ? service.nameAr : service.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                      <span className="text-4xl">✨</span>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <Badge variant="outline" className="self-start mb-3 capitalize text-xs">
                      {service.category === "cosmetic" ? t("cosmetic") : service.category === "dental" ? t("dental") : t("both")}
                    </Badge>
                    <h3 className="font-bold text-foreground text-lg mb-2">{lang === "ar" ? service.nameAr : service.nameEn}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{lang === "ar" ? service.descriptionAr : service.descriptionEn}</p>
                    <div className="mt-4 flex items-center justify-between">
                      {service.priceFrom ? (
                        <span className="text-sm text-muted-foreground">
                          {t("priceFrom")} <span className="font-bold text-primary text-base">{service.priceFrom} {lang === "ar" ? "ر.س" : "SAR"}</span>
                        </span>
                      ) : <span />}
                      <Link href="/book">
                        <Button size="sm" className="bg-primary text-primary-foreground">{t("bookNow")}</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-20 text-muted-foreground">
            {lang === "ar" ? "لا توجد خدمات في هذه الفئة" : "No services in this category"}
          </div>
        )}
      </div>
    </div>
  );
}
