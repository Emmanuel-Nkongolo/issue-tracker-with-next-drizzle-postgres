"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  createIssueSchema,
  updateIssueSchema,
  CreateIssueInput,
} from "@/lib/validators";
import {
  issueDefaultValues,
  priorityOptions,
  statusOptions,
} from "@/lib/constants/index";
import { createIssue, updateIssue } from "@/lib/actions/issue.actions";
import { Issue } from "@/lib/schema";
import { useState, useEffect } from "react";

interface IssueFormProps {
  type: "Create" | "Update";
  issue?: Issue;
  issueId?: string;
}

export default function IssueForm({ type, issue, issueId }: IssueFormProps) {
  const router = useRouter();

  const form = useForm<CreateIssueInput>({
    resolver: zodResolver(
      type === "Create" ? createIssueSchema : updateIssueSchema
    ),
    defaultValues:
      issue && type === "Update"
        ? {
            title: issue.title,
            description: issue.description,
            priority: issue.priority,
            assigneeId: issue.assigneeId || undefined,
          }
        : issueDefaultValues,
  });

  const onSubmit: SubmitHandler<CreateIssueInput> = async (values) => {
    try {
      if (type === "Create") {
        const result = await createIssue(values);

        if (result.success) {
          toast.success("Issue created successfully!");
          router.push("/");
        } else {
          toast.error(result.error || "Failed to create issue");
        }
      }

      if (type === "Update" && issueId) {
        const result = await updateIssue(issueId, values);

        if (result.success) {
          toast.success("Issue updated successfully!");
          router.push("/");
        } else {
          toast.error(result.error || "Failed to update issue");
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Form submission error:", error);
    }
  };

  const [allUsers, setAllUsers] = useState([]);

  // useEffect(() => {
  //   async function fetchUsers() {
  //     const users = await getAllUsers();
  //     setAllUsers(users);
  //   }
  //   fetchUsers();
  // }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Title *
          </label>
          <input
            {...form.register("title")}
            type="text"
            id="title"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter issue title..."
          />
          {form.formState.errors.title && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description *
          </label>
          <textarea
            {...form.register("description")}
            id="description"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the issue in detail..."
          />
          {form.formState.errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        {/* Status */}
        <div>
          <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Status
          </label>
          <select
            {...form.register("status")}
            id="priority"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {form.formState.errors.priority && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.priority.message}
            </p>
          )}
        </div>
        {/* Priority */}
        <div>
          <label
            htmlFor="priority"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Priority
          </label>
          <select
            {...form.register("priority")}
            id="priority"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {priorityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {form.formState.errors.priority && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.priority.message}
            </p>
          )}
        </div>
        {/* AssigneeId */}
        <div className="hidden">
          <label
            htmlFor="assigneeId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            AssigneeId *
          </label>
          <input
            {...form.register("assigneeId")}
            type="text"
            id="assigneeId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter issue assigneeId..."
          />
          {form.formState.errors.assigneeId && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.assigneeId.message}
            </p>
          )}
        </div>
        {/* Assignee
        <div>
          <label
            htmlFor="assigneeId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Assignee *
          </label>
          <select
            {...form.register("assigneeId")}
            id="assigneeId"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an assignee...</option>
            {allUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
          {form.formState.errors.assigneeId && (
            <p className="mt-1 text-sm text-red-600">
              {form.formState.errors.assigneeId.message}
            </p>
          )}
        </div> */}

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {form.formState.isSubmitting
              ? type === "Create"
                ? "Creating..."
                : "Updating..."
              : `${type} Issue`}
          </button>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
