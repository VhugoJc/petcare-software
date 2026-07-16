import { RestPetService } from './RestPetService';
import type { PetService } from './PetService';

/**
 * Active PetService implementation.
 *
 * Uses the real REST API backend. JWT auth token is read from
 * localStorage automatically by RestPetService.
 */
export const petService: PetService = new RestPetService();