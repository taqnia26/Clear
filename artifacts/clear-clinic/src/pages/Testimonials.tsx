import { motion, type Variants } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useListTestimonials } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Testimonials() {
  const { lang } = useLanguage();
  const { data: testimonials, isLoading } = useListTestimonials({ approved: true });

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-12">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
            {lang === "ar" ? "آراء مرضانا" : "Patient Reviews"}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
            {lang === "ar" ? "تجارب مرضانا" : "Patient Experiences"}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {lang === "ar" ? "نفخر بثقة مرضانا وآرائهم الإيجابية" : "We are proud of our patients' trust and positive feedback"}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {(testimonials || []).map((testimonial) => (
              <motion.div key={testimonial.id} variants={fadeUp}>
                <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col relative overflow-hidden">
                  <Quote className="absolute top-4 end-4 w-8 h-8 text-primary/10" />
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-secondary fill-secondary" />
                    ))}
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed flex-1 italic">
                    "{lang === "ar" ? testimonial.commentAr : testimonial.commentEn}"
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {testimonial.patientName?.charAt(0)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{testimonial.patientName}</div>
                      <div className="text-xs text-muted-foreground">{lang === "ar" ? "مريض/ة موثق/ة" : "Verified Patient"}</div>
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
