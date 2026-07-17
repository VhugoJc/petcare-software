import { AppError } from '../../errors/AppError';
import { Appointment } from './appointments.model';
import { Owner } from '../owners/owners.model';
import { Pet } from '../pets/pets.model';
import type { AppointmentResponse, AppointmentQueryFilters, AppointmentStatus, Species } from './types/index';
import type { CreateAppointmentInput, UpdateAppointmentInput, UpdateAppointmentStatusInput } from './appointments.validation';

/* ------------------------------------------------------------------ */
/*  Status workflow                                                    */
/* ------------------------------------------------------------------ */

const VALID_TRANSITIONS: Record<AppointmentStatus, AppointmentStatus[]> = {
  scheduled: ['confirmed', 'cancelled'],
  confirmed: ['checked-in', 'cancelled'],
  'checked-in': ['in-progress', 'cancelled', 'no-show'],
  'in-progress': ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
  'no-show': [],
};

function isValidTransition(from: AppointmentStatus, to: AppointmentStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

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

async function resolvePetInfo(petId: string): Promise<{ petName: string; petSpecies: Species }> {
  const pet = await Pet.findById(petId).select('name species').lean();
  if (!pet) {
    throw AppError.badRequest(`Pet not found: ${petId}`);
  }
  return { petName: pet.name, petSpecies: pet.species as Species };
}

function toAppointmentResponse(
  doc: Record<string, unknown>,
  ownerName: string,
  petName: string,
  petSpecies: Species,
): AppointmentResponse {
  const dateVal = doc.date as Date;
  return {
    id: String(doc._id ?? doc.id),
    appointmentNumber: doc.appointmentNumber as string,
    ownerId: String(doc.ownerId),
    ownerName,
    petId: String(doc.petId),
    petName,
    petSpecies,
    date: dateVal.toISOString(),
    startTime: doc.startTime as string,
    endTime: doc.endTime as string,
    reason: doc.reason as string,
    type: doc.type as AppointmentResponse['type'],
    status: doc.status as AppointmentResponse['status'],
    notes: doc.notes as string | undefined,
    createdAt: (doc.createdAt as Date).toISOString(),
    updatedAt: (doc.updatedAt as Date).toISOString(),
  };
}

/* ------------------------------------------------------------------ */
/*  Service functions                                                  */
/* ------------------------------------------------------------------ */

export async function createAppointment(input: CreateAppointmentInput): Promise<AppointmentResponse> {
  const [ownerName, petInfo] = await Promise.all([
    resolveOwnerName(input.ownerId),
    resolvePetInfo(input.petId),
  ]);

  const appointment = await Appointment.create(input);
  return toAppointmentResponse(
    appointment.toJSON() as Record<string, unknown>,
    ownerName,
    petInfo.petName,
    petInfo.petSpecies,
  );
}

export async function getAppointmentById(id: string): Promise<AppointmentResponse> {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw AppError.notFound('Appointment not found');
  }

  const [ownerName, petInfo] = await Promise.all([
    resolveOwnerName(String(appointment.ownerId)),
    resolvePetInfo(String(appointment.petId)),
  ]);

  return toAppointmentResponse(
    appointment.toJSON() as Record<string, unknown>,
    ownerName,
    petInfo.petName,
    petInfo.petSpecies,
  );
}

