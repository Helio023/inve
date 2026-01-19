import mongoose, { Schema, Model, Document } from 'mongoose';

// 1. A Interface TypeScript (Tipagem forte)
export interface IAgency extends Document {
  name: string;
  slug: string;
  emailContact: string;
  phone: string;
  type: 'FREELANCER' | 'AGENCY';
  
  location: {
    province: string;
    district: string;
  };
  
  description?: string;
  logoUrl?: string;
  
  // Controle de Acesso e Negócio
  verificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  rejectionReason?: string;
  
  // Carteira de Créditos (Map é melhor que Objeto fixo para expansão futura)
  credits: Map<string, number>; 
  
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// 2. O Schema do Mongoose (Regras do Banco)
const AgencySchema = new Schema<IAgency>({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, index: true },
  
  emailContact: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, required: true },
  
  type: { 
    type: String, 
    enum: ['FREELANCER', 'AGENCY'], 
    required: true 
  },
  
  location: {
    province: { type: String, required: true },
    district: { type: String, required: true },
  },
  
  description: { type: String },
  logoUrl: { type: String },

  verificationStatus: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'], 
    default: 'PENDING',
    index: true // Indexado para facilitar busca de pendentes no Admin
  },
  rejectionReason: String,
  
  credits: {
    type: Map,
    of: Number,
    default: {}
  },

  isActive: { type: Boolean, default: true }
}, { 
  timestamps: true // Cria createdAt e updatedAt automaticamente
});

// 3. Exportação Singleton (Evita erro de recompile no Next.js Hot Reload)
export const Agency: Model<IAgency> = mongoose.models.Agency || mongoose.model<IAgency>('Agency', AgencySchema);