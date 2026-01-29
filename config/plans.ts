export const SITE_CONFIG = {
  adminPhone: process.env.NEXT_PUBLIC_ADMIN_PHONE || "258840000000",
  currency: "MZN",
};

export interface PlanDefinition {
  key: string;
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
    description: "Ideal para freelancers. Experimente a plataforma.",
    price: 1199,
    credits: { wedding: 1, birthday: 1, corporate: 0 }, 
    isPopular: false,
  },
  {
    key: "pro",
    name: "Profissional",
    description: "O mais vendido. Expanda o seu negócio.",
    price: 3199,
    credits: { wedding: 3, birthday: 5, corporate: 2 },
    isPopular: true,
  },
  {
    key: "elite",
    name: "Agência Elite",
    description: "Volume alto com suporte prioritário.",
    price: 6199,
    credits: { wedding: 10, birthday: 15, corporate: 10 },
    isPopular: false,
  },
];