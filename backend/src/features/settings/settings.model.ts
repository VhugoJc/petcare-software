import mongoose, { Schema } from 'mongoose';
import type { ISettingsDocument } from './types/index';

const settingsSchema = new Schema<ISettingsDocument>(
  {
    clinicInfo: {
      clinicName: { type: String, trim: true, maxlength: 200, default: 'PetCare Clinic' },
      phoneNumber: { type: String, trim: true, maxlength: 20, default: '' },
      email: { type: String, trim: true, maxlength: 255, default: '' },
      website: { type: String, trim: true, maxlength: 500 },
      address: { type: String, trim: true, maxlength: 500 },
      logoUrl: { type: String, trim: true, maxlength: 2000 },
    },
    businessHours: {
      openingTime: { type: String, trim: true, default: '09:00' },
      closingTime: { type: String, trim: true, default: '18:00' },
      workingDays: {
        type: [String],
        default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
      },
    },
    appointmentSettings: {
      defaultDuration: { type: Number, default: 30, min: 15, max: 240 },
      appointmentInterval: { type: Number, default: 30, min: 5, max: 120 },
      allowOverlapping: { type: Boolean, default: false },
    },
    userPreferences: {
      language: { type: String, default: 'en' },
      timeZone: { type: String, default: 'UTC' },
      dateFormat: { type: String, default: 'MM/DD/YYYY' },
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: unknown, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Settings = mongoose.model<ISettingsDocument>('Settings', settingsSchema);