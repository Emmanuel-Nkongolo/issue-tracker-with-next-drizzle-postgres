import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { db } from "@/lib/drizzle";
import { issues, users } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/issues - Get all issues
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const allIssues = await db
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
        assignee: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(issues)
      .leftJoin(users, eq(issues.createdById, users.id))
      .leftJoin(users, eq(issues.assigneeId, users.id))
      .orderBy(desc(issues.createdAt));

    return NextResponse.json({ success: true, data: allIssues });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}

// POST /api/issues - Create a new issue
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, priority, assigneeId } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const [newIssue] = await db
      .insert(issues)
      .values({
        title,
        description,
        priority: priority || "Medium",
        assigneeId: assigneeId || null,
        createdById: session.user.id,
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newIssue },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating issue:", error);
    return NextResponse.json(
      { error: "Failed to create issue" },
      { status: 500 }
    );
  }
}
