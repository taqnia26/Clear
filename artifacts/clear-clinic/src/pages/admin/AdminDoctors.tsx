import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useListDoctors, type Doctor } from "@workspace/api-client-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Stethoscope } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeCard: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.05 } }),
};

interface DoctorForm {
  nameAr: string; nameEn: string;
  specialty: "cosmetic" | "dental" | "both";
  bioAr: string; bioEn: string;
  imageUrl: string; experience: string;
  active: boolean;
}

const empty: DoctorForm = {
  nameAr: "", nameEn: "", specialty: "cosmetic",
  bioAr: "", bioEn: "", imageUrl: "", experience: "", active: true,
};

export default function AdminDoctors() {
  const { lang } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: doctors, isLoading } = useListDoctors({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<DoctorForm>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
    else if (user?.role === "receptionist") navigate("/admin/appointments");
  }, [isAuthenticated, user, navigate]);

  const openCreate = () => { setEditId(null); setForm(empty); setDialogOpen(true); };

  const openEdit = (d: Doctor) => {
    setEditId(d.id);
    setForm({
      nameAr: d.nameAr,
      nameEn: d.nameEn,
      specialty: d.specialty as "cosmetic" | "dental" | "both",
      bioAr: d.bioAr || "",
      bioEn: d.bioEn || "",
      imageUrl: d.imageUrl || "",
      experience: String(d.experience || ""),
      active: d.active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nameAr || !form.nameEn) {
      toast({ title: lang === "ar" ? "الاسم مطلوب" : "Name is required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nameAr: form.nameAr, nameEn: form.nameEn,
        specialty: form.specialty,
        bioAr: form.bioAr || undefined, bioEn: form.bioEn || undefined,
        imageUrl: form.imageUrl || undefined,
        experience: form.experience ? parseInt(form.experience) : undefined,
        active: form.active,
      };
      const url = editId ? `${BASE}/api/doctors/${editId}` : `${BASE}/api/doctors`;
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Failed");
      await queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      setDialogOpen(false);
      toast({ title: lang === "ar" ? "تم الحفظ بنجاح" : "Saved successfully" });
    } catch {
      toast({ title: lang === "ar" ? "حدث خطأ" : "An error occurred", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(lang === "ar" ? "هل أنت متأكد من الحذف؟" : "Are you sure you want to delete?")) return;
    await fetch(`${BASE}/api/doctors/${id}`, { method: "DELETE", credentials: "include" });
    await queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
    toast({ title: lang === "ar" ? "تم الحذف" : "Deleted" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: lang === "ar" ? "Tajawal, Readex Pro, sans-serif" : "Cormorant Garamond, Playfair Display, serif" }}>
            {lang === "ar" ? "إدارة الأطباء" : "Manage Doctors"}
          </h1>
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4 me-2" />{lang === "ar" ? "إضافة طبيب" : "Add Doctor"}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(doctors || []).map((doctor, i) => (
              <motion.div key={doctor.id} custom={i} initial="hidden" animate="visible" variants={fadeCard}>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                      {doctor.imageUrl
                        ? <img src={doctor.imageUrl} alt="" className="w-full h-full object-cover" />
                        : <Stethoscope className="w-6 h-6 text-primary/60" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{lang === "ar" ? doctor.nameAr : doctor.nameEn}</div>
                      <div className="text-xs text-primary mt-0.5 capitalize">{doctor.specialty}</div>
                      {doctor.experience && <div className="text-xs text-muted-foreground mt-0.5">{doctor.experience} {lang === "ar" ? "سنوات خبرة" : "yrs exp"}</div>}
                      <div className={`text-xs mt-1 font-medium ${doctor.active ? "text-green-600" : "text-muted-foreground"}`}>
                        {doctor.active ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "غير نشط" : "Inactive")}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(doctor)}>
                      <Pencil className="w-3.5 h-3.5 me-1.5" />{lang === "ar" ? "تعديل" : "Edit"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleDelete(doctor.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? (lang === "ar" ? "تعديل الطبيب" : "Edit Doctor") : (lang === "ar" ? "إضافة طبيب جديد" : "Add New Doctor")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>{lang === "ar" ? "الاسم عربي *" : "Name (Ar) *"}</Label><Input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>{lang === "ar" ? "الاسم إنجليزي *" : "Name (En) *"}</Label><Input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5">
              <Label>{lang === "ar" ? "التخصص" : "Specialty"}</Label>
              <Select value={form.specialty} onValueChange={v => setForm(f => ({ ...f, specialty: v as "cosmetic" | "dental" | "both" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cosmetic">{lang === "ar" ? "تجميل" : "Cosmetic"}</SelectItem>
                  <SelectItem value="dental">{lang === "ar" ? "أسنان" : "Dental"}</SelectItem>
                  <SelectItem value="both">{lang === "ar" ? "كلاهما" : "Both"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>{lang === "ar" ? "نبذة عربية" : "Bio (Ar)"}</Label><Textarea rows={2} value={form.bioAr} onChange={e => setForm(f => ({ ...f, bioAr: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>{lang === "ar" ? "نبذة إنجليزية" : "Bio (En)"}</Label><Textarea rows={2} value={form.bioEn} onChange={e => setForm(f => ({ ...f, bioEn: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>{lang === "ar" ? "رابط الصورة" : "Image URL"}</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." /></div>
              <div className="space-y-1.5"><Label>{lang === "ar" ? "سنوات الخبرة" : "Years of Experience"}</Label><Input type="number" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} />
              <Label>{lang === "ar" ? "نشط" : "Active"}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>{lang === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? "..." : (lang === "ar" ? "حفظ" : "Save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
