import { Router, type IRouter } from "express";
import { db, doctorsTable, servicesTable, packagesTable, testimonialsTable, appointmentsTable } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

const router: IRouter = Router();

const DEMO_DOCTORS = [
  { nameAr: "د. سارة الأحمد", nameEn: "Dr. Sarah Al-Ahmad", titleAr: "استشارية تجميل الوجه", titleEn: "Facial Aesthetics Consultant", specialty: "cosmetic" as const, bioAr: "خبيرة في الحقن التجميلية والبوتوكس والفيلر مع أكثر من 12 عاماً من الخبرة في أرقى عيادات لندن وباريس.", bioEn: "Expert in cosmetic injections, Botox and fillers with over 12 years of experience in top clinics in London and Paris.", imageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80", experience: 12, active: true },
  { nameAr: "د. محمد الغامدي", nameEn: "Dr. Mohammed Al-Ghamdi", titleAr: "استشاري تقويم وزراعة الأسنان", titleEn: "Orthodontics & Implants Consultant", specialty: "dental" as const, bioAr: "متخصص في الابتسامة الهوليوودية وزراعة الأسنان الفورية، حاصل على زمالة الكلية الملكية البريطانية.", bioEn: "Specialist in Hollywood Smile and immediate dental implants, fellow of the Royal College of Surgeons.", imageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80", experience: 15, active: true },
  { nameAr: "د. نورة العمري", nameEn: "Dr. Noura Al-Omari", titleAr: "أخصائية الجلدية والليزر", titleEn: "Dermatology & Laser Specialist", specialty: "both" as const, bioAr: "خبيرة في علاجات الليزر والبشرة، تجمع بين أحدث التقنيات الأوروبية ولمسة فنية فريدة.", bioEn: "Laser and skincare expert, blending the latest European technologies with a unique artistic touch.", imageUrl: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80", experience: 9, active: true },
  { nameAr: "د. خالد الزهراني", nameEn: "Dr. Khalid Al-Zahrani", titleAr: "استشاري جراحات تجميل الأنف", titleEn: "Rhinoplasty Consultant", specialty: "cosmetic" as const, bioAr: "أحد أبرز جراحي تجميل الأنف في الخليج، تخرّج من جامعة هارفارد للطب.", bioEn: "One of the leading rhinoplasty surgeons in the Gulf, Harvard Medical School graduate.", imageUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80", experience: 18, active: true },
  { nameAr: "د. ليلى الشريف", nameEn: "Dr. Layla Al-Sharif", titleAr: "أخصائية تبييض وتجميل الأسنان", titleEn: "Cosmetic Dentistry Specialist", specialty: "dental" as const, bioAr: "متخصصة في الفينير والابتسامة المثالية، عضو الأكاديمية الأمريكية لطب الأسنان التجميلي.", bioEn: "Veneers and perfect smile specialist, member of the American Academy of Cosmetic Dentistry.", imageUrl: "https://images.unsplash.com/photo-1551601651-2a8555f1a136?w=800&q=80", experience: 10, active: true },
  { nameAr: "د. عبدالرحمن القحطاني", nameEn: "Dr. Abdulrahman Al-Qahtani", titleAr: "استشاري نحت الجسم والليزر", titleEn: "Body Sculpting Consultant", specialty: "cosmetic" as const, bioAr: "رائد في تقنيات نحت الجسم بالليزر والموجات فوق الصوتية بدون جراحة.", bioEn: "Pioneer in non-surgical laser and ultrasound body sculpting techniques.", imageUrl: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80", experience: 14, active: true },
];

const DEMO_SERVICES = [
  { nameAr: "ابتسامة هوليوود", nameEn: "Hollywood Smile", descriptionAr: "تصميم ابتسامة مثالية باستخدام الفينير الإيطالي الفاخر، نتائج فورية تدوم سنوات.", descriptionEn: "Design a perfect smile using premium Italian veneers with instant, lasting results.", category: "dental" as const, imageUrl: "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=1200&q=80", durationMinutes: 90, priceFrom: "2500", active: true },
  { nameAr: "حقن البوتوكس", nameEn: "Botox Injections", descriptionAr: "علاج التجاعيد ورفع ملامح الوجه بحقن آمنة ومعتمدة من FDA.", descriptionEn: "Treat wrinkles and lift facial features with FDA-approved safe injections.", category: "cosmetic" as const, imageUrl: "https://images.unsplash.com/photo-1614859275278-9a4b539c5edc?w=1200&q=80", durationMinutes: 30, priceFrom: "1200", active: true },
  { nameAr: "زراعة الأسنان الفورية", nameEn: "Same-Day Dental Implants", descriptionAr: "زراعة فورية بزرعات سويسرية، استبدل أسنانك المفقودة في يوم واحد.", descriptionEn: "Immediate implants with Swiss-made fixtures — replace missing teeth in a single day.", category: "dental" as const, imageUrl: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=1200&q=80", durationMinutes: 120, priceFrom: "3500", active: true },
  { nameAr: "علاج الليزر للبشرة", nameEn: "Laser Skin Treatment", descriptionAr: "تجديد البشرة وإزالة التصبغات بأحدث أجهزة الليزر الألمانية.", descriptionEn: "Skin rejuvenation and pigmentation removal with the latest German laser devices.", category: "cosmetic" as const, imageUrl: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&q=80", durationMinutes: 45, priceFrom: "900", active: true },
  { nameAr: "تجميل الأنف بدون جراحة", nameEn: "Non-Surgical Rhinoplasty", descriptionAr: "تعديل شكل الأنف بالفيلر بدون جراحة، نتائج فورية بدون فترة نقاهة.", descriptionEn: "Reshape your nose with fillers without surgery — instant results, no downtime.", category: "cosmetic" as const, imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80", durationMinutes: 60, priceFrom: "1800", active: true },
  { nameAr: "تبييض الأسنان بالليزر", nameEn: "Laser Teeth Whitening", descriptionAr: "بياض ناصع بدرجات في جلسة واحدة باستخدام تقنية ZOOM الأمريكية.", descriptionEn: "Brilliant whiteness shades brighter in one session using American ZOOM technology.", category: "dental" as const, imageUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?w=1200&q=80", durationMinutes: 60, priceFrom: "800", active: true },
  { nameAr: "نحت الجسم بالكرايو", nameEn: "Cryolipolysis Body Sculpting", descriptionAr: "تجميد الدهون العنيدة وإذابتها بشكل دائم بدون جراحة أو ألم.", descriptionEn: "Freeze and permanently eliminate stubborn fat without surgery or pain.", category: "cosmetic" as const, imageUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80", durationMinutes: 75, priceFrom: "1500", active: true },
  { nameAr: "تقويم الأسنان الشفاف", nameEn: "Invisalign Clear Aligners", descriptionAr: "تقويم غير مرئي مريح وفعال، صمم خصيصاً لابتسامتك المثالية.", descriptionEn: "Comfortable invisible aligners, custom-designed for your perfect smile.", category: "dental" as const, imageUrl: "https://images.unsplash.com/photo-1581585504064-89c5e62a3da6?w=1200&q=80", durationMinutes: 45, priceFrom: "4500", active: true },
];

const DEMO_PACKAGES = [
  { nameAr: "باقة العروس الذهبية", nameEn: "Golden Bride Package", descriptionAr: "تشمل ابتسامة هوليوود + حقن البوتوكس + جلسة ليزر لبشرة مشرقة في يومك المميز.", descriptionEn: "Includes Hollywood Smile + Botox + Laser session for radiant skin on your special day.", originalPrice: "8500", discountedPrice: "5900", discountPercent: "30", imageUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80", validUntil: "2026-12-31", featured: true, active: true },
  { nameAr: "باقة الإطلالة الفاخرة", nameEn: "Luxe Look Package", descriptionAr: "حقن فيلر + بوتوكس + تنظيف بشرة عميق بأحدث التقنيات.", descriptionEn: "Filler + Botox + Deep facial cleansing with the latest technology.", originalPrice: "4200", discountedPrice: "2900", discountPercent: "31", imageUrl: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80", validUntil: "2026-09-30", featured: true, active: true },
  { nameAr: "باقة الابتسامة الكاملة", nameEn: "Complete Smile Package", descriptionAr: "تنظيف + تبييض ليزر + 4 فينير أمامية لإطلالة هوليوودية.", descriptionEn: "Cleaning + Laser whitening + 4 front veneers for a Hollywood look.", originalPrice: "6500", discountedPrice: "4500", discountPercent: "31", imageUrl: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1200&q=80", validUntil: "2026-10-31", featured: true, active: true },
  { nameAr: "باقة الشباب الدائم", nameEn: "Eternal Youth Package", descriptionAr: "بوتوكس كامل + ميزوثيرابي + جلستين ليزر تجديد بشرة.", descriptionEn: "Full Botox + Mesotherapy + 2 laser rejuvenation sessions.", originalPrice: "5800", discountedPrice: "3900", discountPercent: "33", imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&q=80", validUntil: "2026-11-30", featured: true, active: true },
];

const DEMO_TESTIMONIALS = [
  { patientName: "أمل العتيبي", rating: 5, commentAr: "تجربتي في عيادة كلير كانت رائعة! د. سارة محترفة والنتائج فاقت توقعاتي. الفريق كله ودود ومتفهم.", commentEn: "My experience at Clear Clinic was amazing! Dr. Sarah is professional and the results exceeded my expectations. The whole team is friendly and understanding.", approved: true },
  { patientName: "محمد الشهري", rating: 5, commentAr: "أفضل عيادة أسنان جربتها على الإطلاق. زراعة الأسنان كانت بدون أي ألم والنتيجة طبيعية 100%.", commentEn: "The best dental clinic I've ever tried. The dental implant was painless and the result is 100% natural.", approved: true },
  { patientName: "ريم الفهد", rating: 5, commentAr: "حصلت على ابتسامة أحلامي في يومين فقط! شكراً للدكتورة ليلى وفريقها المميز.", commentEn: "Got the smile of my dreams in just 2 days! Thank you to Dr. Layla and her amazing team.", approved: true },
  { patientName: "سلطان القحطاني", rating: 5, commentAr: "مكان فاخر، خدمة راقية، وأطباء على أعلى مستوى. أنصح كل من يبحث عن الجودة.", commentEn: "Luxurious place, premium service, and top-tier doctors. I recommend it to anyone seeking quality.", approved: true },
  { patientName: "نوف الدوسري", rating: 4, commentAr: "نتيجة الفيلر كانت طبيعية جداً وملامحي صارت أحلى. التزام بالمواعيد ونظافة عالية.", commentEn: "The filler result was very natural and my features look prettier. Punctual appointments and high cleanliness.", approved: true },
  { patientName: "فيصل العنزي", rating: 5, commentAr: "د. خالد فنان! عملية تجميل الأنف كانت ناجحة 100% والنتيجة طبيعية تماماً.", commentEn: "Dr. Khalid is an artist! The rhinoplasty was 100% successful and the result is completely natural.", approved: true },
];

function futureDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}

// POST /admin/seed - wipes & re-seeds the database (superadmin only)
router.post("/admin/seed", requireAdmin("superadmin"), async (req, res): Promise<void> => {
  try {
    const result = await db.transaction(async (tx) => {
      // Wipe (preserve admins)
      await tx.delete(appointmentsTable);
      await tx.delete(testimonialsTable);
      await tx.delete(packagesTable);
      await tx.delete(servicesTable);
      await tx.delete(doctorsTable);

      const insertedDoctors = await tx.insert(doctorsTable).values(DEMO_DOCTORS).returning();
      const insertedServices = await tx.insert(servicesTable).values(DEMO_SERVICES).returning();
      const insertedPackages = await tx.insert(packagesTable).values(DEMO_PACKAGES).returning();
      const insertedTestimonials = await tx.insert(testimonialsTable).values(
        DEMO_TESTIMONIALS.map((t, i) => ({ ...t, serviceId: insertedServices[i % insertedServices.length]?.id }))
      ).returning();

      const demoAppointments = [
      { patientNameAr: "هند المطيري", patientNameEn: "Hind Al-Mutairi", phone: "+966501112233", email: "hind@example.com", appointmentDate: futureDate(1), appointmentTime: "10:00", status: "confirmed" as const },
      { patientNameAr: "بدر الحربي", patientNameEn: "Badr Al-Harbi", phone: "+966502223344", email: "badr@example.com", appointmentDate: futureDate(2), appointmentTime: "14:00", status: "pending" as const },
      { patientNameAr: "روان السبيعي", patientNameEn: "Rawan Al-Subaie", phone: "+966503334455", appointmentDate: futureDate(3), appointmentTime: "11:00", status: "confirmed" as const },
      { patientNameAr: "خالد الجهني", patientNameEn: "Khalid Al-Juhani", phone: "+966504445566", appointmentDate: futureDate(5), appointmentTime: "16:00", status: "pending" as const },
      { patientNameAr: "دانة الشمري", patientNameEn: "Dana Al-Shammari", phone: "+966505556677", email: "dana@example.com", appointmentDate: futureDate(0), appointmentTime: "09:00", status: "completed" as const },
      { patientNameAr: "سعد الدوسري", patientNameEn: "Saad Al-Dosari", phone: "+966506667788", appointmentDate: futureDate(-1), appointmentTime: "12:00", status: "completed" as const },
      { patientNameAr: "لمى البلوي", patientNameEn: "Lama Al-Balwi", phone: "+966507778899", appointmentDate: futureDate(7), appointmentTime: "13:00", status: "pending" as const },
      { patientNameAr: "تركي القرني", patientNameEn: "Turki Al-Qarni", phone: "+966508889900", appointmentDate: futureDate(4), appointmentTime: "15:00", status: "cancelled" as const },
    ];

      const appointmentRows = demoAppointments.map((a, i) => {
        const svc = insertedServices[i % insertedServices.length]!;
        const doc = insertedDoctors[i % insertedDoctors.length]!;
        return { ...a, serviceId: svc.id, serviceName: svc.nameAr, doctorId: doc.id, doctorName: doc.nameAr };
      });

      const insertedAppointments = await tx.insert(appointmentsTable).values(appointmentRows).returning();

      return {
        doctors: insertedDoctors.length,
        services: insertedServices.length,
        packages: insertedPackages.length,
        testimonials: insertedTestimonials.length,
        appointments: insertedAppointments.length,
      };
    });

    req.log.info({ admin: req.admin?.username }, "Database seeded with demo data");
    res.json({ ok: true, counts: result });
  } catch (err) {
    req.log.error({ err }, "Seed failed");
    res.status(500).json({ error: "Seed failed", message: err instanceof Error ? err.message : "Unknown error" });
  }
});

export default router;
