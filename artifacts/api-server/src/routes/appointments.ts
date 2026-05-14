import { Router, type IRouter } from "express";
import { db, appointmentsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListAppointmentsQueryParams,
  ListAppointmentsResponse,
  CreateAppointmentBody,
  GetAppointmentParams,
  GetAppointmentResponse,
  UpdateAppointmentParams,
  UpdateAppointmentBody,
  UpdateAppointmentResponse,
  DeleteAppointmentParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /appointments
router.get("/appointments", async (req, res): Promise<void> => {
  const params = ListAppointmentsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.status) {
    conditions.push(eq(appointmentsTable.status, params.data.status as "pending" | "confirmed" | "cancelled" | "completed"));
  }
  if (params.data.doctorId) {
    conditions.push(eq(appointmentsTable.doctorId, params.data.doctorId));
  }
  if (params.data.date) {
    const dateStr = typeof params.data.date === "string" ? params.data.date : (params.data.date as Date).toISOString().split("T")[0];
    conditions.push(eq(appointmentsTable.appointmentDate, dateStr));
  }

  const appointments = conditions.length > 0
    ? await db.select().from(appointmentsTable).where(and(...conditions))
    : await db.select().from(appointmentsTable);

  res.json(ListAppointmentsResponse.parse(appointments));
});

// POST /appointments
router.post("/appointments", async (req, res): Promise<void> => {
  const parsed = CreateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const insertData = {
    ...parsed.data,
    appointmentDate: typeof parsed.data.appointmentDate === "string"
      ? parsed.data.appointmentDate
      : (parsed.data.appointmentDate as Date).toISOString().split("T")[0],
  };
  const [appointment] = await db.insert(appointmentsTable).values(insertData).returning();
  res.status(201).json(GetAppointmentResponse.parse(appointment));
});

// GET /appointments/:id
router.get("/appointments/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetAppointmentParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [appointment] = await db.select().from(appointmentsTable).where(eq(appointmentsTable.id, params.data.id));
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.json(GetAppointmentResponse.parse(appointment));
});

// PATCH /appointments/:id
router.patch("/appointments/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateAppointmentParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateAppointmentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [appointment] = await db.update(appointmentsTable)
    .set({
      patientNameAr: parsed.data.patientNameAr,
      patientNameEn: parsed.data.patientNameEn,
      phone: parsed.data.phone,
      email: parsed.data.email,
      serviceId: parsed.data.serviceId,
      doctorId: parsed.data.doctorId,
      status: parsed.data.status,
      notesAr: parsed.data.notesAr,
      notesEn: parsed.data.notesEn,
      appointmentTime: parsed.data.appointmentTime,
      ...(parsed.data.appointmentDate != null ? {
        appointmentDate: typeof parsed.data.appointmentDate === "string"
          ? parsed.data.appointmentDate
          : String(parsed.data.appointmentDate),
      } : {}),
    })
    .where(eq(appointmentsTable.id, params.data.id))
    .returning();

  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.json(UpdateAppointmentResponse.parse(appointment));
});

// DELETE /appointments/:id
router.delete("/appointments/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteAppointmentParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [appointment] = await db.delete(appointmentsTable).where(eq(appointmentsTable.id, params.data.id)).returning();
  if (!appointment) {
    res.status(404).json({ error: "Appointment not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
