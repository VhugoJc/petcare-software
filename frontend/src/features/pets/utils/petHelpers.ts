import type { Species } from '../../../types';

/* ------------------------------------------------------------------ */
/*  Age computation                                                    */
/* ------------------------------------------------------------------ */

export interface Age {
  years: number;
  months: number;
}

export function computeAge(dateOfBirth: string): Age {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  return { years, months };
}

export function formatAge(dateOfBirth: string): string {
  const { years, months } = computeAge(dateOfBirth);
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''}`;
  }
  if (months === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  }
  return `${years} year${years !== 1 ? 's' : ''}, ${months} month${months !== 1 ? 's' : ''}`;
}

/* ------------------------------------------------------------------ */
/*  Species helpers                                                    */
/* ------------------------------------------------------------------ */

export const SPECIES_CONFIG: Record<Species, { label: string; icon: string; plural: string }> = {
  dog: { label: 'Dog', icon: '🐕', plural: 'Dogs' },
  cat: { label: 'Cat', icon: '🐱', plural: 'Cats' },
  bird: { label: 'Bird', icon: '🐦', plural: 'Birds' },
  rabbit: { label: 'Rabbit', icon: '🐰', plural: 'Rabbits' },
  other: { label: 'Other', icon: '🐾', plural: 'Other' },
};

export function getSpeciesIcon(species: Species): string {
  return SPECIES_CONFIG[species]?.icon ?? '🐾';
}

export function getSpeciesLabel(species: Species): string {
  return SPECIES_CONFIG[species]?.label ?? species;
}

/* ------------------------------------------------------------------ */
/*  Common breed lists per species                                    */
/* ------------------------------------------------------------------ */

export const BREEDS_BY_SPECIES: Record<Species, string[]> = {
  dog: [
    'Labrador Retriever',
    'Golden Retriever',
    'German Shepherd',
    'Bulldog',
    'Poodle',
    'Beagle',
    'Rottweiler',
    'Yorkshire Terrier',
    'Boxer',
    'Dachshund',
    'Siberian Husky',
    'Shih Tzu',
    'Mixed Breed',
    'Other',
  ],
  cat: [
    'Domestic Shorthair',
    'Domestic Longhair',
    'Persian',
    'Maine Coon',
    'Siamese',
    'Bengal',
    'Ragdoll',
    'Sphynx',
    'British Shorthair',
    'Scottish Fold',
    'Mixed Breed',
    'Other',
  ],
  bird: [
    'Cockatiel',
    'Budgerigar (Parakeet)',
    'African Grey Parrot',
    'Canary',
    'Lovebird',
    'Macaw',
    'Cockatoo',
    'Finch',
    'Other',
  ],
  rabbit: [
    'Holland Lop',
    'Mini Rex',
    'Netherland Dwarf',
    'Lionhead',
    'Flemish Giant',
    'English Angora',
    'Mixed Breed',
    'Other',
  ],
  other: ['Mixed / Unknown', 'Other'],
};