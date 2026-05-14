import { Router, type IRouter } from "express";
import { db, doctorsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListDoctorsQueryParams,
  ListDoctorsResponse,
  CreateDoctorBody,
  GetDoctorParams,
  GetDoctorResponse,
  UpdateDoctorParams,
  UpdateDoctorBody,
  UpdateDoctorResponse,
  DeleteDoctorParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /doctors
router.get("/doctors", async (req, res): Promise<void> => {
  const params = ListDoctorsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.specialty) {
    conditions.push(eq(doctorsTable.specialty, params.data.specialty as "cosmetic" | "dental" | "both"));
  }
  if (params.data.active !== undefined) {
    conditions.push(eq(doctorsTable.active, params.data.active));
  }

  const doctors = conditions.length > 0
    ? await db.select().from(doctorsTable).where(and(...conditions))
    : await db.select().from(doctorsTable);

  res.json(ListDoctorsResponse.parse(doctors));
});

// POST /doctors
router.post("/doctors", async (req, res): Promise<void> => {
  const parsed = CreateDoctorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [doctor] = await db.insert(doctorsTable).values(parsed.data).returning();
  res.status(201).json(GetDoctorResponse.parse(doctor));
});

// GET /doctors/:id
router.get("/doctors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetDoctorParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [doctor] = await db.select().from(doctorsTable).where(eq(doctorsTable.id, params.data.id));
  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  res.json(GetDoctorResponse.parse(doctor));
});

// PATCH /doctors/:id
router.patch("/doctors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateDoctorParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateDoctorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [doctor] = await db.update(doctorsTable).set(parsed.data).where(eq(doctorsTable.id, params.data.id)).returning();
  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  res.json(UpdateDoctorResponse.parse(doctor));
});

// DELETE /doctors/:id
router.delete("/doctors/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteDoctorParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [doctor] = await db.delete(doctorsTable).where(eq(doctorsTable.id, params.data.id)).returning();
  if (!doctor) {
    res.status(404).json({ error: "Doctor not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
