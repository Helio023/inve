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
  arrivedAdults: number;
  arrivedKids: number;
  maxAllowedChildren: number;

  maxAllowedGuests: number;
  validUntil?: Date;

  tableName?: string;
  sessionLabel?: string;

  menuChoices?: { section: string; item: string }[];
  songRequests: string[];

  dietaryNotes?: string;
  songRequest?: string;
  messageToHosts?: string;
  checkedIn: boolean;
  checkedInAt?: Date;
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
    maxAllowedChildren: { type: Number, default: 0 },
    confirmedKids: { type: Number, default: 0 },

    maxAllowedGuests: { type: Number, default: 1 },
    validUntil: { type: Date },
    songRequests: { type: [String], default: [] },

    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },

    arrivedAdults: { type: Number, default: 0 },
    arrivedKids: { type: Number, default: 0 },

    tableName: String,
    sessionLabel: String,

    menuChoices: [
      {
        section: String,
        item: String,
        _id: false,
      },
    ],

    dietaryNotes: String,
    songRequest: String,
    messageToHosts: String,
  },
  { timestamps: true },
);

export const Guest: Model<IGuest> =
  mongoose.models.Guest || mongoose.model<IGuest>("Guest", GuestSchema);
