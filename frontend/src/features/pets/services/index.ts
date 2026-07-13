import { MockPetService } from './MockPetService';
import type { PetService } from './PetService';

/**
 * Active PetService implementation.
 *
 * To switch to a real API:
 *   1. Create `RestPetService` implementing `PetService`
 *   2. Change this export to `RestPetService`
 *   → No UI components need to change.
 */
export const petService: PetService = new MockPetService();