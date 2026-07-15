import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import type { IUserDocument } from './types/index';

const SALT_ROUNDS = 12;

const userSchema = new Schema<IUserDocument>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'veterinarian', 'receptionist'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc: any, ret: Record<string, unknown>) {
        ret.id = String(ret._id);
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      },
    },
  }
);

// ---------- Indexes ----------
// email unique index is created automatically by `unique: true` in schema
userSchema.index({ role: 1 });

// ---------- Pre-save hook: hash password ----------
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
});

// ---------- Instance method: compare password ----------
userSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUserDocument>('User', userSchema);