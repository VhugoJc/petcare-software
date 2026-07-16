import mongoose, { Schema } from 'mongoose';
import type { IPetDocument } from './types/index';

const petSchema = new Schema<IPetDocument>(
  {
    ownerId: {
      type: String,
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    species: {
      type: String,
      required: true,
      enum: ['dog', 'cat', 'bird', 'rabbit', 'other'],
    },
    breed: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    color: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    sex: {
      type: String,
      required: true,
      enum: ['male', 'female'],
    },
    isNeutered: {
      type: Boolean,
      required: true,
      default: false,
    },
    microchipId: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    weightKg: {
      type: Number,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    isActive: {
      type: Boolean,
      default: true,
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
petSchema.index({ name: 1 });
petSchema.index({ species: 1 });
petSchema.index({ isActive: 1 });

export const Pet = mongoose.model<IPetDocument>('Pet', petSchema);