import type {
  Appointment,
  DashboardKPIs,
  RevenueMonth,
  SpeciesDistribution,
  StaffMember,
  ActivityItem,
} from '../types';

/* ------------------------------------------------------------------ */
/*  Mock data seeded with realistic veterinary clinic information      */
/* ------------------------------------------------------------------ */

export const MOCK_KPIS: DashboardKPIs = {
  appointmentsToday: 24,
  newPatientsToday: 12,
  revenueToday: 8450,
  pendingAlerts: 3,
};

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', time: '09:00', patientName: 'Max', patientSpecies: 'dog', ownerName: 'John Smith', reason: 'Vaccination', veterinarian: 'Dr. Sarah Wilson', status: 'completed' },
  { id: '2', time: '09:30', patientName: 'Luna', patientSpecies: 'cat', ownerName: 'Maria Garcia', reason: 'Surgery — Spay', veterinarian: 'Dr. Sarah Wilson', status: 'in-progress' },
  { id: '3', time: '10:00', patientName: 'Rocky', patientSpecies: 'dog', ownerName: 'David Brown', reason: 'Annual Check-up', veterinarian: 'Dr. James Chen', status: 'checked-in' },
  { id: '4', time: '10:30', patientName: 'Bella', patientSpecies: 'cat', ownerName: 'Emma Davis', reason: 'Grooming', veterinarian: 'Emily Martinez', status: 'confirmed' },
  { id: '5', time: '11:00', patientName: 'Charlie', patientSpecies: 'bird', ownerName: 'Robert Wilson', reason: 'Wing Clipping', veterinarian: 'Dr. James Chen', status: 'confirmed' },
  { id: '6', time: '11:30', patientName: 'Daisy', patientSpecies: 'dog', ownerName: 'Lisa Anderson', reason: 'Dental Cleaning', veterinarian: 'Dr. Sarah Wilson', status: 'confirmed' },
  { id: '7', time: '13:00', patientName: 'Oliver', patientSpecies: 'cat', ownerName: 'Michael Taylor', reason: 'Urinary Infection', veterinarian: 'Dr. James Chen', status: 'confirmed' },
  { id: '8', time: '14:00', patientName: 'Milo', patientSpecies: 'rabbit', ownerName: 'Sophia Martinez', reason: 'Nail Trimming', veterinarian: 'Emily Martinez', status: 'confirmed' },
];

export const MOCK_REVENUE: RevenueMonth[] = [
  { month: 'Jan', value: 28500 },
  { month: 'Feb', value: 31200 },
  { month: 'Mar', value: 29800 },
  { month: 'Apr', value: 34500 },
  { month: 'May', value: 37800 },
  { month: 'Jun', value: 36200 },
];

export const MOCK_SPECIES: SpeciesDistribution[] = [
  { species: 'dog', count: 248 },
  { species: 'cat', count: 100 },
  { species: 'bird', count: 32 },
  { species: 'other', count: 20 },
];

export const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'Dr. Sarah Wilson', role: 'veterinarian', isOnline: true, patientsAttended: 5 },
  { id: '2', name: 'Dr. James Chen', role: 'veterinarian', isOnline: true, patientsAttended: 3 },
  { id: '3', name: 'Dr. Emily Park', role: 'veterinarian', isOnline: false, patientsAttended: 0 },
  { id: '4', name: 'Emily Martinez', role: 'receptionist', isOnline: true, patientsAttended: 7 },
  { id: '5', name: 'Mark Johnson', role: 'receptionist', isOnline: true, patientsAttended: 4 },
];

export const MOCK_ACTIVITY: ActivityItem[] = [
  { id: '1', icon: '🐾', text: 'Bella checked in for grooming by Emily Martinez', timestamp: '2 minutes ago' },
  { id: '2', icon: '💰', text: 'Invoice #1024 paid — $450.00', timestamp: '15 minutes ago' },
  { id: '3', icon: '🐱', text: 'New patient: Whiskers registered by Dr. Chen', timestamp: '1 hour ago' },
  { id: '4', icon: '📋', text: 'Appointment completed: Max — Vaccination', timestamp: '2 hours ago' },
  { id: '5', icon: '💊', text: 'Prescription refilled for Luna — Metronidazole', timestamp: '3 hours ago' },
  { id: '6', icon: '📄', text: 'Lab results received for Rocky — Blood work', timestamp: '4 hours ago' },
  { id: '7', icon: '🐕', text: 'Follow-up scheduled for Charlie — Next Tuesday', timestamp: '5 hours ago' },
  { id: '8', icon: '🔔', text: 'Invoice #1023 is overdue — $230.00', timestamp: '6 hours ago' },
];

/* Total used for percentage calculation */
export const MOCK_SPECIES_TOTAL = MOCK_SPECIES.reduce((sum, s) => sum + s.count, 0);