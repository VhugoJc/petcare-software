import { MockOwnerService } from './MockOwnerService';
import type { OwnerService } from './OwnerService';

/**
 * Active OwnerService implementation.
 *
 * To switch to a real API:
 *   1. Create `RestOwnerService` implementing `OwnerService`
 *   2. Change this export to `RestOwnerService`
 *   → No UI components need to change.
 */
export const ownerService: OwnerService = new MockOwnerService();