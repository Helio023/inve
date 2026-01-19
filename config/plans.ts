export const SITE_CONFIG = {
  adminPhone: process.env.NEXT_PUBLIC_ADMIN_PHONE || "258840000000",
  currency: "MZN",
};

export interface PlanDefinition {
  key: string; // Identificador único no código (slug)
  name: string;
  description: string;
  price: number;
  isPopular?: boolean;
  credits: {
    wedding: number;
    birthday: number;
    corporate: number;
    [key: string]: number;
  };
}


export const PLANS: PlanDefinition[] = [
  {
    key: "starter",
    name: "Starter",
    description: "Ideal para freelancers. 1 Convite de qualquer tipo.",
    price: 1199,
    credits: { wedding: 1, birthday: 1, corporate: 1 },
    isPopular: false,
  },
  {
    key: "pro",
    name: "Profissional",
    description: "O mais vendido. 5 Convites para expandir seu negócio.",
    price: 3199,
    credits: { wedding: 5, birthday: 5, corporate: 5 },
    isPopular: true,
  },
  {
    key: "elite",
    name: "Agência Elite",
    description: "Volume alto. 20 Convites com suporte prioritário.",
    price: 6199,
    credits: { wedding: 20, birthday: 20, corporate: 20 },
    isPopular: false,
  },
];