export async function listAppointments(
  filters: AppointmentQueryFilters,
): Promise<{
  data: AppointmentResponse[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}> {
  const {
    search,
    date,
    dateFrom,
    dateTo,
    status,
    type,
    ownerId,
    petId,
    sortBy = 'date',
    sortOrder = 'asc',
    page = 1,
    pageSize = 10,
  } = filters;

  // Build query filter
  const query: Record<string, unknown> = {};

  if (status) query.status = status;
  if (type) query.type = type;
  if (ownerId) query.ownerId = ownerId;
  if (petId) query.petId = petId;

  // Date filtering
  if (date) {
    const d = new Date(date);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query.date = { $gte: start, $lt: end };
  } else if (dateFrom || dateTo) {
    const dateQuery: Record<string, Date> = {};
    if (dateFrom) {
      const d = new Date(dateFrom);
      dateQuery.$gte = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }
    if (dateTo) {
      const d = new Date(dateTo);
      const end = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      end.setDate(end.getDate() + 1);
      dateQuery.$lt = end;
    }
    query.date = dateQuery;
  }

  // Text search
  let ownerIdsForSearch: string[] | null = null;
  let petIdsForSearch: string[] | null = null;

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

    // Search pets for matching names
    const matchingPets = await Pet.find({
      name: { $regex: escaped, $options: 'i' },
    })
      .select('_id')
      .lean();
    petIdsForSearch = matchingPets.map((p) => String(p._id));

    const orConditions: Record<string, unknown>[] = [
      { reason: { $regex: escaped, $options: 'i' } },
      { appointmentNumber: { $regex: escaped, $options: 'i' } },
    ];

    if (ownerIdsForSearch.length > 0) {
      orConditions.push({ ownerId: { $in: ownerIdsForSearch } });
    }
    if (petIdsForSearch.length > 0) {
      orConditions.push({ petId: { $in: petIdsForSearch } });
    }

    query.$or = orConditions;
  }

  const sortOrderValue = sortOrder === 'desc' ? -1 : 1;
  const skip = (page - 1) * pageSize;

  const [docs, total] = await Promise.all([
    Appointment.find(query)
      .sort({ [sortBy]: sortOrderValue })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Appointment.countDocuments(query),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Resolve owner and pet names for all results
  const ownerIds = [...new Set(docs.map((d) => String(d.ownerId)))];
  const petIds = [...new Set(docs.map((d) => String(d.petId)))];

  const [owners, pets] = await Promise.all([
    Owner.find({ _id: { $in: ownerIds } }).select('firstName lastName').lean(),
    Pet.find({ _id: { $in: petIds } }).select('name species').lean(),
  ]);

  const ownerNameMap = new Map<string, string>();
  for (const owner of owners) {
    ownerNameMap.set(String(owner._id), `${owner.firstName} ${owner.lastName}`);
  }

  const petNameMap = new Map<string, { name: string; species: Species }>();
  for (const pet of pets) {
    petNameMap.set(String(pet._id), { name: pet.name, species: pet.species as Species });
  }

  const data = docs.map((doc) => {
    const oid = String(doc.ownerId);
    const pid = String(doc.petId);
    const ownerName = ownerNameMap.get(oid) || 'Unknown Owner';
    const petInfo = petNameMap.get(pid) || { name: 'Unknown Pet', species: 'other' as Species };
    return toAppointmentResponse(
      doc as unknown as Record<string, unknown>,
      ownerName,
      petInfo.name,
      petInfo.species,
    );
  });

  return { data, total, page, pageSize, totalPages };
}

export async function updateAppointment(
  id: string,
  input: UpdateAppointmentInput,
): Promise<AppointmentResponse> {
  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { $set: input },
    { new: true, runValidators: true },
  );
  if (!appointment) {
    throw AppError.notFound('Appointment not found');
  }

  const [ownerName, petInfo] = await Promise.all([
    resolveOwnerName(String(appointment.ownerId)),
    resolvePetInfo(String(appointment.petId)),
  ]);

  return toAppointmentResponse(
    appointment.toJSON() as Record<string, unknown>,
    ownerName,
    petInfo.petName,
    petInfo.petSpecies,
  );
}

export async function updateAppointmentStatus(
  id: string,
  input: UpdateAppointmentStatusInput,
): Promise<AppointmentResponse> {
  const appointment = await Appointment.findById(id);
  if (!appointment) {
    throw AppError.notFound('Appointment not found');
  }

  const currentStatus = appointment.status as AppointmentStatus;
  const newStatus = input.status;

  if (!isValidTransition(currentStatus, newStatus)) {
    throw AppError.badRequest(
      `Cannot transition from '${currentStatus}' to '${newStatus}'`,
    );
  }

  appointment.status = newStatus;
  await appointment.save();

  const [ownerName, petInfo] = await Promise.all([
    resolveOwnerName(String(appointment.ownerId)),
    resolvePetInfo(String(appointment.petId)),
  ]);

  return toAppointmentResponse(
    appointment.toJSON() as Record<string, unknown>,
    ownerName,
    petInfo.petName,
    petInfo.petSpecies,
  );
}

export async function deleteAppointment(id: string): Promise<void> {
  const appointment = await Appointment.findByIdAndDelete(id);
  if (!appointment) {
    throw AppError.notFound('Appointment not found');
  }
}