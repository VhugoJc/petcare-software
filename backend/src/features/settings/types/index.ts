import type { Document } from 'mongoose';

/* ------------------------------------------------------------------ */
/*  Core entity                                                        */
/* ------------------------------------------------------------------ */

export interface IClinicInfo {
  clinicName: string;
  phoneNumber: string;
  email: string;
  website?: string;
  address?: string;
  logoUrl?: string;
}

export interface IBusinessHours {
  openingTime: string;
  closingTime: string;
  workingDays: string[];
}

export interface IAppointmentSettings {
  defaultDuration: number;
  appointmentInterval: number;
  allowOverlapping: boolean;
}

export interface IUserPreferences {
  language: string;
  timeZone: string;
  dateFormat: string;
}

export interface ISettings {
  clinicInfo: IClinicInfo;
  businessHours: IBusinessHours;
  appointmentSettings: IAppointmentSettings;
  userPreferences: IUserPreferences;
}

export interface ISettingsDocument extends ISettings, Document {}

/* ------------------------------------------------------------------ */
/*  DTOs                                                               */
/* ------------------------------------------------------------------ */

export type SettingsResponse = ISettings;

export interface SettingsUpdate {
  clinicInfo?: Partial<IClinicInfo>;
  businessHours?: Partial<IBusinessHours>;
  appointmentSettings?: Partial<IAppointmentSettings>;
  userPreferences?: Partial<IUserPreferences>;
}