import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import doctorsRouter from "./doctors";
import servicesRouter from "./services";
import packagesRouter from "./packages";
import appointmentsRouter from "./appointments";
import testimonialsRouter from "./testimonials";
import dashboardRouter from "./dashboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(doctorsRouter);
router.use(servicesRouter);
router.use(packagesRouter);
router.use(appointmentsRouter);
router.use(testimonialsRouter);
router.use(dashboardRouter);

export default router;
