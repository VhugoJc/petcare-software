import { Router } from 'express';
import * as dashboardController from './dashboard.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

router.get('/', authenticate, dashboardController.getDashboard);

export { router as dashboardRoutes };