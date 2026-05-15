import type { Request, Response, NextFunction } from "express";
import { db, adminsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

export type AdminRole = "superadmin" | "admin" | "receptionist";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: { id: number; username: string; role: AdminRole };
    }
  }
}

export function requireAdmin(...allowedRoles: AdminRole[]) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const raw = req.cookies?.admin_id;
    const adminId = Number(raw);
    if (!raw || !Number.isInteger(adminId) || adminId <= 0) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const [admin] = await db.select().from(adminsTable).where(eq(adminsTable.id, adminId));
    if (!admin) {
      res.clearCookie("admin_id");
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(admin.role as AdminRole)) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    req.admin = { id: admin.id, username: admin.username, role: admin.role as AdminRole };
    next();
  };
}
