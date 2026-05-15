import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useListServices, type Service } from "@workspace/api-client-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeCard: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.05 } }),
};

interface ServiceForm {
  nameAr: string; nameEn: string;
  descriptionAr: string; descriptionEn: string;
  category: "cosmetic" | "dental" | "both";
  priceFrom: string; imageUrl: string; active: boolean;
}

const empty: ServiceForm = {
  nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "",
  category: "cosmetic", priceFrom: "", imageUrl: "", active: true,
};

export default function AdminServices() {
  const { lang } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: services, isLoading } = useListServices({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<ServiceForm>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
    else if (user?.role === "receptionist") navigate("/admin/appointments");
  }, [isAuthenticated, user, navigate]);

  const catLabel = (cat: string) => {
    if (cat === "cosmetic") return lang === "ar" ? "تجميل" : "Cosmetic";
    if (cat === "dental") return lang === "ar" ? "أسنان" : "Dental";
    return lang === "ar" ? "كلاهما" : "Both";
  };

  const openCreate = () => { setEditId(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (s: Service) => {
    setEditId(s.id);
    setForm({
      nameAr: s.nameAr, nameEn: s.nameEn,
      descriptionAr: s.descriptionAr || "", descriptionEn: s.descriptionEn || "",
      category: s.category as "cosmetic" | "dental" | "both",
      priceFrom: s.priceFrom != null ? String(s.priceFrom) : "",
      imageUrl: s.imageUrl || "",
      active: s.active,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.nameAr || !form.nameEn) {
      toast({ title: lang === "ar" ? "الاسم مطلوب" : "Name required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        nameAr: form.nameAr, nameEn: form.nameEn,
        descriptionAr: form.descriptionAr || undefined, descriptionEn: form.descriptionEn || undefined,
        category: form.category,
        priceFrom: form.priceFrom ? parseFloat(form.priceFrom) : undefined,
        imageUrl: form.imageUrl || undefined,
        active: form.active,
      };
      const url = editId ? `${BASE}/api/services/${editId}` : `${BASE}/api/services`;
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      await queryClient.invalidateQueries({ queryKey: ["/api/services"] });
      setDialogOpen(false);
      toast({ title: lang === "ar" ? "تم الحفظ" : "Saved" });
    } catch {
      toast({ title: lang === "ar" ? "حدث خطأ" : "Error", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(lang === "ar" ? "تأكيد الحذف؟" : "Confirm delete?")) return;
    await fetch(`${BASE}/api/services/${id}`, { method: "DELETE", credentials: "include" });
    await queryClient.invalidateQueries({ queryKey: ["/api/services"] });
    toast({ title: lang === "ar" ? "تم الحذف" : "Deleted" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Cairo, sans-serif" }}>
            {lang === "ar" ? "إدارة الخدمات" : "Manage Services"}
          </h1>
          <Button onClick={openCreate} size="sm">
            <Plus className="w-4 h-4 me-2" />{lang === "ar" ? "إضافة خدمة" : "Add Service"}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(services || []).map((s, i) => (
              <motion.div key={s.id} custom={i} initial="hidden" animate="visible" variants={fadeCard}>
                <div className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-start gap-3">
                    {s.imageUrl ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        <img src={s.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-xl">✨</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{lang === "ar" ? s.nameAr : s.nameEn}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{catLabel(s.category)}</Badge>
                        {s.priceFrom != null && <span className="text-xs text-primary font-medium">{s.priceFrom} {lang === "ar" ? "ر.س" : "SAR"}</span>}
                        <span className={`text-xs font-medium ${s.active ? "text-green-600" : "text-muted-foreground"}`}>
                          {s.active ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "غير نشط" : "Inactive")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(s)}>
                      <Pencil className="w-3.5 h-3.5 me-1.5" />{lang === "ar" ? "تعديل" : "Edit"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleDelete(s.id)}>
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
            <DialogTitle>{editId ? (lang === "ar" ? "تعديل الخدمة" : "Edit Service") : (lang === "ar" ? "إضافة خدمة" : "Add Service")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>{lang === "ar" ? "الاسم عربي *" : "Name (Ar) *"}</Label><Input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>{lang === "ar" ? "الاسم إنجليزي *" : "Name (En) *"}</Label><Input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5"><Label>{lang === "ar" ? "الوصف عربي" : "Description (Ar)"}</Label><Textarea rows={2} value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>{lang === "ar" ? "الوصف إنجليزي" : "Description (En)"}</Label><Textarea rows={2} value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{lang === "ar" ? "الفئة" : "Category"}</Label>
                <Select value={form.category} onValueChange={v => setForm(f => ({ ...f, category: v as "cosmetic" | "dental" | "both" }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cosmetic">{lang === "ar" ? "تجميل" : "Cosmetic"}</SelectItem>
                    <SelectItem value="dental">{lang === "ar" ? "أسنان" : "Dental"}</SelectItem>
                    <SelectItem value="both">{lang === "ar" ? "كلاهما" : "Both"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>{lang === "ar" ? "السعر يبدأ من" : "Price From"}</Label><Input value={form.priceFrom} onChange={e => setForm(f => ({ ...f, priceFrom: e.target.value }))} placeholder="e.g. 500" /></div>
            </div>
            <div className="space-y-1.5"><Label>{lang === "ar" ? "رابط الصورة" : "Image URL"}</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." /></div>
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
