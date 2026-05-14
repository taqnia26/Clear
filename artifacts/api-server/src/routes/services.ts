import { Router, type IRouter } from "express";
import { db, servicesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListServicesQueryParams,
  ListServicesResponse,
  CreateServiceBody,
  GetServiceParams,
  GetServiceResponse,
  UpdateServiceParams,
  UpdateServiceBody,
  UpdateServiceResponse,
  DeleteServiceParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /services
router.get("/services", async (req, res): Promise<void> => {
  const params = ListServicesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.category) {
    conditions.push(eq(servicesTable.category, params.data.category as "cosmetic" | "dental" | "both"));
  }
  if (params.data.active !== undefined) {
    conditions.push(eq(servicesTable.active, params.data.active));
  }

  const services = conditions.length > 0
    ? await db.select().from(servicesTable).where(and(...conditions))
    : await db.select().from(servicesTable);

  res.json(ListServicesResponse.parse(services.map(s => ({ ...s, priceFrom: s.priceFrom ? Number(s.priceFrom) : null }))));
});

// POST /services
router.post("/services", async (req, res): Promise<void> => {
  const parsed = CreateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [service] = await db.insert(servicesTable).values({
    ...parsed.data,
    priceFrom: parsed.data.priceFrom != null ? String(parsed.data.priceFrom) : undefined,
  }).returning();

  res.status(201).json(GetServiceResponse.parse({ ...service, priceFrom: service.priceFrom ? Number(service.priceFrom) : null }));
});

// GET /services/:id
router.get("/services/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetServiceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [service] = await db.select().from(servicesTable).where(eq(servicesTable.id, params.data.id));
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }

  res.json(GetServiceResponse.parse({ ...service, priceFrom: service.priceFrom ? Number(service.priceFrom) : null }));
});

// PATCH /services/:id
router.patch("/services/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateServiceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateServiceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [service] = await db.update(servicesTable)
    .set({ ...parsed.data, priceFrom: parsed.data.priceFrom != null ? String(parsed.data.priceFrom) : undefined })
    .where(eq(servicesTable.id, params.data.id))
    .returning();

  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }

  res.json(UpdateServiceResponse.parse({ ...service, priceFrom: service.priceFrom ? Number(service.priceFrom) : null }));
});

// DELETE /services/:id
router.delete("/services/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteServiceParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [service] = await db.delete(servicesTable).where(eq(servicesTable.id, params.data.id)).returning();
  if (!service) {
    res.status(404).json({ error: "Service not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
