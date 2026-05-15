import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Calendar, Users, Stethoscope, Package, Star, LogOut, Menu, X, Sun, Moon, Globe, ChevronRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

interface NavItem {
  href: string;
  icon: React.ElementType;
  labelAr: string;
  labelEn: string;
  roles?: string[];
}

const navItems: NavItem[] = [
  { href: "/admin/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelEn: "Dashboard" },
  { href: "/admin/appointments", icon: Calendar, labelAr: "المواعيد", labelEn: "Appointments" },
  { href: "/admin/doctors", icon: Stethoscope, labelAr: "الأطباء", labelEn: "Doctors", roles: ["superadmin", "admin"] },
  { href: "/admin/services", icon: Star, labelAr: "الخدمات", labelEn: "Services", roles: ["superadmin", "admin"] },
  { href: "/admin/packages", icon: Package, labelAr: "الباقات", labelEn: "Packages", roles: ["superadmin", "admin"] },
  { href: "/admin/testimonials", icon: Users, labelAr: "التجارب", labelEn: "Testimonials", roles: ["superadmin", "admin"] },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { lang, setLang } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, setUser } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch(`${BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
    setUser(null);
    window.location.href = import.meta.env.BASE_URL;
  };

  const filteredNav = navItems.filter(item =>
    !item.roles || !user || item.roles.includes(user.role)
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-border flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="text-white font-bold text-sm">ع</span>
        </div>
        <div>
          <div className="font-bold text-primary text-sm" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Cairo, sans-serif" }}>
            {lang === "ar" ? "عيادة كلير" : "Clear Clinic"}
          </div>
          <div className="text-xs text-muted-foreground">Admin Panel</div>
        </div>
      </div>

      {/* User info */}
      {user && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-accent/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
              {user.name?.charAt(0) || user.username?.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="font-medium text-foreground text-sm truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {filteredNav.map(item => {
          const active = location === item.href || location.startsWith(item.href + "/");
          return (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-foreground/70 hover:bg-accent hover:text-foreground"
              }`}>
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{lang === "ar" ? item.labelAr : item.labelEn}</span>
                {active && <ChevronRight className={`w-3.5 h-3.5 ms-auto ${lang === "ar" ? "rotate-180" : ""}`} />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-border space-y-1">
        <div className="flex items-center gap-2 px-3 py-2">
          <button onClick={() => setLang(lang === "ar" ? "en" : "ar")} className="flex-1 flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors">
            <Globe className="w-4 h-4" />
            {lang === "ar" ? "English" : "عربي"}
          </button>
          <button onClick={toggleTheme} className="p-1.5 rounded-lg hover:bg-accent transition-colors text-foreground/70 hover:text-foreground">
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          {lang === "ar" ? "تسجيل الخروج" : "Logout"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 border-e border-border bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: lang === "ar" ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: lang === "ar" ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className={`fixed top-0 bottom-0 z-50 w-60 bg-card border-border md:hidden ${lang === "ar" ? "right-0 border-s" : "left-0 border-e"}`}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 h-14 border-b border-border bg-card">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-accent">
            <Menu className="w-5 h-5" />
          </button>
          <div className="font-bold text-primary text-sm" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Cairo, sans-serif" }}>
            {lang === "ar" ? "عيادة كلير" : "Clear Clinic"}
          </div>
          <button onClick={() => setSidebarOpen(false)} className={sidebarOpen ? "block" : "invisible"}>
            <X className="w-5 h-5" />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
