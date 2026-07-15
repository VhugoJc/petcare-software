/**
 * Unified API response envelope.
 *
 * All endpoints return responses in this shape to ensure
 * frontend service layers can parse responses consistently.
 */

// ---------- Success (single resource) ----------
export interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// ---------- Success (paginated list) ----------
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  message?: string;
  meta: PaginationMeta;
}

// ---------- Error ----------
export interface ErrorDetail {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ErrorResponse {
  success: false;
  error: ErrorDetail;
}

// ---------- Union type for convenience ----------
export type ApiResponse<T> = SuccessResponse<T> | PaginatedResponse<T> | ErrorResponse;