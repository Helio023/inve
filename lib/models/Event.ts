import mongoose, { Schema, Model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid"; 

const TimelineItemSchema = new Schema({
  title: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: String,
  locationName: String,
  address: String,
  mapLink: String,
  description: String,
});

// 2. Módulos de Presentes
const GiftRegistrySchema = new Schema({
  isEnabled: { type: Boolean, default: false },
  pixText: String,
  bankAccounts: [
    {
      bank: String,
      holder: String,
      number: String,
      iban: String,
    },
  ],
  wallets: [
    {
      provider: { type: String, enum: ["M-Pesa", "e-Mola", "M-Kesh"] },
      number: String,
      name: String,
    },
  ],
  externalLinks: [{ label: String, url: String }],
});

// 3. Configuração do RSVP
const RsvpConfigSchema = new Schema({
  deadline: Date,
  allowPlusOne: { type: Boolean, default: false },
  maxGuests: { type: Number, default: 1 },
  askDietary: { type: Boolean, default: false },
  askMusic: { type: Boolean, default: false },
  showGuestList: { type: Boolean, default: false },
});

const EventSettingsSchema = new Schema({
  music: {
    isEnabled: { type: Boolean, default: false },
    url: String,
    autoPlay: { type: Boolean, default: false },
    showControl: { type: Boolean, default: true },
  },
  navigation: {
    direction: { type: String, enum: ["horizontal", "vertical"], default: "horizontal" },
    effect: { type: String, enum: ["slide", "fade"], default: "slide" },
  }
}, { _id: false });

// --- Interface Principal ---
export interface IEvent extends Document {
  agencyId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  eventType: "wedding" | "birthday" | "corporate" | "baby_shower" | "other";
  date: Date;
  hasPaid: boolean;
  
  
  clientName?: string;
  clientEmail?: string;
  managementToken: string; 


  description?: string;
  coverImage?: string;

  designContent: any;

  timeline: any[];
  gifts: any;
  rsvpConfig: any;

  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  views: number;

  settings: {
    music: {
      isEnabled: boolean;
      url?: string;
      autoPlay: boolean;
      showControl: boolean;
    };
  
    navigation?: {
      direction: "horizontal" | "vertical";
      effect: "slide" | "fade";
    };
  };

  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new Schema<IEvent>(
  {
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
      index: true,
    },
    hasPaid: { type: Boolean, default: false },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    
   
    clientName: String,
    clientEmail: String,
    managementToken: { 
      type: String, 
      default: () => uuidv4(), 
      unique: true, 
      index: true 
    },
    

    eventType: {
      type: String,
      enum: ["wedding", "birthday", "corporate", "baby_shower", "other"],
      required: true,
    },
    settings: { type: EventSettingsSchema, default: {} },
    date: { type: Date, required: true },

    description: { type: String },
    coverImage: { type: String },
 
    designContent: { type: Schema.Types.Mixed, default: [] },
    
    timeline: [TimelineItemSchema],
    gifts: { type: GiftRegistrySchema, default: {} },
    rsvpConfig: { type: RsvpConfigSchema, default: {} },

    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
    },

    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Event: Model<IEvent> =
  mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);