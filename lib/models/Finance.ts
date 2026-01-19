import mongoose, { Schema, Model, Document } from "mongoose";

// --- 1. MODELO DE PACOTE (Produto) ---

export interface IPackage extends Document {
  name: string;
  description?: string;
  price: number;
  currency: string;
  credits: Map<string, number>; // Ex: { 'wedding': 5 }
  isActive: boolean;
  isPopular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PackageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    currency: { type: String, default: "MZN" },

    credits: {
      type: Map,
      of: Number,
      required: true,
    },

    isActive: { type: Boolean, default: true },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// --- 2. MODELO DE TRANSAÇÃO (Venda) ---

export interface ITransaction extends Document {
  agencyId: mongoose.Types.ObjectId;
  packageId: mongoose.Types.ObjectId;

  // Snapshot (Dados congelados no momento da compra)
  packageName: string;
  amount: number;
  creditsSnapshot: Map<string, number>;

  status: "PENDING" | "APPROVED" | "REJECTED";
  paymentMethod: "MPESA" | "EMOLA" | "TRANSFER";

  // Detalhes do Pagamento
  referenceId?: string; // Código da transação
  notes?: string;

  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    agencyId: {
      type: Schema.Types.ObjectId,
      ref: "Agency",
      required: true,
      index: true,
    },
    packageId: { type: Schema.Types.ObjectId, ref: "Package", required: true },

    packageName: { type: String, required: true },
    amount: { type: Number, required: true },
    creditsSnapshot: { type: Map, of: Number },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true, // Importante para o Dashboard do Admin
    },

    paymentMethod: {
      type: String,
      enum: ["MPESA", "EMOLA", "TRANSFER"],
      default: "MPESA",
    },

    referenceId: String,
    notes: String,

    approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    approvedAt: Date,
  },
  { timestamps: true }
);

// --- EXPORTAÇÃO (Singleton para Next.js) ---

export const Package: Model<IPackage> =
  mongoose.models.Package || mongoose.model<IPackage>("Package", PackageSchema);
export const Transaction: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
