"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/drizzle";
import { issues, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { IssueStatus, IssuePriority } from "@/types";
import {
  createIssueSchema,
  updateIssueSchema,
  CreateIssueInput,
} from "@/lib/validators";

// Get all issues with creator info
export async function getIssues(statusFilter?: IssueStatus) {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  let query = db
    .select({
      id: issues.id,
      title: issues.title,
      description: issues.description,
      status: issues.status,
      priority: issues.priority,
      createdAt: issues.createdAt,
      updatedAt: issues.updatedAt,
      createdBy: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(issues)
    .leftJoin(users, eq(issues.createdById, users.id))
    .innerJoin(createdBy, eq(issues.createdById, createdBy.id))
    .orderBy(desc(issues.createdAt));

  // Add status filter if provided
  if (statusFilter) {
    query = query.where(eq(issues.status, statusFilter));
  }

  return await query;
}

// Create new issue with form validation
export async function createIssue(data: CreateIssueInput) {
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Validate the input data
    const validatedData = createIssueSchema.parse(data);

    const [newIssue] = await db
      .insert(issues)
      .values({
        title: validatedData.title,
        description: validatedData.description,
        priority: validatedData.priority,
        status: "Open",
        createdById: session.user.id,
        assigneeId: validatedData.assigneeId || null,
      })
      .returning();

    revalidatePath("/");
    return { success: true, data: newIssue };
  } catch (error) {
    console.error("Create issue error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create issue",
    };
  }
}

// Get issue by its Id
export async function getIssueById(issueId: string) {
  try {
    const data = await db.query.issues.findFirst({
      where: eq(issues.id, issueId),
      with: {
        createdBy: {
          columns: {
            name: true,
            email: true,
          },
        },
        assignee: {
          columns: {
            name: true,
            email: true,
          },
        },
      },
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}

// Update issue with form validation
export async function updateIssue(
  issueId: string,
  data: Partial<CreateIssueInput>
) {
  const session = await auth();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Validate the input data
    const validatedData = updateIssueSchema.parse({ id: issueId, ...data });

    const [updatedIssue] = await db
      .update(issues)
      .set({
        ...(validatedData.title && { title: validatedData.title }),
        ...(validatedData.description && {
          description: validatedData.description,
        }),
        ...(validatedData.priority && { priority: validatedData.priority }),
        updatedAt: new Date(),
      })
      .where(eq(issues.id, issueId))
      .returning();

    revalidatePath("/");
    return { success: true, data: updatedIssue };
  } catch (error) {
    console.error("Update issue error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update issue",
    };
  }
}

// Update issue status (quick action)
export async function updateIssueStatusAndPriority(
  issueId: string,
  status: IssueStatus,
  priority: IssuePriority
) {
  const session = await auth();

  if (!session) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const [updatedIssue] = await db
      .update(issues)
      .set({
        status,
        priority,
        updatedAt: new Date(),
      })
      .where(eq(issues.id, issueId))
      .returning();

    revalidatePath("/");
    return { success: true, data: updatedIssue };
  } catch (error) {
    console.error("Update status error:", error);
    return {
      success: false,
      error: "Failed to update issue status",
    };
  }
}

// Delete issue (admin only)
export async function deleteIssue(issueId: string) {
  const session = await auth();

  if (!session || session.user?.role !== "Admin") {
    return { success: false, error: "Unauthorized - Admin access required" };
  }

  try {
    await db.delete(issues).where(eq(issues.id, issueId));
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Delete issue error:", error);
    return {
      success: false,
      error: "Failed to delete issue",
    };
  }
}

// Legacy: Create new issue (old FormData version - keeping for backward compatibility)
// export async function createIssue(formData: FormData) {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     throw new Error('Unauthorized');
//   }

//   const title = formData.get('title') as string;
//   const description = formData.get('description') as string;
//   const priority = (formData.get('priority') as IssuePriority) || 'Medium';

//   if (!title || !description) {
//     throw new Error('Title and description are required');
//   }

//   try {
//     await db.insert(issues).values({
//       title,
//       description,
//       priority,
//       status: 'Open',
//       createdById: session.user.id,
//     });

//     revalidatePath('/');
//     redirect('/');
//   } catch (error) {
//     throw new Error('Failed to create issue');
//   }
// }
