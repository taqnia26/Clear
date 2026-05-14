import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useListServices, useListDoctors } from "@workspace/api-client-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, CalendarDays, Clock } from "lucide-react";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

export default function Book() {
  const { t, lang } = useLanguage();
  const { toast } = useToast();
  const { data: services } = useListServices({ active: true });
  const { data: doctors } = useListDoctors({ active: true });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    patientNameAr: "",
    patientNameEn: "",
    phone: "",
    email: "",
    serviceId: "",
    doctorId: "",
    appointmentDate: "",
    appointmentTime: "",
    notesAr: "",
    notesEn: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientNameAr && !form.patientNameEn) {
      toast({ title: lang === "ar" ? "يرجى إدخال الاسم" : "Please enter a name", variant: "destructive" });
      return;
    }
    if (!form.phone) {
      toast({ title: lang === "ar" ? "يرجى إدخال رقم الهاتف" : "Please enter a phone number", variant: "destructive" });
      return;
    }
    if (!form.appointmentDate || !form.appointmentTime) {
      toast({ title: lang === "ar" ? "يرجى اختيار التاريخ والوقت" : "Please select date and time", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        patientNameAr: form.patientNameAr || form.patientNameEn,
        patientNameEn: form.patientNameEn || form.patientNameAr,
        phone: form.phone,
        email: form.email || undefined,
        serviceId: form.serviceId ? parseInt(form.serviceId) : undefined,
        doctorId: form.doctorId ? parseInt(form.doctorId) : undefined,
        appointmentDate: form.appointmentDate,
        appointmentTime: form.appointmentTime,
        notesAr: form.notesAr || undefined,
        notesEn: form.notesEn || undefined,
      };
      const res = await fetch(`${BASE}/api/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitted(true);
    } catch {
      toast({ title: t("bookingError"), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const times = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md px-4">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-3" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
            {t("bookingSuccess")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {lang === "ar" ? "سنتواصل معك قريباً لتأكيد الموعد." : "We will contact you soon to confirm your appointment."}
          </p>
          <Button onClick={() => setSubmitted(false)}>
            {lang === "ar" ? "حجز موعد آخر" : "Book Another Appointment"}
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} className="text-center mb-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-3">
            {lang === "ar" ? "احجز موعدك" : "Book Your Appointment"}
          </Badge>
          <h1 className="text-4xl font-bold mb-3" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
            {t("bookAppointment")}
          </h1>
          <p className="text-muted-foreground">
            {lang === "ar" ? "أكمل البيانات التالية وسنتواصل معك لتأكيد الموعد" : "Fill in the details and we'll contact you to confirm"}
          </p>
        </motion.div>

        <motion.form
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm space-y-5"
        >
          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nameAr">{lang === "ar" ? "الاسم بالعربية *" : "Name in Arabic *"}</Label>
              <Input id="nameAr" placeholder="مثال: محمد علي" value={form.patientNameAr} onChange={e => setForm(f => ({ ...f, patientNameAr: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nameEn">{lang === "ar" ? "الاسم بالإنجليزية" : "Name in English"}</Label>
              <Input id="nameEn" placeholder="e.g. Mohammed Ali" value={form.patientNameEn} onChange={e => setForm(f => ({ ...f, patientNameEn: e.target.value }))} />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("phone")} *</Label>
              <Input id="phone" type="tel" dir="ltr" placeholder="+966 5X XXX XXXX" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email")}</Label>
              <Input id="email" type="email" dir="ltr" placeholder="example@email.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>{t("selectService")}</Label>
              <Select value={form.serviceId} onValueChange={v => setForm(f => ({ ...f, serviceId: v }))}>
                <SelectTrigger><SelectValue placeholder={t("selectService")} /></SelectTrigger>
                <SelectContent>
                  {(services || []).map(s => (
                    <SelectItem key={s.id} value={String(s.id)}>{lang === "ar" ? s.nameAr : s.nameEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>{t("selectDoctor")}</Label>
              <Select value={form.doctorId} onValueChange={v => setForm(f => ({ ...f, doctorId: v }))}>
                <SelectTrigger><SelectValue placeholder={t("selectDoctor")} /></SelectTrigger>
                <SelectContent>
                  {(doctors || []).map(d => (
                    <SelectItem key={d.id} value={String(d.id)}>{lang === "ar" ? d.nameAr : d.nameEn}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="date">
                <CalendarDays className="w-3.5 h-3.5 inline me-1" />
                {t("date")} *
              </Label>
              <Input id="date" type="date" min={new Date().toISOString().split("T")[0]} value={form.appointmentDate} onChange={e => setForm(f => ({ ...f, appointmentDate: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>
                <Clock className="w-3.5 h-3.5 inline me-1" />
                {t("time")} *
              </Label>
              <Select value={form.appointmentTime} onValueChange={v => setForm(f => ({ ...f, appointmentTime: v }))}>
                <SelectTrigger><SelectValue placeholder={t("time")} /></SelectTrigger>
                <SelectContent>
                  {times.map(time => <SelectItem key={time} value={time}>{time}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-1.5">
            <Label htmlFor="notes">{t("notes")}</Label>
            <Textarea
              id="notes"
              rows={3}
              placeholder={lang === "ar" ? "أي ملاحظات أو معلومات إضافية..." : "Any additional notes or information..."}
              value={lang === "ar" ? form.notesAr : form.notesEn}
              onChange={e => setForm(f => lang === "ar" ? { ...f, notesAr: e.target.value } : { ...f, notesEn: e.target.value })}
            />
          </motion.div>

          <motion.div variants={fadeUp}>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (lang === "ar" ? "جاري الإرسال..." : "Submitting...") : t("submitBooking")}
            </Button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
