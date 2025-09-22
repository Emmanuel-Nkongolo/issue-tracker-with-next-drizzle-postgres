import { email } from "zod";
import { CreateIssueInput } from "../validators";

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Issue-Tracker";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern issue tracking app that helps you manage issues, assign them to team members, and efficiently manage your team.";

export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const issueDefaultValues: CreateIssueInput = {
  title: "",
  description: "",
  priority: "Medium",
  assigneeId: undefined,
};

export const priorityOptions = [
  { value: "Low", label: "Low", color: "bg-gray-100 text-gray-800" },
  { value: "Medium", label: "Medium", color: "bg-yellow-100 text-yellow-800" },
  { value: "High", label: "High", color: "bg-red-100 text-red-800" },
] as const;

export const statusOptions = [
  { value: "Open", label: "Open", color: "bg-red-100 text-red-800" },
  {
    value: "In-progress",
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800",
  },
  { value: "Closed", label: "Closed", color: "bg-green-100 text-green-800" },
] as const;

export const signInDefultValues = {
  email: "",
  password: "",
};

export const signUpDefultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};
