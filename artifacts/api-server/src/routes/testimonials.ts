import { Router, type IRouter } from "express";
import { db, testimonialsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListTestimonialsQueryParams,
  ListTestimonialsResponse,
  CreateTestimonialBody,
  UpdateTestimonialParams,
  UpdateTestimonialBody,
  UpdateTestimonialResponse,
  DeleteTestimonialParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /testimonials
router.get("/testimonials", async (req, res): Promise<void> => {
  const params = ListTestimonialsQueryParams.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  let testimonials;
  if (params.data.approved !== undefined) {
    testimonials = await db.select().from(testimonialsTable).where(eq(testimonialsTable.approved, params.data.approved));
  } else {
    testimonials = await db.select().from(testimonialsTable);
  }

  res.json(ListTestimonialsResponse.parse(testimonials));
});

// POST /testimonials
router.post("/testimonials", async (req, res): Promise<void> => {
  const parsed = CreateTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [testimonial] = await db.insert(testimonialsTable).values({
    ...parsed.data,
    approved: false,
  }).returning();

  res.status(201).json(testimonial);
});

// PATCH /testimonials/:id
router.patch("/testimonials/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateTestimonialParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateTestimonialBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [testimonial] = await db.update(testimonialsTable)
    .set(parsed.data)
    .where(eq(testimonialsTable.id, params.data.id))
    .returning();

  if (!testimonial) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }

  res.json(UpdateTestimonialResponse.parse(testimonial));
});

// DELETE /testimonials/:id
router.delete("/testimonials/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = DeleteTestimonialParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [testimonial] = await db.delete(testimonialsTable).where(eq(testimonialsTable.id, params.data.id)).returning();
  if (!testimonial) {
    res.status(404).json({ error: "Testimonial not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
