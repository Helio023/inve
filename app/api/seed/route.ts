import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Package } from "@/lib/models/Finance";
import { PLANS } from "@/config/plans";

export async function GET() {
  try {
    await connectDB();

    // Removemos pacotes antigos para evitar duplicatas ou dados velhos
    await Package.deleteMany({});

    for (const plan of PLANS) {
      await Package.create({
        ...plan,
        currency: "MZN",
        isActive: true // Força que esteja visível
      });
    }

    return NextResponse.json({ message: "✅ Pacotes recriados com sucesso!" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}