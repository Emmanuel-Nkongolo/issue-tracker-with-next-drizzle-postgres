import { DefaultSession } from "next-auth";

declare module "next-auth" {
  export interface Session {
    user: {
      role: string;
      id: string;
    } & DefaultSession["user"];
  }

  export interface User {
    id: string;
    email: string;
    name: string;
    role: string;
  }
}

declare module "next-auth/jwt" {
  export interface JWT {
    id: string;
    role: string;
    name: string;
  }
}
