import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: 'SUPER_ADMIN' | 'AGENCY_OWNER' | 'AGENCY_MEMBER';
      agencyId?: string;
    } & DefaultSession["user"];
  }

  interface User {
    role: 'SUPER_ADMIN' | 'AGENCY_OWNER' | 'AGENCY_MEMBER';
    agencyId?: string;
  }
}