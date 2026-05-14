import { pgTable, text, serial, timestamp, integer, date, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "cancelled", "completed"]);

export const appointmentsTable = pgTable("appointments", {
  id: serial("id").primaryKey(),
  patientNameAr: text("patient_name_ar").notNull(),
  patientNameEn: text("patient_name_en").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  serviceId: integer("service_id"),
  serviceName: text("service_name"),
  doctorId: integer("doctor_id"),
  doctorName: text("doctor_name"),
  appointmentDate: date("appointment_date").notNull(),
  appointmentTime: text("appointment_time").notNull(),
  status: appointmentStatusEnum("status").notNull().default("pending"),
  notesAr: text("notes_ar"),
  notesEn: text("notes_en"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAppointmentSchema = createInsertSchema(appointmentsTable).omit({ id: true, createdAt: true });
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointmentsTable.$inferSelect;
