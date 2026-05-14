import { Link } from "wouter";
import { useLanguage } from "@/contexts/LanguageContext";
import { Phone, Mail, MapPin, Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
  const { lang } = useLanguage();
  const isAr = lang === "ar";

  return (
    <footer className="bg-card border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-sm">ع</span>
              </div>
              <div>
                <div className="font-bold text-primary text-lg" style={{ fontFamily: isAr ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
                  {isAr ? "عيادة كلير" : "Clear Clinic"}
                </div>
                <div className="text-xs text-muted-foreground">{isAr ? "الجمال والأسنان" : "Beauty & Dental"}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isAr
                ? "عيادة متخصصة في طب الأسنان والتجميل بأعلى المعايير العالمية في المملكة العربية السعودية."
                : "A specialized clinic in cosmetic and dental care with the highest international standards in Saudi Arabia."}
            </p>
            <div className="flex gap-3 mt-4">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button key={i} className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{isAr ? "روابط سريعة" : "Quick Links"}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {[
                { href: "/services", labelAr: "الخدمات", labelEn: "Services" },
                { href: "/doctors", labelAr: "الأطباء", labelEn: "Doctors" },
                { href: "/packages", labelAr: "الباقات والعروض", labelEn: "Packages & Offers" },
                { href: "/book", labelAr: "احجز موعداً", labelEn: "Book Appointment" },
                { href: "/testimonials", labelAr: "تجارب المرضى", labelEn: "Testimonials" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-primary transition-colors">
                    {isAr ? l.labelAr : l.labelEn}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">{isAr ? "تواصل معنا" : "Contact Us"}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span dir="ltr">+966 55 000 0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span>info@clearclinic.sa</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{isAr ? "الرياض، المملكة العربية السعودية" : "Riyadh, Saudi Arabia"}</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-10 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {isAr ? "عيادة كلير — جميع الحقوق محفوظة" : "Clear Clinic — All rights reserved"}
        </div>
      </div>
    </footer>
  );
}
