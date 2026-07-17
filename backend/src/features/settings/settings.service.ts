import { Settings } from './settings.model';
import type { SettingsResponse, SettingsUpdate } from './types/index';

/* ------------------------------------------------------------------ */
/*  Service functions                                                  */
/* ------------------------------------------------------------------ */

export async function getSettings(): Promise<SettingsResponse> {
  const settings = await Settings.findOneAndUpdate(
    {},
    { $setOnInsert: {} },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return settings.toJSON() as unknown as SettingsResponse;
}

export async function updateSettings(input: SettingsUpdate): Promise<SettingsResponse> {
  // Build a flat update object for MongoDB
  const update: Record<string, unknown> = {};
  if (input.clinicInfo) {
    for (const [key, value] of Object.entries(input.clinicInfo)) {
      update[`clinicInfo.${key}`] = value;
    }
  }
  if (input.businessHours) {
    for (const [key, value] of Object.entries(input.businessHours)) {
      update[`businessHours.${key}`] = value;
    }
  }
  if (input.appointmentSettings) {
    for (const [key, value] of Object.entries(input.appointmentSettings)) {
      update[`appointmentSettings.${key}`] = value;
    }
  }
  if (input.userPreferences) {
    for (const [key, value] of Object.entries(input.userPreferences)) {
      update[`userPreferences.${key}`] = value;
    }
  }

  const settings = await Settings.findOneAndUpdate(
    {},
    { $set: update },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  return settings.toJSON() as unknown as SettingsResponse;
}