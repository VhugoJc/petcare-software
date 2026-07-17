import { Owner } from '../owners/owners.model';
import { Pet } from '../pets/pets.model';
import { Appointment } from '../appointments/appointments.model';
import type { DashboardResponse } from './types/index';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function getTodayRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

/* ------------------------------------------------------------------ */
/*  Service                                                            */
/* ------------------------------------------------------------------ */

export async function getDashboard(): Promise<DashboardResponse> {
  const { start, end } = getTodayRange();

  const [
    totalOwners,
    totalPets,
    totalAppointments,
    todayAppointments,
    recentOwners,
    recentPets,
    upcomingAppointments,
  ] = await Promise.all([
    Owner.countDocuments(),
    Pet.countDocuments(),
    Appointment.countDocuments(),
    Appointment.countDocuments({ date: { $gte: start, $lt: end } }),
    Owner.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Pet.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Appointment.find({ date: { $gte: start } })
      .sort({ date: 1, startTime: 1 })
      .limit(5)
      .lean(),
  ]);

  // Resolve owner name for each pet
  const petOwnerIds = [...new Set(recentPets.map((p) => String(p.ownerId)))];
  const petOwners = await Owner.find({ _id: { $in: petOwnerIds } })
    .select('firstName lastName')
    .lean();
  const ownerNameMap = new Map<string, string>();
  for (const owner of petOwners) {
    ownerNameMap.set(String(owner._id), `${owner.firstName} ${owner.lastName}`);
  }

  // Resolve owner and pet names for upcoming appointments
  const apptOwnerIds = [...new Set(upcomingAppointments.map((a) => String(a.ownerId)))];
  const apptPetIds = [...new Set(upcomingAppointments.map((a) => String(a.petId)))];
  const [apptOwners, apptPets] = await Promise.all([
    Owner.find({ _id: { $in: apptOwnerIds } }).select('firstName lastName').lean(),
    Pet.find({ _id: { $in: apptPetIds } }).select('name species').lean(),
  ]);
  const apptOwnerNameMap = new Map<string, string>();
  for (const owner of apptOwners) {
    apptOwnerNameMap.set(String(owner._id), `${owner.firstName} ${owner.lastName}`);
  }
  const apptPetInfoMap = new Map<string, { name: string; species: string }>();
  for (const pet of apptPets) {
    apptPetInfoMap.set(String(pet._id), { name: pet.name, species: pet.species });
  }

  return {
    summary: {
      totalOwners,
      totalPets,
      totalAppointments,
      todayAppointments,
    },
    recentOwners: recentOwners.map((o) => ({
      id: String(o._id),
      firstName: o.firstName,
      lastName: o.lastName,
      email: o.email,
      phoneNumber: o.phoneNumber,
      emergencyContact: (o as any).emergencyContact,
      address: (o as any).address,
      city: (o as any).city,
      state: (o as any).state,
      country: (o as any).country,
      postalCode: (o as any).postalCode,
      preferredContactMethod: (o as any).preferredContactMethod ?? 'email',
      notes: (o as any).notes,
      isActive: (o as any).isActive ?? true,
      createdAt: o.createdAt.toISOString(),
      updatedAt: o.updatedAt.toISOString(),
    })),
    recentPets: recentPets.map((p) => {
      const oid = String(p.ownerId);
      return {
        id: String(p._id),
        ownerId: oid,
        ownerName: ownerNameMap.get(oid) || 'Unknown Owner',
        name: p.name,
        species: p.species as 'dog' | 'cat' | 'bird' | 'rabbit' | 'other',
        breed: p.breed,
        color: p.color,
        dateOfBirth: p.dateOfBirth.toISOString(),
        sex: p.sex as 'male' | 'female',
        isNeutered: p.isNeutered,
        microchipId: (p as any).microchipId,
        weightKg: (p as any).weightKg,
        notes: (p as any).notes,
        isActive: (p as any).isActive ?? true,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      };
    }),
    upcomingAppointments: upcomingAppointments.map((a) => {
      const oid = String(a.ownerId);
      const pid = String(a.petId);
      const petInfo = apptPetInfoMap.get(pid) ?? { name: 'Unknown Pet', species: 'other' };
      return {
        id: String(a._id),
        appointmentNumber: a.appointmentNumber,
        ownerId: oid,
        ownerName: apptOwnerNameMap.get(oid) || 'Unknown Owner',
        petId: pid,
        petName: petInfo.name,
        petSpecies: petInfo.species as 'dog' | 'cat' | 'bird' | 'rabbit' | 'other',
        date: a.date.toISOString(),
        startTime: a.startTime,
        endTime: a.endTime,
        reason: a.reason,
        type: a.type as any,
        status: a.status as any,
        notes: (a as any).notes,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      };
    }),
  };
}