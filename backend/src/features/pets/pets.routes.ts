import { Router } from 'express';
import * as petsController from './pets.controller';
import { authenticate } from '../auth/auth.middleware';

const router = Router();

// All pet routes require authentication
router.get('/', authenticate, petsController.listPets);
router.get('/:id', authenticate, petsController.getPetById);
router.post('/', authenticate, petsController.createPet);
router.patch('/:id', authenticate, petsController.updatePet);
router.delete('/:id', authenticate, petsController.deletePet);

export { router as petRoutes };