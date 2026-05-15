import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion, type Variants } from "framer-motion";
import { Star, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useListTestimonials } from "@workspace/api-client-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function AdminTestimonials() {
  const { lang } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: testimonials, isLoading } = useListTestimonials({});

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
    else if (user?.role === "receptionist") navigate("/admin/appointments");
  }, [isAuthenticated, user, navigate]);

  const toggleApproved = async (id: number, approved: boolean) => {
    await fetch(`${BASE}/api/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ approved }),
    });
    await queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
  };

  const handleDelete = async (id: number) => {
    if (!confirm(lang === "ar" ? "تأكيد الحذف؟" : "Confirm delete?")) return;
    await fetch(`${BASE}/api/testimonials/${id}`, { method: "DELETE", credentials: "include" });
    await queryClient.invalidateQueries({ queryKey: ["/api/testimonials"] });
    toast({ title: lang === "ar" ? "تم الحذف" : "Deleted" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
            {lang === "ar" ? "إدارة التجارب والآراء" : "Manage Testimonials"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "ar" ? "قبول أو رفض آراء المرضى" : "Approve or reject patient reviews"}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
          </div>
        ) : (
          <div className="space-y-3">
            {(testimonials || []).map((t, i) => (
              <motion.div key={t.id} initial="hidden" animate="visible" variants={fadeIn} transition={{ delay: i * 0.05 }}>
                <div className={`rounded-2xl border bg-card p-4 ${t.approved ? "border-green-200 dark:border-green-800" : "border-border"}`}>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold shrink-0">
                      {t.patientName?.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{t.patientName}</span>
                        <div className="flex">
                          {Array.from({ length: t.rating }).map((_, j) => (
                            <Star key={j} className="w-3 h-3 text-secondary fill-secondary" />
                          ))}
                        </div>
                        <Badge variant={t.approved ? "default" : "outline"} className={`text-xs ${t.approved ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200" : ""}`}>
                          {t.approved ? (lang === "ar" ? "معتمد" : "Approved") : (lang === "ar" ? "قيد المراجعة" : "Pending Review")}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 leading-relaxed line-clamp-2">
                        "{lang === "ar" ? t.commentAr : t.commentEn}"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2 flex-1">
                      <Switch
                        checked={t.approved}
                        onCheckedChange={v => toggleApproved(t.id, v)}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <span className="text-sm text-muted-foreground">
                        {t.approved ? (lang === "ar" ? "معتمد" : "Approved") : (lang === "ar" ? "غير معتمد" : "Not approved")}
                      </span>
                    </div>
                    <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20" onClick={() => toggleApproved(t.id, true)}>
                      <CheckCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-muted-foreground hover:bg-accent" onClick={() => toggleApproved(t.id, false)}>
                      <XCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" onClick={() => handleDelete(t.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
