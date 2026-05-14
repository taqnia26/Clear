import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  const { t, lang, setLang, isRtl } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t("home") },
    { href: "/services", label: t("services") },
    { href: "/doctors", label: t("doctors") },
    { href: "/packages", label: t("packages") },
    { href: "/testimonials", label: t("testimonials") },
  ];

  const isActive = (href: string) => location === href;

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/80 shadow-lg border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">ع</span>
            </div>
            <div className="leading-tight">
              <div className="font-bold text-primary text-base md:text-lg" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
                {lang === "ar" ? "عيادة كلير" : "Clear Clinic"}
              </div>
              <div className="text-xs text-muted-foreground hidden sm:block">
                {lang === "ar" ? "الجمال والأسنان" : "Beauty & Dental"}
              </div>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive(link.href)
                    ? "text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-accent/50"
                }`}>
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="navbar-active"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors text-foreground/70 hover:text-foreground flex items-center gap-1 text-sm font-medium"
              title="Toggle language"
            >
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === "ar" ? "EN" : "عر"}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-accent/50 transition-colors text-foreground/70 hover:text-foreground"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link href="/book" className="hidden sm:block">
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                {t("book")}
              </Button>
            </Link>
            <Link href="/admin/login" className="hidden md:block">
              <Button variant="outline" size="sm">
                {t("login")}
              </Button>
            </Link>
            <button
              className="md:hidden p-2 rounded-lg hover:bg-accent/50"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className={`w-full text-start px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:bg-accent/50"
                    }`}
                  >
                    {link.label}
                  </button>
                </Link>
              ))}
              <div className="flex gap-2 pt-2">
                <Link href="/book" className="flex-1">
                  <Button className="w-full" size="sm" onClick={() => setMobileOpen(false)}>
                    {t("book")}
                  </Button>
                </Link>
                <Link href="/admin/login" className="flex-1">
                  <Button variant="outline" className="w-full" size="sm" onClick={() => setMobileOpen(false)}>
                    {t("login")}
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
