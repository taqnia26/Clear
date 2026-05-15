import { motion, type Variants } from "framer-motion";
import { Stethoscope } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { useListDoctors } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Doctors() {
  const { t, lang } = useLanguage();
  const { data: doctors, isLoading } = useListDoctors({ active: true });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
            {lang === "ar" ? "فريقنا الطبي" : "Medical Team"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
            {t("ourDoctors")}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {lang === "ar" ? "نخبة من أفضل الأطباء المتخصصين في مجالات التجميل وطب الأسنان" : "An elite group of the best specialist doctors in cosmetics and dentistry"}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-2xl" />)}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(doctors || []).map((doctor) => (
              <motion.div key={doctor.id} variants={fadeUp}>
                <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-64 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                    {doctor.imageUrl ? (
                      <img src={doctor.imageUrl} alt={lang === "ar" ? doctor.nameAr : doctor.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center">
                        <Stethoscope className="w-12 h-12 text-primary/60" />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-foreground text-xl">{lang === "ar" ? doctor.nameAr : doctor.nameEn}</h3>
                    <p className="text-primary text-sm font-medium mt-1 capitalize">{doctor.specialty}</p>
                    {doctor.experience && (
                      <p className="text-muted-foreground text-sm mt-1">{doctor.experience} {t("experience")}</p>
                    )}
                    {(lang === "ar" ? doctor.bioAr : doctor.bioEn) && (
                      <p className="text-muted-foreground text-sm mt-3 line-clamp-2">
                        {lang === "ar" ? doctor.bioAr : doctor.bioEn}
                      </p>
                    )}
                    <Link href="/book">
                      <Button className="w-full mt-4" variant="outline" size="sm">
                        {t("bookNow")}
                      </Button>
                    </Link>
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
