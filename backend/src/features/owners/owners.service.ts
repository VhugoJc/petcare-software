import { AppError } from '../../errors/AppError';
import { Owner } from './owners.model';
import type { OwnerResponse, OwnerQueryFilters } from './types/index';
import type { CreateOwnerInput, UpdateOwnerInput } from './owners.validation';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function toOwnerResponse(doc: Record<string, unknown>): OwnerResponse {
  return {
    id: String(doc._id ?? doc.id),
    firstName: doc.firstName as string,
    lastName: doc.lastName as string,
    email: doc.email as string,
    phoneNumber: doc.phoneNumber as string,
    emergencyContact: doc.emergencyContact as string | undefined,
    address: doc.address as string | undefined,
    city: doc.city as string | undefined,
    state: doc.state as string | undefined,
    country: doc.country as string | undefined,
    postalCode: doc.postalCode as string | undefined,
    preferredContactMethod: doc.preferredContactMethod as OwnerResponse['preferredContactMethod'],
    notes: doc.notes as string | undefined,
    isActive: doc.isActive as boolean,
    createdAt: (doc.createdAt as Date).toISOString(),
    updatedAt: (doc.updatedAt as Date).toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/*  Service functions                                                  */
/* ------------------------------------------------------------------ */

export async function createOwner(input: CreateOwnerInput): Promise<OwnerResponse> {
  const existing = await Owner.findOne({ email: input.email });
  if (existing) {
    throw AppError.conflict('An owner with this email already exists');
  }

  const owner = await Owner.create(input);
  return toOwnerResponse(owner.toJSON() as Record<string, unknown>);
}

export async function getOwnerById(id: string): Promise<OwnerResponse> {
  const owner = await Owner.findById(id);
  if (!owner) {
    throw AppError.notFound('Owner not found');
  }
  return toOwnerResponse(owner.toJSON() as Record<string, unknown>);
}

export async function listOwners(
  filters: OwnerQueryFilters
): Promise<{ data: OwnerResponse[]; total: number; page: number; pageSize: number; totalPages: number }> {
  const {
    search,
    isActive,
    sortBy = 'lastName',
    sortOrder = 'asc',
    page = 1,
    pageSize = 10,
  } = filters;

  // Build query filter
  const query: Record<string, unknown> = {};

  // Default to showing active owners unless explicitly asked otherwise
  if (isActive === undefined || isActive === true) {
    query.isActive = true;
  } else if (isActive === false) {
    query.isActive = false;
  }

  // Text search across multiple fields
  if (search) {
    const escaped = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { firstName: { $regex: escaped, $options: 'i' } },
      { lastName: { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } },
      { phoneNumber: { $regex: escaped, $options: 'i' } },
    ];
  }

  const sortOrderValue = sortOrder === 'desc' ? -1 : 1;
  const skip = (page - 1) * pageSize;

  const [docs, total] = await Promise.all([
    Owner.find(query)
      .sort({ [sortBy]: sortOrderValue })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Owner.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const data = docs.map((doc) => toOwnerResponse(doc as unknown as Record<string, unknown>));

  return { data, total, page, pageSize, totalPages };
}

export async function updateOwner(
  id: string,
  input: UpdateOwnerInput
): Promise<OwnerResponse> {
  // If email is being changed, check for conflicts
  if (input.email) {
    const existing = await Owner.findOne({ email: input.email, _id: { $ne: id } });
    if (existing) {
      throw AppError.conflict('An owner with this email already exists');
    }
  }

  const owner = await Owner.findByIdAndUpdate(id, { $set: input }, { new: true, runValidators: true });
  if (!owner) {
    throw AppError.notFound('Owner not found');
  }
  return toOwnerResponse(owner.toJSON() as Record<string, unknown>);
}

export async function deleteOwner(id: string): Promise<void> {
  const owner = await Owner.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  );
  if (!owner) {
    throw AppError.notFound('Owner not found');
  }
}