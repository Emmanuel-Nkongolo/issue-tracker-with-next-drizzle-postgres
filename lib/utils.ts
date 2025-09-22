import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import z from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format error helper function
export function formatError(error: any): string {
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || "Validation failed";
  }
  if (error.code === "23505") {
    // PostgreSQL unique constraint violation
    return "User with this email already exists";
  }
  return error.message || "Something went wrong";
}
