import { Owner } from '../owners/owners.model';
import { Pet } from '../pets/pets.model';
import { Appointment } from '../appointments/appointments.model';
import type { DashboardResponse } from './types/index';
import type { OwnerResponse } from '../owners/types/index';
import type { AppointmentResponse } from '../appointments/types/index';

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
      emergencyContact: o.emergencyContact as string | undefined,
      address: o.address as string | undefined,
      city: o.city as string | undefined,
      state: o.state as string | undefined,
      country: o.country as string | undefined,
      postalCode: o.postalCode as string | undefined,
      preferredContactMethod: (o.preferredContactMethod ?? 'email') as OwnerResponse['preferredContactMethod'],
      notes: o.notes as string | undefined,
      isActive: (o.isActive ?? true) as boolean,
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
        microchipId: p.microchipId as string | undefined,
        weightKg: p.weightKg as number | undefined,
        notes: p.notes as string | undefined,
        isActive: (p.isActive ?? true) as boolean,
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
        type: a.type as AppointmentResponse['type'],
        status: a.status as AppointmentResponse['status'],
        notes: a.notes as string | undefined,
        createdAt: a.createdAt.toISOString(),
        updatedAt: a.updatedAt.toISOString(),
      };
    }),
  };
}