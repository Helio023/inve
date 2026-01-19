import mongoose, { Schema, Model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IGuest extends Document {
  eventId: mongoose.Types.ObjectId;
  agencyId: mongoose.Types.ObjectId;
  name: string;
  phone?: string;
  email?: string;
  inviteToken: string;
  hasOpened: boolean;
  status: "PENDING" | "CONFIRMED" | "DECLINED";
  confirmedAdults: number;
  confirmedKids: number;

  // --- CAMPO QUE FALTAVA ---
  maxAllowedGuests: number;

  dietaryNotes?: string;
  songRequest?: string;
  messageToHosts?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GuestSchema = new Schema<IGuest>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
    agencyId: { type: Schema.Types.ObjectId, ref: "Agency", required: true },
    name: { type: String, required: true },
    phone: String,
    email: String,
    inviteToken: {
      type: String,
      unique: true,
      default: () => uuidv4().slice(0, 8),
    },
    hasOpened: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "DECLINED"],
      default: "PENDING",
    },
    confirmedAdults: { type: Number, default: 0 },
    confirmedKids: { type: Number, default: 0 },

    // --- CAMPO ADICIONADO ---
    maxAllowedGuests: { type: Number, default: 1 },

    dietaryNotes: String,
    songRequest: String,
    messageToHosts: String,
  },
  { timestamps: true }
);

export const Guest: Model<IGuest> =
  mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema);
