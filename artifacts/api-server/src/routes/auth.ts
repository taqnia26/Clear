import { Router, type IRouter } from "express";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { AdminLoginBody, GetAuthMeResponse } from "@workspace/api-zod";

const router: IRouter = Router();

// POST /auth/login
router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { username, password } = parsed.data;

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.username, username));

  if (!admin) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // Simple password check (in production use bcrypt)
  if (admin.passwordHash !== password) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  // Set session cookie
  res.cookie("admin_id", String(admin.id), {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    user: {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role,
      createdAt: admin.createdAt,
    },
    token: String(admin.id),
  });
});

// POST /auth/logout
router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.clearCookie("admin_id");
  res.json({ success: true });
});

// GET /auth/me
router.get("/auth/me", async (req, res): Promise<void> => {
  const adminIdCookie = req.cookies?.admin_id;
  if (!adminIdCookie) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const adminId = parseInt(adminIdCookie, 10);
  if (isNaN(adminId)) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  const [admin] = await db
    .select()
    .from(adminsTable)
    .where(eq(adminsTable.id, adminId));

  if (!admin) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }

  res.json(GetAuthMeResponse.parse({
    id: admin.id,
    username: admin.username,
    name: admin.name,
    role: admin.role,
    createdAt: admin.createdAt,
  }));
});

export default router;
