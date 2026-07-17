import mongoose, { Schema } from 'mongoose';
import type { IAppointmentDocument } from './types/index';

function generateAppointmentNumber(): string {
  const ts = Date.now().toString(36).slice(-4).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `APT-${ts}${rand}`;
}

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    petId: {
      type: String,
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    endTime: {
      type: String,
      required: true,
      match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    },
    reason: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'consultation', 'surgery', 'vaccination', 'checkup',
        'grooming', 'dental', 'emergency', 'followup', 'other',
      ],
    },
    status: {
      type: String,
      required: true,
      enum: [
        'scheduled', 'confirmed', 'checked-in', 'in-progress',
        'completed', 'cancelled', 'no-show',
      ],
      default: 'scheduled',
    },
    appointmentNumber: {
      type: String,
      required: true,
      unique: true,
      default: generateAppointmentNumber,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 2000,
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

// ---------- Indexes ----------
appointmentSchema.index({ date: 1, startTime: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ ownerId: 1, date: 1 });
appointmentSchema.index({ petId: 1, date: 1 });

export const Appointment = mongoose.model<IAppointmentDocument>('Appointment', appointmentSchema);