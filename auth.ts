import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "./lib/drizzle";
import { users } from "./lib/schema";
import { eq } from "drizzle-orm";
import { compareSync } from "bcrypt-ts-edge/browser";

export const authOptions: NextAuthConfig = {
  adapter: DrizzleAdapter(db) as any,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Find user in database
          const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1);

          if (!user) return null;

          const isMatch = compareSync(
            credentials.password as string,
            user.password
          );

          if (!isMatch) return null;

          //   If password is correct, them return a user object
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error("Auth error: ", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token, user, trigger }: any) => {
      if (token && session.user) {
        session.user.id = token.sub; //|| token.id;
        session.user.role = token.role;
        session.user.name = token.name;
      }

      // //   If there is an update, set the user name
      // if (trigger === "update") {
      //   session.user.name = user.name;
      // }
      return session;
    },
    jwt: async ({ user, token, trigger, session }: any) => {
      // Assign user fields to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      //   If user has no name then use the email
      if (user.name === "NO_NAME") {
        token.name = user.email!.split("@")[0];

        // Update the database to reflect the token name as well
        await db.update(users).set(user).where(eq(user.id, token.name));
      }

      // Handle session update
      if (session?.user.name && trigger === "update") {
        token.name = session.user.name;
      }

      return token;
    },
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 7 * 24 * 60 * 60, // valid for 7 days
  },
  pages: {
    signIn: "/sign-in",
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
