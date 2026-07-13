import type { AppointmentStatus, AppointmentType } from '../types';

/* ------------------------------------------------------------------ */
/*  Status helpers                                                     */
/* ------------------------------------------------------------------ */

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: 'Scheduled',
  confirmed: 'Confirmed',
  'checked-in': 'Checked In',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
  'no-show': 'No Show',
};

export const STATUS_COLORS: Record<AppointmentStatus, string> = {
  scheduled: '#1976d2',
  confirmed: '#0288d1',
  'checked-in': '#2e7d32',
  'in-progress': '#ed6c02',
  completed: '#2e7d32',
  cancelled: '#d32f2f',
  'no-show': '#d32f2f',
};

/** Valid status transitions */
const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  scheduled: ['confirmed', 'cancelled'],
  confirmed: ['checked-in', 'cancelled'],
  'checked-in': ['in-progress', 'cancelled', 'no-show'],
  'in-progress': ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  'no-show': [],
};

export function isValidTransition(from: AppointmentStatus, to: AppointmentStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

export function getAvailableTransitions(status: AppointmentStatus): AppointmentStatus[] {
  return VALID_TRANSITIONS[status] ?? [];
}

/* ------------------------------------------------------------------ */
/*  Type helpers                                                       */
/* ------------------------------------------------------------------ */

export const TYPE_LABELS: Record<AppointmentType, string> = {
  consultation: 'Consultation',
  surgery: 'Surgery',
  vaccination: 'Vaccination',
  checkup: 'Check-up',
  grooming: 'Grooming',
  dental: 'Dental',
  emergency: 'Emergency',
  followup: 'Follow-up',
  other: 'Other',
};

export const TYPE_ICONS: Record<AppointmentType, string> = {
  consultation: '🩺',
  surgery: '🔪',
  vaccination: '💉',
  checkup: '📋',
  grooming: '✂️',
  dental: '🦷',
  emergency: '🚨',
  followup: '🔄',
  other: '📌',
};

/* ------------------------------------------------------------------ */
/*  Appointment number generation                                     */
/* ------------------------------------------------------------------ */

let counter = 0;

export function generateAppointmentNumber(year: number = new Date().getFullYear()): string {
  counter++;
  return `APP-${year}-${String(counter).padStart(4, '0')}`;
}

export function resetCounter(value = 0): void {
  counter = value;
}

/* ------------------------------------------------------------------ */
/*  Time helpers                                                       */
/* ------------------------------------------------------------------ */

export function generateTimeSlots(
  intervalMinutes: number = 30,
  startHour: number = 8,
  endHour: number = 18,
): string[] {
  const slots: string[] = [];
  for (let h = startHour; h < endHour; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      slots.push(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`,
      );
    }
  }
  return slots;
}

export function getDurationMinutes(startTime: string, endTime: string): number {
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  return (eh * 60 + em) - (sh * 60 + sm);
}

export function formatTimeDisplay(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function getTodayISO(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function formatDateDisplay(dateISO: string): string {
  const d = new Date(dateISO + 'T00:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}