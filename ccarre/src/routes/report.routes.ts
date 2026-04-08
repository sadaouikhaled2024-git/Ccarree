import { Router } from 'express';
import authMiddleware from '../middlewares/auth.middleware';
import { createReport, getMyReports, getReportDetail } from '../controllers/report.controller';

const router = Router();

/* ───────── Middlewares ───────── */
router.use(authMiddleware);

/* ── POST /reports ── */
router.post('/', createReport);

/* ── GET /reports ── */
router.get('/', getMyReports);

/* ── GET /reports/:reportId ── */
router.get('/:reportId', getReportDetail);

export default router;
