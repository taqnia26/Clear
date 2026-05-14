# Clear Clinic (عيادة كلير)

Bilingual (Arabic primary/RTL + English) professional website for a cosmetic and dental clinic in Saudi Arabia, with appointment booking, services/packages display, and an advanced admin dashboard.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Frontend: React + Vite + Wouter + TanStack Query + Framer Motion + Recharts + Tailwind CSS v4 + shadcn

## Where things live

- `artifacts/clear-clinic/` — React frontend (main app)
- `artifacts/api-server/` — Express backend
- `lib/api-client-react/` — Generated TanStack Query hooks
- `lib/api-spec/` — OpenAPI spec (source of truth for API contracts)
- `lib/db/` — Drizzle schema and migrations
- `artifacts/clear-clinic/src/lib/i18n.ts` — All Arabic/English translations
- `artifacts/clear-clinic/src/contexts/` — ThemeContext, LanguageContext, AuthContext

## Architecture decisions

- **RTL-first**: Default language is Arabic; HTML `dir` attribute toggled dynamically via LanguageContext.
- **Cookie-based admin auth**: Sessions stored server-side with `express-session`, `admin_id` cookie; no JWT.
- **Schema-first API**: OpenAPI spec → Orval codegen → typed React Query hooks; server uses Zod validation.
- **Framer Motion Variants**: All `Variants` objects typed with `type Variants` import; `ease` values removed to avoid TS errors with framer-motion's strict `Easing` type.
- **Role-based access**: superadmin > admin > receptionist; receptionist can only see Appointments.

## Product

- **Public site**: Home (parallax hero, stats, services, packages, doctors, testimonials, CTA), Services (filtered by category), Doctors, Packages (with discounts), Testimonials, Book Appointment form
- **Admin panel**: Login → Dashboard (Recharts pie+bar), Appointments (status management), Doctors/Services/Packages/Testimonials CRUD
- **Bilingual**: All pages fully bilingual Arabic/English with language toggle in navbar

## User preferences

- Arabic is the primary language (RTL layout by default)
- Glassmorphism + parallax + Framer Motion animations throughout
- Light/Dark mode toggle always visible in navbar and admin sidebar
- All admin buttons must be functional (real API calls, no mocked data)

## Gotchas

- `framer-motion` `ease` property must not be typed as plain `string` — use `Variants` type and avoid specifying `ease` in transition, or use `as const` on literal arrays.
- `Doctor.specialty` is a single enum value (`"cosmetic" | "dental" | "both"`), not `specialtyAr`/`specialtyEn`.
- `Doctor.experience` is `number | null` (not `experienceYears`).
- `Testimonial.patientName` is a single field; comments are `commentAr`/`commentEn`.
- `DashboardStats` only has: `totalAppointments`, `pendingAppointments`, `confirmedToday`, `totalDoctors`, `totalServices`, `totalPackages`, `totalTestimonials`.
- `Service.priceFrom` and all `Package` price fields are `number | null`, not strings.
- Admin credentials: `admin / admin123`, `receptionist / recep123`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
