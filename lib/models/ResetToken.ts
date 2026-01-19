import mongoose, { Schema, Model, Document } from 'mongoose';

export interface IResetToken extends Document {
  email: string;
  token: string;
  expires: Date;
}

const ResetTokenSchema = new Schema<IResetToken>({
  email: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  expires: { type: Date, required: true }
});

ResetTokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

export const ResetToken: Model<IResetToken> = 
  mongoose.models.ResetToken || mongoose.model<IResetToken>('ResetToken', ResetTokenSchema);