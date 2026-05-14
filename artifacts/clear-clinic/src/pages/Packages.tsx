import { motion, type Variants } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useListPackages } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Calendar } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Packages() {
  const { t, lang } = useLanguage();
  const { data: packages, isLoading } = useListPackages({ active: true });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 mb-3">
            {lang === "ar" ? "عروض حصرية" : "Exclusive Offers"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
            {t("specialOffers")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {lang === "ar" ? "باقات مميزة بأسعار حصرية لا تفوت الفرصة" : "Premium packages at exclusive prices — don't miss out"}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(packages || []).map((pkg) => (
              <motion.div key={pkg.id} variants={fadeUp}>
                <div className={`relative rounded-2xl overflow-hidden border-2 ${pkg.featured ? "border-secondary shadow-lg shadow-secondary/20" : "border-border"} bg-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col`}>
                  {pkg.featured && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-secondary via-primary to-secondary" />
                  )}
                  {pkg.discountPercent && (
                    <div className="absolute top-4 start-4 z-10">
                      <Badge className="bg-secondary text-secondary-foreground shadow-md text-sm px-3">
                        <Tag className="w-3 h-3 me-1" />
                        {pkg.discountPercent}% {t("discount")}
                      </Badge>
                    </div>
                  )}
                  {pkg.imageUrl ? (
                    <div className="h-52 overflow-hidden">
                      <img src={pkg.imageUrl} alt={lang === "ar" ? pkg.nameAr : pkg.nameEn} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="h-52 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 flex items-center justify-center">
                      <span className="text-5xl">✨</span>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-bold text-foreground text-xl mb-2">{lang === "ar" ? pkg.nameAr : pkg.nameEn}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                      {lang === "ar" ? pkg.descriptionAr : pkg.descriptionEn}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border flex items-end justify-between">
                      <div>
                        {pkg.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">{pkg.originalPrice} {lang === "ar" ? "ر.س" : "SAR"}</div>
                        )}
                        {pkg.discountedPrice && (
                          <div className="text-2xl font-bold text-primary">{pkg.discountedPrice} <span className="text-sm font-normal">{lang === "ar" ? "ر.س" : "SAR"}</span></div>
                        )}
                        {pkg.validUntil && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                            <Calendar className="w-3 h-3" />
                            {t("validUntil")}: {pkg.validUntil}
                          </div>
                        )}
                      </div>
                      <Link href="/book">
                        <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">{t("bookNow")}</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
