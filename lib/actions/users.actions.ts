"use server";

import { signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { db } from "@/lib/drizzle";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { signInFormSchema, signUpFormSchema } from "../validators";
import { formatError } from "../utils";

// Sign in the user with creadentials
export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { success: false, message: "Invalid email or password" };
  }
}

// Sign user out
export async function signOutUser() {
  await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1)
      .then((rows) => rows[0]);

    if (existingUser) {
      return { success: false, message: "User with this email already exists" };
    }

    const plainPassword = user.password;
    user.password = hashSync(user.password, 10);

    // Create user in database
    await db.insert(users).values({
      name: user.name,
      email: user.email,
      password: user.password,
      role: "User",
    });

    // Auto sing in after registration
    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) throw error;

    return { success: false, message: formatError(error) };
  }
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)
    .then((rows) => rows[0]);

  if (!user) throw new Error("User not found");

  return user;
}
