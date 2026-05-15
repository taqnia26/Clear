import { useRef, useEffect, useState } from "react";
import { Link } from "wouter";
import { motion, useScroll, useTransform, useSpring, useInView, type Variants } from "framer-motion";
import {
  Star, ChevronDown, Award, Users, Stethoscope, Trophy, ArrowRight, ArrowLeft,
  Sparkles, ShieldCheck, HeartPulse, Gem, Phone, MapPin, Clock, Quote,
  Plus, Minus, CheckCircle2,
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useListServices, useListDoctors, useListTestimonials, useListPackages,
} from "@workspace/api-client-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.1 } },
};

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (value - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value]);

  return <span ref={ref}>{display.toLocaleString()}{suffix}</span>;
}

function FAQItem({ q, a, isOpen, onClick }: { q: string; a: string; isOpen: boolean; onClick: () => void }) {
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button onClick={onClick} className="w-full flex items-center justify-between gap-4 py-5 text-start hover:text-primary transition-colors">
        <span className="font-semibold text-foreground text-base md:text-lg">{q}</span>
        <div className="shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-muted-foreground leading-relaxed">{a}</p>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const { t, lang, isRtl } = useLanguage();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 240]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const { scrollYProgress: pageProgress } = useScroll();
  const progressBar = useSpring(pageProgress, { stiffness: 100, damping: 30 });

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const { data: services } = useListServices({ active: true });
  const { data: doctors } = useListDoctors({ active: true });
  const { data: testimonials } = useListTestimonials({ approved: true });
  const { data: packages } = useListPackages({ featured: true });

  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const trustItems = lang === "ar"
    ? ["معتمد دولياً", "أحدث التقنيات الأوروبية", "أطباء استشاريون", "ضمان النتائج", "خصوصية تامة", "خدمة VIP"]
    : ["Internationally Certified", "Latest European Tech", "Consultant Doctors", "Result Guarantee", "Total Privacy", "VIP Service"];

  const features = [
    { icon: Sparkles, titleAr: "تقنيات متطورة", titleEn: "Cutting-Edge Tech", descAr: "أحدث الأجهزة الأوروبية والأمريكية لنتائج فائقة الدقة.", descEn: "Latest European & US devices for ultra-precise results." },
    { icon: ShieldCheck, titleAr: "أمان معتمد", titleEn: "Certified Safety", descAr: "بروتوكولات تعقيم صارمة ومنتجات أصلية معتمدة من FDA.", descEn: "Strict sterilization protocols and FDA-approved original products." },
    { icon: HeartPulse, titleAr: "رعاية شخصية", titleEn: "Personalized Care", descAr: "خطة علاج مخصصة لكل ضيف، تجربة فاخرة من البداية للنهاية.", descEn: "Customized treatment plan for every guest, luxury experience throughout." },
    { icon: Gem, titleAr: "تجربة فاخرة", titleEn: "Luxury Experience", descAr: "أجواء فندقية، صالة استقبال خاصة، وخدمة سيارة VIP.", descEn: "Hotel-like ambiance, private lounge, and VIP car service." },
  ];

  const faqs = lang === "ar" ? [
    { q: "ما هي مدة جلسة البوتوكس؟", a: "تستغرق جلسة البوتوكس عادة 20-30 دقيقة، وتظهر النتائج خلال 3-7 أيام وتدوم من 4 إلى 6 أشهر." },
    { q: "هل زراعة الأسنان مؤلمة؟", a: "زراعة الأسنان تتم تحت تخدير موضعي كامل، فلا تشعر بأي ألم أثناء الإجراء، وقد توجد آلام بسيطة بعد الجلسة يمكن التحكم بها بمسكنات بسيطة." },
    { q: "كم تكلفة ابتسامة هوليوود؟", a: "تبدأ أسعار ابتسامة هوليوود من 2500 ريال للسن الواحد، مع باقات شاملة بأسعار مخفضة للابتسامة الكاملة." },
    { q: "هل تقدمون باقات للعرايس؟", a: "نعم، لدينا باقة العروس الذهبية التي تشمل ابتسامة هوليوود + بوتوكس + جلسة ليزر بخصم يصل إلى 30%." },
    { q: "هل تتوفر خدمة الدفع بالتقسيط؟", a: "نعم، نوفر خيارات تقسيط مرنة بدون فوائد عبر تابي وتمارا وعدة بنوك سعودية." },
  ] : [
    { q: "How long does a Botox session take?", a: "A Botox session usually takes 20-30 minutes; results appear within 3-7 days and last 4-6 months." },
    { q: "Is dental implant painful?", a: "Dental implants are done under full local anesthesia, so you feel no pain during the procedure. Mild post-op discomfort is easily controlled with simple painkillers." },
    { q: "How much does a Hollywood Smile cost?", a: "Hollywood Smile pricing starts from SAR 2,500 per tooth, with comprehensive packages at discounted rates for the full smile." },
    { q: "Do you offer bridal packages?", a: "Yes, our Golden Bride Package includes Hollywood Smile + Botox + Laser session with up to 30% off." },
    { q: "Is installment payment available?", a: "Yes, we offer flexible interest-free installment options via Tabby, Tamara and several Saudi banks." },
  ];

  return (
    <div className="overflow-hidden">
      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: progressBar }}
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-secondary to-primary origin-left z-[60]"
      />

      {/* HERO */}
      <div ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
        {/* Background image with parallax + zoom */}
        <motion.div
          style={{ y: heroY, scale: heroScale }}
          className="absolute inset-0 z-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600275669439-14e40452d20b?w=2400&q=80')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/55 to-background" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/40 via-primary/10 to-secondary/30 mix-blend-multiply dark:mix-blend-normal" />
          <div className="absolute inset-0 bg-foreground/10 dark:bg-foreground/30" />
        </motion.div>

        {/* Floating decorative blobs */}
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-32 -start-20 w-96 h-96 rounded-full bg-primary/30 blur-[120px] z-0"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="absolute bottom-20 -end-32 w-[500px] h-[500px] rounded-full bg-secondary/25 blur-[140px] z-0"
        />

        {/* Hero content */}
        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-28 pb-16">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-7">
            <motion.div variants={fadeUp} className="flex items-center justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-secondary" />
                <span className="text-sm font-medium text-foreground">
                  {lang === "ar" ? "العيادة الأكثر تميزاً في السعودية ٢٠٢٦" : "Saudi Arabia's Most Distinguished Clinic 2026"}
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold ${lang === "ar" ? "leading-[1.4]" : "leading-[1.05] tracking-tight"}`}
              style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}
            >
              <span className="block text-foreground">
                {lang === "ar" ? "جمالٌ يُعيد" : "Beauty That"}
              </span>
              <span className="block text-primary">
                {lang === "ar" ? "تعريف الأناقة" : "Redefines Elegance"}
              </span>
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed font-medium">
              {lang === "ar"
                ? "في عيادة كلير، نمزج بين علم الطب الدقيق وفن الجمال لنخلق لك تجربة فاخرة تستحقها."
                : "At Clear Clinic, we blend the science of precision medicine with the art of beauty to create the luxury experience you deserve."}
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/book">
                <Button size="lg" className="group bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/40 px-8 h-14 text-base rounded-full">
                  <span>{lang === "ar" ? "احجز استشارتك المجانية" : "Book Your Free Consultation"}</span>
                  <ArrowIcon className="w-4 h-4 ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg" className="px-8 h-14 text-base rounded-full backdrop-blur-md bg-white/10 border-white/30 hover:bg-white/20">
                  {lang === "ar" ? "استكشف خدماتنا" : "Explore Services"}
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges floating on hero */}
            <motion.div variants={fadeUp} className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto pt-8">
              {[
                { icon: Star, value: 5000, suffix: "+", label: lang === "ar" ? "مريض راضٍ" : "Happy Patients" },
                { icon: Stethoscope, value: 15, suffix: "+", label: lang === "ar" ? "طبيب استشاري" : "Consultants" },
                { icon: Trophy, value: 12, suffix: "+", label: lang === "ar" ? "جائزة دولية" : "Awards" },
                { icon: Award, value: 98, suffix: "%", label: lang === "ar" ? "رضا العملاء" : "Satisfaction" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl backdrop-blur-xl bg-white/10 border border-white/20 p-4 shadow-lg hover:bg-white/15 transition-colors">
                  <s.icon className="w-5 h-5 text-secondary mx-auto mb-2" />
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    <AnimatedNumber value={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] md:text-xs text-foreground/70 mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 text-foreground/60"
          >
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.div>
      </div>

      {/* TRUST MARQUEE */}
      <section className="py-6 bg-foreground text-background overflow-hidden border-y border-border">
        <div className="flex gap-12 whitespace-nowrap animate-marquee">
          {[...trustItems, ...trustItems, ...trustItems].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-base font-medium opacity-90 shrink-0">
              <Sparkles className="w-4 h-4 text-secondary shrink-0" />
              <span className="whitespace-nowrap">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES / WHY US */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="text-center mb-16">
            <motion.div variants={fadeUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-4 py-1.5">
                {lang === "ar" ? "✨ لماذا كلير" : "✨ Why Clear"}
              </Badge>
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-bold mb-4 tracking-tight" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
              {lang === "ar" ? (<>تجربة <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">لا تُنسى</span></>) : (<>An <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Unforgettable</span> Experience</>)}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {lang === "ar" ? "أربعة ركائز نضمن من خلالها لك تجربة فاخرة بنتائج استثنائية." : "Four pillars guaranteeing you a luxury experience with exceptional results."}
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp}>
                <div className="group relative h-full p-7 rounded-3xl bg-card border border-border/60 hover:border-primary/40 hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:to-secondary/10 transition-all duration-500" />
                  <div className="relative">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center mb-5 shadow-lg shadow-primary/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                      <f.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-foreground">{lang === "ar" ? f.titleAr : f.titleEn}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{lang === "ar" ? f.descAr : f.descEn}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* SERVICES — premium image cards */}
      <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
              <motion.div variants={fadeUp}>
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 px-4 py-1.5">
                  {lang === "ar" ? "خدماتنا" : "Our Services"}
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
                  {lang === "ar" ? "الخدمات الفاخرة" : "Premium Services"}
                </h2>
              </motion.div>
              <motion.div variants={fadeUp}>
                <Link href="/services">
                  <Button variant="ghost" className="text-primary hover:text-primary group">
                    {lang === "ar" ? "كل الخدمات" : "All Services"}
                    <ArrowIcon className="w-4 h-4 ms-2 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(services?.slice(0, 6) || []).map((service, i) => (
                <motion.div key={service.id} variants={fadeUp} custom={i}>
                  <Link href="/book">
                    <div className="group relative rounded-3xl overflow-hidden bg-card border border-border/60 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 h-full">
                      <div className="relative h-56 overflow-hidden">
                        {service.imageUrl ? (
                          <img src={service.imageUrl} alt={lang === "ar" ? service.nameAr : service.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="absolute top-4 start-4">
                          <Badge className="backdrop-blur-md bg-white/20 text-white border-white/30 capitalize">
                            {service.category === "cosmetic" ? t("cosmetic") : service.category === "dental" ? t("dental") : t("both")}
                          </Badge>
                        </div>
                        <div className="absolute bottom-4 inset-x-4">
                          <h3 className="text-xl font-bold text-white drop-shadow-lg">{lang === "ar" ? service.nameAr : service.nameEn}</h3>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{lang === "ar" ? service.descriptionAr : service.descriptionEn}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-border/60">
                          {service.priceFrom && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">{t("priceFrom")} </span>
                              <span className="font-bold text-primary text-lg">{service.priceFrom}</span>
                              <span className="text-xs text-muted-foreground ms-1">{lang === "ar" ? "ر.س" : "SAR"}</span>
                            </div>
                          )}
                          <div className="text-primary text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                            {t("bookNow")} <ArrowIcon className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PACKAGES — luxe ribbon cards */}
      {packages && packages.length > 0 && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
          <div className="absolute top-0 -start-40 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />
          <div className="absolute bottom-0 -end-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="text-center mb-14">
              <motion.div variants={fadeUp}>
                <Badge className="bg-secondary/20 text-secondary-foreground border-secondary/40 mb-3 px-4 py-1.5">
                  {lang === "ar" ? "🎁 عروض حصرية" : "🎁 Exclusive Offers"}
                </Badge>
              </motion.div>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
                {lang === "ar" ? (<>باقات <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">مميزة</span></>) : (<>Curated <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">Packages</span></>)}
              </motion.h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.slice(0, 3).map((pkg, i) => (
                <motion.div key={pkg.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}>
                  <div className="group relative rounded-3xl overflow-hidden bg-card shadow-xl hover:shadow-2xl hover:shadow-secondary/20 hover:-translate-y-2 transition-all duration-500">
                    {pkg.discountPercent && (
                      <div className="absolute top-5 end-5 z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-secondary blur-xl opacity-60" />
                          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground flex flex-col items-center justify-center shadow-lg font-bold rotate-12 group-hover:rotate-0 transition-transform">
                            <span className="text-xs">{lang === "ar" ? "خصم" : "SAVE"}</span>
                            <span className="text-base">{pkg.discountPercent}%</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {pkg.imageUrl && (
                      <div className="relative h-56 overflow-hidden">
                        <img src={pkg.imageUrl} alt={lang === "ar" ? pkg.nameAr : pkg.nameEn} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-foreground mb-2">{lang === "ar" ? pkg.nameAr : pkg.nameEn}</h3>
                      <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">{lang === "ar" ? pkg.descriptionAr : pkg.descriptionEn}</p>

                      <div className="flex items-end justify-between mb-5">
                        <div>
                          {pkg.originalPrice && <div className="text-sm text-muted-foreground line-through">{pkg.originalPrice} {lang === "ar" ? "ر.س" : "SAR"}</div>}
                          {pkg.discountedPrice && (
                            <div className="text-3xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                              {pkg.discountedPrice}
                              <span className="text-sm text-muted-foreground font-normal ms-1">{lang === "ar" ? "ر.س" : "SAR"}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Link href="/book">
                        <Button className="w-full bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors rounded-full">
                          {lang === "ar" ? "احجز الباقة" : "Book Package"} <ArrowIcon className="w-4 h-4 ms-2" />
                        </Button>
                      </Link>

                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* DOCTORS — magazine layout */}
      {doctors && doctors.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-16">
                <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 px-4 py-1.5">
                  {lang === "ar" ? "👨‍⚕️ نخبة الأطباء" : "👨‍⚕️ Elite Doctors"}
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight mt-3" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
                  {lang === "ar" ? (<>أيدٍ <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">خبيرة</span></>) : (<>Expert <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Hands</span></>)}
                </h2>
                <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
                  {lang === "ar" ? "أطباء استشاريون من أرقى المدارس الطبية في العالم، يعملون لراحتك ورضاك." : "Consultants trained at the world's finest medical schools, working for your comfort and satisfaction."}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {doctors.slice(0, 3).map((doctor, i) => (
                  <motion.div key={doctor.id} variants={fadeUp} custom={i}>
                    <div className="group relative">
                      <div className="relative h-96 rounded-3xl overflow-hidden">
                        {doctor.imageUrl ? (
                          <img src={doctor.imageUrl} alt={lang === "ar" ? doctor.nameAr : doctor.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                            <Stethoscope className="w-24 h-24 text-primary/50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                        {/* Floating info card */}
                        <div className="absolute inset-x-5 bottom-5 p-5 rounded-2xl backdrop-blur-xl bg-white/15 border border-white/20 shadow-xl">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-secondary text-secondary-foreground capitalize text-xs">
                              {doctor.specialty === "cosmetic" ? t("cosmetic") : doctor.specialty === "dental" ? t("dental") : t("both")}
                            </Badge>
                            {doctor.experience && (
                              <span className="text-xs text-white/80">+{doctor.experience} {lang === "ar" ? "سنة" : "yrs"}</span>
                            )}
                          </div>
                          <h3 className="text-xl font-bold text-white drop-shadow">{lang === "ar" ? doctor.nameAr : doctor.nameEn}</h3>
                          {(doctor.titleAr || doctor.titleEn) && (
                            <p className="text-sm text-white/85 mt-1">{lang === "ar" ? doctor.titleAr : doctor.titleEn}</p>
                          )}
                          <Link href="/book">
                            <Button size="sm" className="mt-4 w-full bg-white text-primary hover:bg-white/90 rounded-full">
                              {t("bookNow")}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div variants={fadeUp} className="text-center mt-12">
                <Link href="/doctors">
                  <Button variant="outline" size="lg" className="rounded-full px-8 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground">
                    {t("viewAllDoctors")} <ArrowIcon className="w-4 h-4 ms-2" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS — premium quote cards */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 bg-gradient-to-br from-foreground to-foreground/95 text-background relative overflow-hidden">
          <div className="absolute -top-20 -start-20 w-96 h-96 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute -bottom-20 -end-20 w-96 h-96 rounded-full bg-secondary/20 blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
              <motion.div variants={fadeUp} className="text-center mb-14">
                <Badge className="bg-secondary/20 text-secondary border-secondary/30 mb-3 px-4 py-1.5">
                  {lang === "ar" ? "💬 ما يقولون عنا" : "💬 What They Say"}
                </Badge>
                <h2 className="text-4xl md:text-6xl font-bold mt-3" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
                  {lang === "ar" ? "قصص نجاح حقيقية" : "Real Success Stories"}
                </h2>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonials.slice(0, 3).map((testimonial, i) => (
                  <motion.div key={testimonial.id} variants={fadeUp} custom={i}>
                    <div className="group relative h-full p-7 rounded-3xl backdrop-blur-md bg-white/5 border border-white/10 hover:bg-white/10 hover:border-secondary/40 transition-all duration-500">
                      <Quote className="w-10 h-10 text-secondary/50 mb-4" />
                      <div className="flex mb-4">
                        {Array.from({ length: testimonial.rating }).map((_, j) => (
                          <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />
                        ))}
                      </div>
                      <p className="text-background/90 leading-relaxed mb-6 text-base">
                        {lang === "ar" ? testimonial.commentAr : testimonial.commentEn}
                      </p>
                      <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shadow-lg">
                          {testimonial.patientName?.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-background">{testimonial.patientName}</div>
                          <div className="text-xs text-background/60">{lang === "ar" ? "مريض موثق" : "Verified Patient"}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* FAQ + CONTACT split */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14">
          {/* FAQ */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <Badge className="bg-primary/10 text-primary border-primary/20 mb-3 px-4 py-1.5">
                {lang === "ar" ? "❓ أسئلة شائعة" : "❓ FAQ"}
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
                {lang === "ar" ? "إجابات لأهم استفساراتك" : "Answers to Your Top Questions"}
              </h2>
              <p className="text-muted-foreground mb-8">
                {lang === "ar" ? "إذا لم تجد إجابتك هنا، فريقنا جاهز للرد عليك ٢٤/٧." : "If you don't find your answer here, our team is ready to help 24/7."}
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-3xl bg-card border border-border p-2 shadow-sm">
              <div className="px-5">
                {faqs.map((faq, i) => (
                  <FAQItem
                    key={i}
                    q={faq.q}
                    a={faq.a}
                    isOpen={openFaq === i}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact card */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={fadeUp} className="lg:sticky lg:top-32 self-start">
            <div className="relative rounded-3xl overflow-hidden p-10 bg-gradient-to-br from-primary via-primary to-primary/85 text-white shadow-2xl shadow-primary/40">
              <div className="absolute top-0 end-0 w-72 h-72 rounded-full bg-secondary/30 blur-3xl" />
              <div className="absolute bottom-0 start-0 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

              <div className="relative">
                <Sparkles className="w-10 h-10 text-secondary mb-5" />
                <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
                  {lang === "ar" ? "زُر عيادة كلير اليوم" : "Visit Clear Clinic Today"}
                </h3>
                <p className="text-white/85 mb-8 text-lg leading-relaxed">
                  {lang === "ar" ? "احجز استشارتك المجانية واكتشف بنفسك ما الذي يجعلنا الأفضل." : "Book your free consultation and discover what makes us the best."}
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { icon: MapPin, label: lang === "ar" ? "حي السليمانية، الرياض، السعودية" : "Sulaimaniyah District, Riyadh, KSA" },
                    { icon: Phone, label: "+966 11 234 5678" },
                    { icon: Clock, label: lang === "ar" ? "السبت - الخميس: ٩ صباحاً - ١٠ مساءً" : "Sat - Thu: 9 AM - 10 PM" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/90">
                      <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur flex items-center justify-center">
                        <item.icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                  ))}
                </div>

                <Link href="/book">
                  <Button size="lg" className="w-full bg-white text-primary hover:bg-white/95 rounded-full h-14 text-base font-semibold shadow-xl">
                    {lang === "ar" ? "احجز موعدك الآن" : "Book Your Appointment"}
                    <ArrowIcon className="w-4 h-4 ms-2" />
                  </Button>
                </Link>

                <div className="flex items-center justify-center gap-2 mt-5 text-xs text-white/80">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === "ar" ? "استشارة مجانية ٤ دقائق فقط" : "Free 4-minute consultation"}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
