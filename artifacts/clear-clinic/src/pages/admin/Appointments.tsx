import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useListAppointments } from "@workspace/api-client-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Calendar, Phone, Search, RefreshCw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

type Status = "pending" | "confirmed" | "cancelled" | "completed";

const statusConfig: Record<Status, { labelAr: string; labelEn: string; color: string }> = {
  pending: { labelAr: "قيد الانتظار", labelEn: "Pending", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" },
  confirmed: { labelAr: "مؤكد", labelEn: "Confirmed", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" },
  completed: { labelAr: "مكتمل", labelEn: "Completed", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" },
  cancelled: { labelAr: "ملغى", labelEn: "Cancelled", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" },
};

const rowAnim: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.04 } }),
};

export default function Appointments() {
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const { data: appointments, isLoading } = useListAppointments(
    statusFilter !== "all" ? { status: statusFilter } : {}
  );

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated, navigate]);

  const filtered = (appointments || []).filter(a => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      a.patientNameAr?.toLowerCase().includes(q) ||
      a.patientNameEn?.toLowerCase().includes(q) ||
      a.phone?.includes(q)
    );
  });

  const updateStatus = async (id: number, status: Status) => {
    setUpdatingId(id);
    try {
      await fetch(`${BASE}/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      await queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
    } finally {
      setUpdatingId(null);
    }
  };

  const statuses: (Status | "all")[] = ["all", "pending", "confirmed", "completed", "cancelled"];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
              {lang === "ar" ? "المواعيد" : "Appointments"}
            </h1>
            <p className="text-muted-foreground text-sm">{lang === "ar" ? `${filtered.length} موعد` : `${filtered.length} appointments`}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => queryClient.invalidateQueries({ queryKey: ["/api/appointments"] })}>
            <RefreshCw className="w-4 h-4 me-2" />{lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              className="ps-9"
              placeholder={lang === "ar" ? "بحث بالاسم أو الهاتف..." : "Search by name or phone..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={v => setStatusFilter(v as Status | "all")}>
            <SelectTrigger className="w-full sm:w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              {statuses.map(s => (
                <SelectItem key={s} value={s}>
                  {s === "all" ? (lang === "ar" ? "جميع الحالات" : "All Statuses") : (lang === "ar" ? statusConfig[s]?.labelAr : statusConfig[s]?.labelEn)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            {lang === "ar" ? "لا توجد مواعيد" : "No appointments found"}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((appointment, i) => {
              const status = appointment.status as Status;
              const cfg = statusConfig[status];
              return (
                <motion.div
                  key={appointment.id}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={rowAnim}
                  className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                      {(lang === "ar" ? appointment.patientNameAr : appointment.patientNameEn)?.charAt(0) || "?"}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">
                        {lang === "ar" ? appointment.patientNameAr : appointment.patientNameEn}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                        {appointment.phone && (
                          <span className="flex items-center gap-1" dir="ltr"><Phone className="w-3 h-3" />{appointment.phone}</span>
                        )}
                        {appointment.appointmentDate && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{appointment.appointmentDate}
                            {appointment.appointmentTime && ` — ${appointment.appointmentTime}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg?.color}`}>
                      {lang === "ar" ? cfg?.labelAr : cfg?.labelEn}
                    </span>
                    <Select
                      value={status}
                      onValueChange={v => updateStatus(appointment.id, v as Status)}
                      disabled={updatingId === appointment.id}
                    >
                      <SelectTrigger className="h-8 text-xs w-36"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {(["pending", "confirmed", "completed", "cancelled"] as Status[]).map(s => (
                          <SelectItem key={s} value={s}>
                            {lang === "ar" ? statusConfig[s].labelAr : statusConfig[s].labelEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
