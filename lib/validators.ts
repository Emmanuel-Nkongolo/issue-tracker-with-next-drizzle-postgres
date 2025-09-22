import { z } from "zod";

// Validation schemas
export const signInFormSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const createIssueSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters"),
  priority: z.enum(["Low", "Medium", "High"]).default("Medium"),
  assigneeId: z.string().optional(),
});

export const updateIssueSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(1, "Title is required")
    .max(200, "Title must be less than 200 characters")
    .optional(),
  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be less than 2000 characters")
    .optional(),
  status: z.enum(["Open", "In-progress", "Closed"]).optional(),
  priority: z.enum(["Low", "Medium", "High"]).optional(),
  assigneeId: z.string().optional(),
  createdById: z.string().optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
