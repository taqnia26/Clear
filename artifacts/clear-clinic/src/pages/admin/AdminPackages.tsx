import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { motion, type Variants } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useListPackages, type Package } from "@workspace/api-client-react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

const fadeCard: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.3, delay: i * 0.05 } }),
};

interface PkgForm {
  nameAr: string; nameEn: string;
  descriptionAr: string; descriptionEn: string;
  originalPrice: string; discountedPrice: string; discountPercent: string;
  validUntil: string; imageUrl: string;
  featured: boolean; active: boolean;
}

const empty: PkgForm = {
  nameAr: "", nameEn: "", descriptionAr: "", descriptionEn: "",
  originalPrice: "", discountedPrice: "", discountPercent: "",
  validUntil: "", imageUrl: "", featured: false, active: true,
};

export default function AdminPackages() {
  const { lang } = useLanguage();
  const { isAuthenticated, user } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: packages, isLoading } = useListPackages({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<PkgForm>(empty);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin/login");
    else if (user?.role === "receptionist") navigate("/admin/appointments");
  }, [isAuthenticated, user, navigate]);

  const openEdit = (p: Package) => {
    setEditId(p.id);
    setForm({
      nameAr: p.nameAr, nameEn: p.nameEn,
      descriptionAr: p.descriptionAr || "", descriptionEn: p.descriptionEn || "",
      originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
      discountedPrice: p.discountedPrice != null ? String(p.discountedPrice) : "",
      discountPercent: p.discountPercent != null ? String(p.discountPercent) : "",
      validUntil: p.validUntil || "", imageUrl: p.imageUrl || "",
      featured: p.featured ?? false, active: p.active,
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
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        discountedPrice: form.discountedPrice ? parseFloat(form.discountedPrice) : undefined,
        discountPercent: form.discountPercent ? parseFloat(form.discountPercent) : undefined,
        validUntil: form.validUntil || undefined,
        imageUrl: form.imageUrl || undefined,
        featured: form.featured, active: form.active,
      };
      const url = editId ? `${BASE}/api/packages/${editId}` : `${BASE}/api/packages`;
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(payload) });
      if (!res.ok) throw new Error();
      await queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
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
    await fetch(`${BASE}/api/packages/${id}`, { method: "DELETE", credentials: "include" });
    await queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
    toast({ title: lang === "ar" ? "تم الحذف" : "Deleted" });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: lang === "ar" ? "Cairo, sans-serif" : "Playfair Display, serif" }}>
            {lang === "ar" ? "إدارة الباقات" : "Manage Packages"}
          </h1>
          <Button onClick={() => { setEditId(null); setForm(empty); setDialogOpen(true); }} size="sm">
            <Plus className="w-4 h-4 me-2" />{lang === "ar" ? "إضافة باقة" : "Add Package"}
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-2xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(packages || []).map((pkg, i) => (
              <motion.div key={pkg.id} custom={i} initial="hidden" animate="visible" variants={fadeCard}>
                <div className={`rounded-2xl border-2 ${pkg.featured ? "border-secondary/50" : "border-border"} bg-card p-4`}>
                  <div className="flex items-start gap-3">
                    {pkg.imageUrl ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        <img src={pkg.imageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0 text-xl">✨</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold truncate">{lang === "ar" ? pkg.nameAr : pkg.nameEn}</span>
                        {pkg.featured && <Badge className="bg-secondary text-secondary-foreground text-xs">{lang === "ar" ? "مميز" : "Featured"}</Badge>}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        {pkg.discountPercent != null && (
                          <span className="flex items-center gap-0.5 text-secondary-foreground bg-secondary/20 px-2 py-0.5 rounded-full font-medium">
                            <Tag className="w-3 h-3" />{pkg.discountPercent}%
                          </span>
                        )}
                        {pkg.discountedPrice != null && <span className="text-primary font-bold">{pkg.discountedPrice} {lang === "ar" ? "ر.س" : "SAR"}</span>}
                        {pkg.originalPrice != null && <span className="line-through text-muted-foreground">{pkg.originalPrice}</span>}
                      </div>
                      {pkg.validUntil && <div className="text-xs text-muted-foreground mt-0.5">{lang === "ar" ? "صالح حتى" : "Valid until"}: {pkg.validUntil}</div>}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                    <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(pkg)}>
                      <Pencil className="w-3.5 h-3.5 me-1.5" />{lang === "ar" ? "تعديل" : "Edit"}
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => handleDelete(pkg.id)}>
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
            <DialogTitle>{editId ? (lang === "ar" ? "تعديل الباقة" : "Edit Package") : (lang === "ar" ? "إضافة باقة" : "Add Package")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>{lang === "ar" ? "الاسم عربي *" : "Name (Ar) *"}</Label><Input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>{lang === "ar" ? "الاسم إنجليزي *" : "Name (En) *"}</Label><Input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} /></div>
            </div>
            <div className="space-y-1.5"><Label>{lang === "ar" ? "الوصف عربي" : "Description (Ar)"}</Label><Textarea rows={2} value={form.descriptionAr} onChange={e => setForm(f => ({ ...f, descriptionAr: e.target.value }))} /></div>
            <div className="space-y-1.5"><Label>{lang === "ar" ? "الوصف إنجليزي" : "Description (En)"}</Label><Textarea rows={2} value={form.descriptionEn} onChange={e => setForm(f => ({ ...f, descriptionEn: e.target.value }))} /></div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5"><Label>{lang === "ar" ? "السعر الأصلي" : "Original"}</Label><Input value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>{lang === "ar" ? "السعر المخفض" : "Discounted"}</Label><Input value={form.discountedPrice} onChange={e => setForm(f => ({ ...f, discountedPrice: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>{lang === "ar" ? "الخصم %" : "Discount %"}</Label><Input value={form.discountPercent} onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5"><Label>{lang === "ar" ? "صالح حتى" : "Valid Until"}</Label><Input type="date" value={form.validUntil} onChange={e => setForm(f => ({ ...f, validUntil: e.target.value }))} /></div>
              <div className="space-y-1.5"><Label>{lang === "ar" ? "رابط الصورة" : "Image URL"}</Label><Input value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." /></div>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2"><Switch checked={form.featured} onCheckedChange={v => setForm(f => ({ ...f, featured: v }))} /><Label>{lang === "ar" ? "مميز" : "Featured"}</Label></div>
              <div className="flex items-center gap-2"><Switch checked={form.active} onCheckedChange={v => setForm(f => ({ ...f, active: v }))} /><Label>{lang === "ar" ? "نشط" : "Active"}</Label></div>
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
