import { useRef } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Star, ChevronDown, Award, Users, Stethoscope, Trophy, ArrowRight, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListServices, useListDoctors, useListTestimonials, useListPackages } from "@workspace/api-client-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.12 } },
};

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col items-center p-6 rounded-2xl bg-card/60 backdrop-blur-sm border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <div className="text-3xl font-bold text-foreground">{value}</div>
      <div className="text-sm text-muted-foreground mt-1 text-center">{label}</div>
    </motion.div>
  );
}

export default function Home() {
  const { t, lang, isRtl } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { data: services } = useListServices({ active: true });
  const { data: doctors } = useListDoctors({ active: true });
  const { data: testimonials } = useListTestimonials({ approved: true });
  const { data: packages } = useListPackages({ featured: true });

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/10" />
          <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-secondary/15 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
        </motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-16">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-6">
            <motion.div variants={fadeUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 px-4 py-1 text-sm font-medium">
                {lang === "ar" ? "🏆 الأفضل في المملكة العربية السعودية" : "🏆 Best in Saudi Arabia"}
              </Badge>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight"
              style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}
            >
              <span className="text-foreground">{lang === "ar" ? "حيث يلتقي" : "Where"}</span>{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                {lang === "ar" ? "الطب الدقيق" : "Precision Medicine"}
              </span>
              <br />
              <span className="text-foreground">{lang === "ar" ? "بالجمال" : "Meets Beauty"}</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t("heroSubtitle")}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/book">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 px-8">
                  {t("book")}
                  <ArrowIcon className="w-4 h-4 ms-2" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="px-8">
                  {t("services")}
                </Button>
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-4">
              {[
                { icon: Star, label: lang === "ar" ? "تقييم 4.9/5" : "4.9/5 Rating" },
                { icon: Users, label: lang === "ar" ? "+5000 مريض" : "+5000 Patients" },
                { icon: Award, label: lang === "ar" ? "معتمد دولياً" : "Internationally Certified" },
              ].map(({ icon: Icon, label }, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger} className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, value: "5,000+", label: t("statPatients") },
              { icon: Stethoscope, value: "15+", label: t("statDoctors") },
              { icon: Star, value: "30+", label: t("statServices") },
              { icon: Trophy, value: "12+", label: t("statAwards") },
            ].map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-12">
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">{lang === "ar" ? "خدماتنا" : "Our Services"}</Badge>
              <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
                {t("ourServices")}
              </h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(services?.slice(0, 6) || []).map((service, i) => (
                <motion.div key={service.id} variants={fadeUp} custom={i}>
                  <div className="group rounded-2xl border border-border bg-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {service.imageUrl && (
                      <div className="w-full h-40 rounded-xl overflow-hidden mb-4 bg-accent">
                        <img src={service.imageUrl} alt={lang === "ar" ? service.nameAr : service.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <Badge variant="outline" className="self-start mb-3 capitalize text-xs">
                      {service.category === "cosmetic" ? t("cosmetic") : service.category === "dental" ? t("dental") : t("both")}
                    </Badge>
                    <h3 className="font-semibold text-foreground text-lg mb-2">{lang === "ar" ? service.nameAr : service.nameEn}</h3>
                    <p className="text-muted-foreground text-sm flex-1 line-clamp-2">{lang === "ar" ? service.descriptionAr : service.descriptionEn}</p>
                    {service.priceFrom && (
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t("priceFrom")} <span className="font-bold text-primary">{service.priceFrom} {lang === "ar" ? "ر.س" : "SAR"}</span></span>
                        <Link href="/book"><Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-primary-foreground">{t("bookNow")}</Button></Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            {services && services.length > 0 && (
              <motion.div variants={fadeUp} className="text-center mt-10">
                <Link href="/services">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    {t("viewAllServices")} <ArrowIcon className="w-4 h-4 ms-2" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      {packages && packages.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/30 mb-3">{lang === "ar" ? "عروض حصرية" : "Exclusive Offers"}</Badge>
                <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>{t("specialOffers")}</h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.slice(0, 3).map((pkg, i) => (
                  <motion.div key={pkg.id} variants={fadeUp} custom={i}>
                    <div className="relative rounded-2xl overflow-hidden border-2 border-secondary/30 bg-card shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                      {pkg.discountPercent && (
                        <div className="absolute top-4 start-4 z-10">
                          <Badge className="bg-secondary text-secondary-foreground shadow">{pkg.discountPercent}% {t("discount")}</Badge>
                        </div>
                      )}
                      {pkg.imageUrl && (
                        <div className="h-48 overflow-hidden">
                          <img src={pkg.imageUrl} alt={lang === "ar" ? pkg.nameAr : pkg.nameEn} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="p-5">
                        <h3 className="font-bold text-lg text-foreground mb-2">{lang === "ar" ? pkg.nameAr : pkg.nameEn}</h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{lang === "ar" ? pkg.descriptionAr : pkg.descriptionEn}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            {pkg.originalPrice && <div className="text-xs text-muted-foreground line-through">{pkg.originalPrice} {lang === "ar" ? "ر.س" : "SAR"}</div>}
                            {pkg.discountedPrice && <div className="text-xl font-bold text-primary">{pkg.discountedPrice} {lang === "ar" ? "ر.س" : "SAR"}</div>}
                          </div>
                          <Link href="/book"><Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">{t("bookNow")}</Button></Link>
                        </div>
                        {pkg.validUntil && <div className="text-xs text-muted-foreground mt-2">{t("validUntil")}: {pkg.validUntil}</div>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Doctors */}
      {doctors && doctors.length > 0 && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">{lang === "ar" ? "فريقنا الطبي" : "Our Medical Team"}</Badge>
                <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>{t("ourDoctors")}</h2>
              </motion.div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctors.slice(0, 3).map((doctor, i) => (
                  <motion.div key={doctor.id} variants={fadeUp} custom={i}>
                    <div className="group rounded-2xl border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="h-56 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center overflow-hidden">
                        {doctor.imageUrl
                          ? <img src={doctor.imageUrl} alt={lang === "ar" ? doctor.nameAr : doctor.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          : <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center"><Stethoscope className="w-12 h-12 text-primary/60" /></div>
                        }
                      </div>
                      <div className="p-5">
                        <h3 className="font-bold text-foreground text-lg">{lang === "ar" ? doctor.nameAr : doctor.nameEn}</h3>
                        <p className="text-primary text-sm font-medium mt-0.5 capitalize">{doctor.specialty}</p>
                        {doctor.experience && <p className="text-muted-foreground text-sm mt-1">{doctor.experience} {t("experience")}</p>}
                        <Link href="/book"><Button size="sm" className="mt-4 w-full" variant="outline">{t("bookNow")}</Button></Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <motion.div variants={fadeUp} className="text-center mt-10">
                <Link href="/doctors">
                  <Button variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                    {t("viewAllDoctors")} <ArrowIcon className="w-4 h-4 ms-2" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-12">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">{lang === "ar" ? "آراء مرضانا" : "Patient Reviews"}</Badge>
                <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>{t("testimonials")}</h2>
              </motion.div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.slice(0, 3).map((testimonial, i) => (
                  <motion.div key={testimonial.id} variants={fadeUp} custom={i}>
                    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                      <div className="flex mb-3">
                        {Array.from({ length: testimonial.rating }).map((_, j) => <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />)}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed flex-1 italic">
                        "{lang === "ar" ? testimonial.commentAr : testimonial.commentEn}"
                      </p>
                      <div className="mt-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {testimonial.patientName?.charAt(0)}
                        </div>
                        <div className="font-semibold text-sm text-foreground">{testimonial.patientName}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 text-white shadow-2xl shadow-primary/30">
              <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
                {lang === "ar" ? "ابدأ رحلتك نحو الجمال" : "Start Your Beauty Journey"}
              </h2>
              <p className="text-white/80 mb-8 text-lg">{lang === "ar" ? "احجز موعدك الآن وتمتع بخدمات عالمية المستوى" : "Book your appointment now and enjoy world-class services"}</p>
              <Link href="/book">
                <Button size="lg" className="bg-white text-primary hover:bg-white/90 shadow-lg px-10 font-semibold">
                  {t("book")} <ArrowIcon className="w-4 h-4 ms-2" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
