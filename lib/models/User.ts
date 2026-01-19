import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  role: 'SUPER_ADMIN' | 'AGENCY_OWNER' | 'AGENCY_MEMBER';
  agencyId?: mongoose.Types.ObjectId; // Referência à Agência
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false }, // select: false protege a senha de vazar em queries
  image: { type: String },
  
  role: { 
    type: String, 
    enum: ['SUPER_ADMIN', 'AGENCY_OWNER', 'AGENCY_MEMBER'], 
    default: 'AGENCY_OWNER' 
  },
  
  agencyId: { type: Schema.Types.ObjectId, ref: 'Agency', index: true },
}, { timestamps: true });

export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);