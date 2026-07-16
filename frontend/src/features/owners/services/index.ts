import { RestOwnerService } from './RestOwnerService';
import type { OwnerService } from './OwnerService';

/**
 * Active OwnerService implementation.
 *
 * Uses the real REST API backend. JWT auth token is read from
 * localStorage automatically by RestOwnerService.
 */
export const ownerService: OwnerService = new RestOwnerService();