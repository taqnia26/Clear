import { useEffect } from "react";
import { useLocation } from "wouter";
import { motion, type Variants } from "framer-motion";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useGetDashboardStats } from "@workspace/api-client-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Star, Package } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.4, delay: i * 0.08 } }),
};

const COLORS = ["hsl(180,70%,30%)", "hsl(45,60%,60%)", "hsl(220,30%,50%)", "hsl(0,60%,60%)"];

export default function Dashboard() {
  const { lang } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const { data: stats, isLoading } = useGetDashboardStats();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
  }, [isAuthenticated, navigate]);

  const statusData = stats ? [
    { name: lang === "ar" ? "قيد الانتظار" : "Pending", value: stats.pendingAppointments || 0 },
    { name: lang === "ar" ? "مؤكد اليوم" : "Confirmed Today", value: stats.confirmedToday || 0 },
    { name: lang === "ar" ? "إجمالي" : "Total", value: stats.totalAppointments || 0 },
  ] : [];

  const kpiCards = [
    {
      label: lang === "ar" ? "إجمالي المواعيد" : "Total Appointments",
      value: stats?.totalAppointments ?? "—",
      icon: Calendar,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    {
      label: lang === "ar" ? "الأطباء" : "Doctors",
      value: stats?.totalDoctors ?? "—",
      icon: Users,
      bg: "bg-secondary/20",
      color: "text-secondary-foreground",
    },
    {
      label: lang === "ar" ? "الخدمات" : "Services",
      value: stats?.totalServices ?? "—",
      icon: Star,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    {
      label: lang === "ar" ? "الباقات" : "Packages",
      value: stats?.totalPackages ?? "—",
      icon: Package,
      bg: "bg-secondary/20",
      color: "text-secondary-foreground",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
            {lang === "ar" ? "لوحة التحكم" : "Dashboard"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {lang === "ar" ? "نظرة عامة على نشاط العيادة" : "Overview of clinic activity"}
          </p>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpiCards.map((card, i) => (
            <motion.div key={i} custom={i} initial="hidden" animate="visible" variants={fadeUp}>
              <Card className="p-5">
                {isLoading ? <Skeleton className="h-16 w-full" /> : (
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
                      <p className="text-3xl font-bold text-foreground">{card.value}</p>
                    </div>
                    <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center`}>
                      <card.icon className={`w-5 h-5 ${card.color}`} />
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="p-5">
              <h2 className="font-semibold text-foreground mb-4">
                {lang === "ar" ? "ملخص المواعيد" : "Appointments Summary"}
              </h2>
              {isLoading ? <Skeleton className="h-48" /> : (
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width="55%" height={200}>
                    <PieChart>
                      <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                        {statusData.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px" }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-col gap-3">
                    {statusData.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[i % COLORS.length] }} />
                        <span className="text-foreground/70">{item.name}</span>
                        <span className="font-bold text-foreground ms-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="p-5">
              <h2 className="font-semibold text-foreground mb-4">
                {lang === "ar" ? "إجمالي حسب النوع" : "Totals by Type"}
              </h2>
              {isLoading ? <Skeleton className="h-48" /> : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={[
                    { name: lang === "ar" ? "أطباء" : "Doctors", count: stats?.totalDoctors || 0 },
                    { name: lang === "ar" ? "خدمات" : "Services", count: stats?.totalServices || 0 },
                    { name: lang === "ar" ? "باقات" : "Packages", count: stats?.totalPackages || 0 },
                    { name: lang === "ar" ? "مواعيد" : "Appointments", count: stats?.totalAppointments || 0 },
                    { name: lang === "ar" ? "شهادات" : "Testimonials", count: stats?.totalTestimonials || 0 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ background: "var(--color-card)", border: "1px solid var(--color-border)", borderRadius: "8px" }} />
                    <Bar dataKey="count" fill="hsl(180,70%,30%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Today's highlight */}
        {stats && (
          <motion.div custom={6} initial="hidden" animate="visible" variants={fadeUp}>
            <Card className="p-5 bg-gradient-to-br from-primary/10 to-secondary/5 border-primary/20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{lang === "ar" ? "مؤكد اليوم" : "Confirmed Today"}</p>
                  <p className="text-4xl font-bold text-primary">{stats.confirmedToday}</p>
                </div>
                <div className="ms-auto text-end">
                  <p className="text-sm text-muted-foreground">{lang === "ar" ? "قيد الانتظار" : "Pending"}</p>
                  <p className="text-4xl font-bold text-foreground">{stats.pendingAppointments}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </AdminLayout>
  );
}
