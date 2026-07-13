import type { CreateOwnerInput, ValidationResult } from '../types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+()]*$/;
const CONTACT_METHODS = ['email', 'phone', 'sms', 'mail'];

export function validateOwner(data: Partial<CreateOwnerInput>): ValidationResult {
  const errors: Record<string, string> = {};

  // First name
  if (!data.firstName?.trim()) {
    errors.firstName = 'First name is required';
  } else if (data.firstName.trim().length > 100) {
    errors.firstName = 'First name must be 100 characters or less';
  }

  // Last name
  if (!data.lastName?.trim()) {
    errors.lastName = 'Last name is required';
  } else if (data.lastName.trim().length > 100) {
    errors.lastName = 'Last name must be 100 characters or less';
  }

  // Email
  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = 'Invalid email format';
  } else if (data.email.trim().length > 254) {
    errors.email = 'Email must be 254 characters or less';
  }

  // Phone
  if (!data.phoneNumber?.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!PHONE_REGEX.test(data.phoneNumber.trim())) {
    errors.phoneNumber = 'Invalid phone number format';
  }

  // Emergency contact (optional)
  if (data.emergencyContact?.trim() && !PHONE_REGEX.test(data.emergencyContact.trim())) {
    errors.emergencyContact = 'Invalid emergency contact format';
  }

  // Address (optional)
  if (data.address && data.address.length > 255) {
    errors.address = 'Address must be 255 characters or less';
  }

  // City (optional)
  if (data.city && data.city.length > 100) {
    errors.city = 'City must be 100 characters or less';
  }

  // State (optional)
  if (data.state && data.state.length > 100) {
    errors.state = 'State must be 100 characters or less';
  }

  // Country (optional)
  if (data.country && data.country.length > 100) {
    errors.country = 'Country must be 100 characters or less';
  }

  // Postal code (optional)
  if (data.postalCode && data.postalCode.length > 20) {
    errors.postalCode = 'Postal code must be 20 characters or less';
  }

  // Preferred contact method
  if (!data.preferredContactMethod) {
    errors.preferredContactMethod = 'Preferred contact method is required';
  } else if (!CONTACT_METHODS.includes(data.preferredContactMethod)) {
    errors.preferredContactMethod = 'Invalid contact method';
  }

  // Notes (optional)
  if (data.notes && data.notes.length > 1000) {
    errors.notes = 'Notes must be 1000 characters or less';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function getFieldError(
  validation: ValidationResult,
  field: string,
): string | undefined {
  return validation.errors[field];
}