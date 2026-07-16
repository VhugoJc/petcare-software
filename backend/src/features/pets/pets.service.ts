import { AppError } from '../../errors/AppError';
import { Pet } from './pets.model';
import { Owner } from '../owners/owners.model';
import type { PetResponse, PetQueryFilters } from './types/index';
import type { CreatePetInput, UpdatePetInput } from './pets.validation';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

async function resolveOwnerName(ownerId: string): Promise<string> {
  const owner = await Owner.findById(ownerId).select('firstName lastName').lean();
  if (!owner) {
    throw AppError.badRequest(`Owner not found: ${ownerId}`);
  }
  return `${owner.firstName} ${owner.lastName}`;
}

function toPetResponse(doc: Record<string, unknown>, ownerName: string): PetResponse {
  return {
    id: String(doc._id ?? doc.id),
    ownerId: String(doc.ownerId),
    ownerName,
    name: doc.name as string,
    species: doc.species as PetResponse['species'],
    breed: doc.breed as string,
    color: doc.color as string,
    dateOfBirth: (doc.dateOfBirth as Date).toISOString(),
    sex: doc.sex as 'male' | 'female',
    isNeutered: doc.isNeutered as boolean,
    microchipId: doc.microchipId as string | undefined,
    weightKg: doc.weightKg as number | undefined,
    notes: doc.notes as string | undefined,
    isActive: doc.isActive as boolean,
    createdAt: (doc.createdAt as Date).toISOString(),
    updatedAt: (doc.updatedAt as Date).toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/*  Service functions                                                  */
/* ------------------------------------------------------------------ */

export async function createPet(input: CreatePetInput): Promise<PetResponse> {
  const ownerName = await resolveOwnerName(input.ownerId);
  const pet = await Pet.create(input);
  return toPetResponse(pet.toJSON() as Record<string, unknown>, ownerName);
}

export async function getPetById(id: string): Promise<PetResponse> {
  const pet = await Pet.findById(id);
  if (!pet) {
    throw AppError.notFound('Pet not found');
  }
  const ownerName = await resolveOwnerName(String(pet.ownerId));
  return toPetResponse(pet.toJSON() as Record<string, unknown>, ownerName);
}

export async function listPets(
  filters: PetQueryFilters
): Promise<{ data: PetResponse[]; total: number; page: number; pageSize: number; totalPages: number }> {
  const {
    search,
    species,
    ownerId,
    isActive,
    sortBy = 'name',
    sortOrder = 'asc',
    page = 1,
    pageSize = 10,
  } = filters;

  // Build query filter
  const query: Record<string, unknown> = {};

  // Only filter by isActive when explicitly requested
  if (isActive === true) {
    query.isActive = true;
  } else if (isActive === false) {
    query.isActive = false;
  }

  // Filter by species
  if (species) {
    query.species = species;
  }

  // Filter by owner
  if (ownerId) {
    query.ownerId = ownerId;
  }

  // Text search: if search includes owner name, resolve owner IDs first
  let ownerIdsForSearch: string[] | null = null;
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Search owners for matching names
    const matchingOwners = await Owner.find({
      $or: [
        { firstName: { $regex: escaped, $options: 'i' } },
        { lastName: { $regex: escaped, $options: 'i' } },
      ],
    })
      .select('_id')
      .lean();

    ownerIdsForSearch = matchingOwners.map((o) => String(o._id));

    query.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { breed: { $regex: escaped, $options: 'i' } },
      { microchipId: { $regex: escaped, $options: 'i' } },
      ...(ownerIdsForSearch.length > 0 ? [{ ownerId: { $in: ownerIdsForSearch } }] : []),
    ];
  }

  const sortOrderValue = sortOrder === 'desc' ? -1 : 1;
  const skip = (page - 1) * pageSize;

  const [docs, total] = await Promise.all([
    Pet.find(query)
      .sort({ [sortBy]: sortOrderValue })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Pet.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Resolve owner names for all results
  const ownerIds = [...new Set(docs.map((d) => String(d.ownerId)))];
  const owners = await Owner.find({ _id: { $in: ownerIds } })
    .select('firstName lastName')
    .lean();
  const ownerNameMap = new Map<string, string>();
  for (const owner of owners) {
    ownerNameMap.set(String(owner._id), `${owner.firstName} ${owner.lastName}`);
  }

  const data = docs.map((doc) => {
    const oid = String(doc.ownerId);
    const ownerName = ownerNameMap.get(oid) || 'Unknown Owner';
    return toPetResponse(doc as unknown as Record<string, unknown>, ownerName);
  });

  return { data, total, page, pageSize, totalPages };
}

export async function updatePet(id: string, input: UpdatePetInput): Promise<PetResponse> {
  // If ownerId is being changed, validate the new owner exists
  if (input.ownerId) {
    await resolveOwnerName(input.ownerId);
  }

  const pet = await Pet.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
  if (!pet) {
    throw AppError.notFound('Pet not found');
  }

  const ownerName = await resolveOwnerName(String(pet.ownerId));
  return toPetResponse(pet.toJSON() as Record<string, unknown>, ownerName);
}

export async function deletePet(id: string): Promise<void> {
  const pet = await Pet.findByIdAndDelete(id);
  if (!pet) {
    throw AppError.notFound('Pet not found');
  }
}