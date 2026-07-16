import { Router } from 'express';
import * as ownersController from './owners.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

// All owner routes require authentication
router.get('/', authenticate, ownersController.listOwners);
router.get('/:id', authenticate, ownersController.getOwnerById);
router.post('/', authenticate, ownersController.createOwner);
router.patch('/:id', authenticate, ownersController.updateOwner);
router.delete('/:id', authenticate, ownersController.deleteOwner);

export { router as ownerRoutes };