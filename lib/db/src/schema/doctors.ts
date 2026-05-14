import { pgTable, text, serial, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const specialtyEnum = pgEnum("specialty", ["cosmetic", "dental", "both"]);

export const doctorsTable = pgTable("doctors", {
  id: serial("id").primaryKey(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  titleAr: text("title_ar"),
  titleEn: text("title_en"),
  specialty: specialtyEnum("specialty").notNull().default("both"),
  bioAr: text("bio_ar"),
  bioEn: text("bio_en"),
  imageUrl: text("image_url"),
  experience: integer("experience"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDoctorSchema = createInsertSchema(doctorsTable).omit({ id: true, createdAt: true });
export type InsertDoctor = z.infer<typeof insertDoctorSchema>;
export type Doctor = typeof doctorsTable.$inferSelect;
