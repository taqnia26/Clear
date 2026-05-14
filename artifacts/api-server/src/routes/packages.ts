import { Router, type IRouter } from "express";
import { db, packagesTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import {
  ListPackagesQueryParams,
  ListPackagesResponse,
  CreatePackageBody,
  GetPackageParams,
  GetPackageResponse,
  UpdatePackageParams,
  UpdatePackageBody,
  UpdatePackageResponse,
  DeletePackageParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

function parsePackage(pkg: Record<string, unknown>) {
  return {
    ...pkg,
    originalPrice: pkg.originalPrice != null ? Number(pkg.originalPrice) : null,
    discountedPrice: pkg.discountedPrice != null ? Number(pkg.discountedPrice) : null,
    discountPercent: pkg.discountPercent != null ? Number(pkg.discountPercent) : null,
  };
}

// GET /packages
router.get("/packages", async (req, res): Promise<void> => {
  const params = ListPackagesQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const conditions = [];
  if (params.data.featured !== undefined) {
    conditions.push(eq(packagesTable.featured, params.data.featured));
  }
  if (params.data.active !== undefined) {
    conditions.push(eq(packagesTable.active, params.data.active));
  }

  const packages = conditions.length > 0
    ? await db.select().from(packagesTable).where(and(...conditions))
    : await db.select().from(packagesTable);

  res.json(ListPackagesResponse.parse(packages.map(parsePackage)));
});

// POST /packages
router.post("/packages", async (req, res): Promise<void> => {
  const parsed = CreatePackageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [pkg] = await db.insert(packagesTable).values({
    nameAr: parsed.data.nameAr,
    nameEn: parsed.data.nameEn,
    descriptionAr: parsed.data.descriptionAr,
    descriptionEn: parsed.data.descriptionEn,
    featured: parsed.data.featured,
    active: parsed.data.active,
    imageUrl: parsed.data.imageUrl,
    validUntil: parsed.data.validUntil != null
      ? (typeof parsed.data.validUntil === "string" ? parsed.data.validUntil : (parsed.data.validUntil as Date).toISOString().split("T")[0])
      : undefined,
    originalPrice: parsed.data.originalPrice != null ? String(parsed.data.originalPrice) : undefined,
    discountedPrice: parsed.data.discountedPrice != null ? String(parsed.data.discountedPrice) : undefined,
    discountPercent: parsed.data.discountPercent != null ? String(parsed.data.discountPercent) : undefined,
  }).returning();

  res.status(201).json(GetPackageResponse.parse(parsePackage(pkg as Record<string, unknown>)));
});

// GET /packages/:id
router.get("/packages/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetPackageParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [pkg] = await db.select().from(packagesTable).where(eq(packagesTable.id, params.data.id));
  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }

  res.json(GetPackageResponse.parse(parsePackage(pkg as Record<string, unknown>)));
});

// PATCH /packages/:id
router.patch("/packages/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdatePackageParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdatePackageBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [pkg] = await db.update(packagesTable).set({
    nameAr: parsed.data.nameAr,
    nameEn: parsed.data.nameEn,
    descriptionAr: parsed.data.descriptionAr,
    descriptionEn: parsed.data.descriptionEn,
    featured: parsed.data.featured,
    active: parsed.data.active,
    imageUrl: parsed.data.imageUrl,
    validUntil: parsed.data.validUntil != null
      ? (typeof parsed.data.validUntil === "string" ? parsed.data.validUntil : (parsed.data.validUntil as Date).toISOString().split("T")[0])
      : undefined,
    originalPrice: parsed.data.originalPrice != null ? String(parsed.data.originalPrice) : undefined,
    discountedPrice: parsed.data.discountedPrice != null ? String(parsed.data.discountedPrice) : undefined,
    discountPercent: parsed.data.discountPercent != null ? String(parsed.data.discountPercent) : undefined,
  }).where(eq(packagesTable.id, params.data.id)).returning();

  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }

  res.json(UpdatePackageResponse.parse(parsePackage(pkg as Record<string, unknown>)));
});

// DELETE /packages/:id
router.delete("/packages/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeletePackageParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [pkg] = await db.delete(packagesTable).where(eq(packagesTable.id, params.data.id)).returning();
  if (!pkg) {
    res.status(404).json({ error: "Package not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
