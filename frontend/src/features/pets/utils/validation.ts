import type { CreatePetInput, ValidationResult } from '../types';
import type { Species } from '../../../types';

const VALID_SPECIES: Species[] = ['dog', 'cat', 'bird', 'rabbit', 'other'];

export function validatePet(data: Partial<CreatePetInput>): ValidationResult {
  const errors: Record<string, string> = {};

  // Name
  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length > 100) {
    errors.name = 'Name must be 100 characters or less';
  }

  // Owner
  if (!data.ownerId?.trim()) {
    errors.ownerId = 'Owner is required';
  }

  // Species
  if (!data.species) {
    errors.species = 'Species is required';
  } else if (!VALID_SPECIES.includes(data.species)) {
    errors.species = 'Invalid species';
  }

  // Breed
  if (!data.breed?.trim()) {
    errors.breed = 'Breed is required';
  } else if (data.breed.trim().length > 100) {
    errors.breed = 'Breed must be 100 characters or less';
  }

  // Color
  if (!data.color?.trim()) {
    errors.color = 'Color is required';
  } else if (data.color.trim().length > 100) {
    errors.color = 'Color must be 100 characters or less';
  }

  // Date of birth
  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  } else {
    const dob = new Date(data.dateOfBirth);
    if (isNaN(dob.getTime())) {
      errors.dateOfBirth = 'Invalid date';
    } else if (dob > new Date()) {
      errors.dateOfBirth = 'Date of birth cannot be in the future';
    }
  }

  // Sex
  if (!data.sex) {
    errors.sex = 'Sex is required';
  } else if (!['male', 'female'].includes(data.sex)) {
    errors.sex = 'Sex must be male or female';
  }

  // Microchip ID (optional)
  if (data.microchipId?.trim()) {
    const cleaned = data.microchipId.trim();
    if (cleaned.length < 10 || cleaned.length > 15) {
      errors.microchipId = 'Microchip ID must be 10–15 characters';
    } else if (!/^[A-Za-z0-9]+$/.test(cleaned)) {
      errors.microchipId = 'Microchip ID must be alphanumeric';
    }
  }

  // Weight (optional)
  if (data.weightKg !== undefined && data.weightKg !== null) {
    if (typeof data.weightKg !== 'number' || data.weightKg < 0.1 || data.weightKg > 200) {
      errors.weightKg = 'Weight must be between 0.1 and 200 kg';
    }
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