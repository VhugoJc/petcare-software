import type { CreateAppointmentInput, ValidationResult } from '../types';
import type { AppointmentType } from '../types';

const VALID_TYPES: AppointmentType[] = [
  'consultation', 'surgery', 'vaccination', 'checkup',
  'grooming', 'dental', 'emergency', 'followup', 'other',
];

export function validateAppointment(data: Partial<CreateAppointmentInput>): ValidationResult {
  const errors: Record<string, string> = {};

  // Owner
  if (!data.ownerId?.trim()) {
    errors.ownerId = 'Owner is required';
  }

  // Pet
  if (!data.petId?.trim()) {
    errors.petId = 'Pet is required';
  }

  // Date
  if (!data.date) {
    errors.date = 'Date is required';
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(data.date)) {
      errors.date = 'Invalid date format (use YYYY-MM-DD)';
    }
  }

  // Start time
  if (!data.startTime) {
    errors.startTime = 'Start time is required';
  } else if (!/^\d{2}:\d{2}$/.test(data.startTime)) {
    errors.startTime = 'Invalid time format (use HH:mm)';
  }

  // End time
  if (!data.endTime) {
    errors.endTime = 'End time is required';
  } else if (!/^\d{2}:\d{2}$/.test(data.endTime)) {
    errors.endTime = 'Invalid time format (use HH:mm)';
  }

  // Time ordering
  if (data.startTime && data.endTime && /^\d{2}:\d{2}$/.test(data.startTime) && /^\d{2}:\d{2}$/.test(data.endTime)) {
    const [sh, sm] = data.startTime.split(':').map(Number);
    const [eh, em] = data.endTime.split(':').map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;

    if (endMinutes <= startMinutes) {
      errors.endTime = 'End time must be after start time';
    } else if (endMinutes - startMinutes < 15) {
      errors.endTime = 'Appointment must be at least 15 minutes';
    }
  }

  // Reason
  if (!data.reason?.trim()) {
    errors.reason = 'Reason for visit is required';
  } else if (data.reason.trim().length > 500) {
    errors.reason = 'Reason must be 500 characters or less';
  }

  // Type
  if (!data.type) {
    errors.type = 'Appointment type is required';
  } else if (!VALID_TYPES.includes(data.type)) {
    errors.type = 'Invalid appointment type';
  }

  // Notes (optional)
  if (data.notes && data.notes.length > 2000) {
    errors.notes = 'Notes must be 2000 characters or less';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}