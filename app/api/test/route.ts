import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { issues, users } from "@/lib/schema";
import { eq } from "drizzle-orm";

// POST /api/issues/test - Create issue without auth (for testing)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, priority, createdByEmail } = body;

    if (!title || !description || !createdByEmail) {
      return NextResponse.json(
        { error: "Title, description, and createdByEmail are required" },
        { status: 400 }
      );
    }

    // Find the user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, createdByEmail))
      .limit(1);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create the issue
    const [newIssue] = await db
      .insert(issues)
      .values({
        title,
        description,
        priority: priority || "Medium",
        createdById: user.id,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: newIssue,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating test issue:", error);
    return NextResponse.json(
      { error: "Failed to create issue" },
      { status: 500 }
    );
  }
}

// GET /api/issues/test - Get all issues without auth (for testing)
export async function GET() {
  try {
    const allIssues = await db
      .select({
        issue: issues,
        createdBy: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(issues)
      .leftJoin(users, eq(issues.createdById, users.id));

    return NextResponse.json({
      success: true,
      data: allIssues,
    });
  } catch (error) {
    console.error("Error fetching issues:", error);
    return NextResponse.json(
      { error: "Failed to fetch issues" },
      { status: 500 }
    );
  }
}
