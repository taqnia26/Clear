import { Router, type IRouter } from "express";
import { db, appointmentsTable, doctorsTable, servicesTable, packagesTable, testimonialsTable } from "@workspace/db";
import { eq, count, sql } from "drizzle-orm";
import {
  GetDashboardStatsResponse,
  GetRecentAppointmentsQueryParams,
  GetRecentAppointmentsResponse,
  GetAppointmentsByStatusResponse,
  GetPopularServicesQueryParams,
  GetPopularServicesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /dashboard/stats
router.get("/dashboard/stats", async (_req, res): Promise<void> => {
  const [totalAppointments] = await db.select({ count: count() }).from(appointmentsTable);
  const [pendingAppointments] = await db.select({ count: count() }).from(appointmentsTable).where(eq(appointmentsTable.status, "pending"));

  const today = new Date().toISOString().split("T")[0];
  const [confirmedToday] = await db.select({ count: count() }).from(appointmentsTable)
    .where(sql`${appointmentsTable.appointmentDate} = ${today} AND ${appointmentsTable.status} = 'confirmed'`);

  const [totalDoctors] = await db.select({ count: count() }).from(doctorsTable);
  const [totalServices] = await db.select({ count: count() }).from(servicesTable);
  const [totalPackages] = await db.select({ count: count() }).from(packagesTable);
  const [totalTestimonials] = await db.select({ count: count() }).from(testimonialsTable);

  res.json(GetDashboardStatsResponse.parse({
    totalAppointments: Number(totalAppointments?.count ?? 0),
    pendingAppointments: Number(pendingAppointments?.count ?? 0),
    confirmedToday: Number(confirmedToday?.count ?? 0),
    totalDoctors: Number(totalDoctors?.count ?? 0),
    totalServices: Number(totalServices?.count ?? 0),
    totalPackages: Number(totalPackages?.count ?? 0),
    totalTestimonials: Number(totalTestimonials?.count ?? 0),
  }));
});

// GET /dashboard/appointments/recent
router.get("/dashboard/appointments/recent", async (req, res): Promise<void> => {
  const params = GetRecentAppointmentsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const limit = params.data.limit ?? 10;
  const appointments = await db.select().from(appointmentsTable)
    .orderBy(sql`${appointmentsTable.createdAt} DESC`)
    .limit(limit);

  res.json(GetRecentAppointmentsResponse.parse(appointments));
});

// GET /dashboard/appointments/by-status
router.get("/dashboard/appointments/by-status", async (_req, res): Promise<void> => {
  const statuses = ["pending", "confirmed", "cancelled", "completed"] as const;

  const counts = await Promise.all(
    statuses.map(async (status) => {
      const [result] = await db.select({ count: count() }).from(appointmentsTable).where(eq(appointmentsTable.status, status));
      return { status, count: Number(result?.count ?? 0) };
    })
  );

  res.json(GetAppointmentsByStatusResponse.parse(counts));
});

// GET /dashboard/services/popular
router.get("/dashboard/services/popular", async (req, res): Promise<void> => {
  const params = GetPopularServicesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const limit = params.data.limit ?? 5;

  const popular = await db
    .select({
      serviceId: servicesTable.id,
      nameAr: servicesTable.nameAr,
      nameEn: servicesTable.nameEn,
      bookingCount: count(appointmentsTable.id),
    })
    .from(servicesTable)
    .leftJoin(appointmentsTable, eq(appointmentsTable.serviceId, servicesTable.id))
    .groupBy(servicesTable.id, servicesTable.nameAr, servicesTable.nameEn)
    .orderBy(sql`count(${appointmentsTable.id}) DESC`)
    .limit(limit);

  res.json(GetPopularServicesResponse.parse(popular.map(p => ({ ...p, bookingCount: Number(p.bookingCount) }))));
});

export default router;
