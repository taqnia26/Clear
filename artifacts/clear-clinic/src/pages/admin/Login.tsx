import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Eye, EyeOff } from "lucide-react";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Login() {
  const { lang } = useLanguage();
  const { setUser } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Login failed");
      }
      const data = await res.json();
      setUser(data.admin);
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      toast({
        title: lang === "ar" ? "خطأ في تسجيل الدخول" : "Login failed",
        description: err instanceof Error ? err.message : "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-2xl border border-border bg-card shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
              {lang === "ar" ? "لوحة تحكم عيادة كلير" : "Clear Clinic Admin"}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {lang === "ar" ? "تسجيل الدخول للمشرفين" : "Administrator Login"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username">{lang === "ar" ? "اسم المستخدم" : "Username"}</Label>
              <Input
                id="username"
                dir="ltr"
                autoComplete="username"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                placeholder="admin"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">{lang === "ar" ? "كلمة المرور" : "Password"}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  dir="ltr"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPass(v => !v)}
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading
                ? (lang === "ar" ? "جاري الدخول..." : "Signing in...")
                : (lang === "ar" ? "تسجيل الدخول" : "Sign In")}
            </Button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-muted/50 text-xs text-muted-foreground text-center space-y-1">
            <p className="font-medium">{lang === "ar" ? "بيانات تجريبية:" : "Demo credentials:"}</p>
            <p dir="ltr">admin / admin123</p>
            <p dir="ltr">receptionist / recep123</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
