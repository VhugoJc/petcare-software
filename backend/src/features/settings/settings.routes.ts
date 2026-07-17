import { Router } from 'express';
import * as settingsController from './settings.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

router.get('/', authenticate, settingsController.getSettings);
router.patch('/', authenticate, settingsController.updateSettings);

export { router as settingsRoutes };