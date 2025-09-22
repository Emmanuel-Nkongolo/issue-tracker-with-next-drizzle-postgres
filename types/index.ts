export type IssueStatus = "Open" | "In-progress" | "Closed";
export type IssuePriority = "Low" | "Medium" | "High";
export type UserRole = "Admin" | "User";

export interface CreateIssueData {
  title: string;
  description?: string;
  priority?: IssuePriority;
  assigneeId?: string;
}

export interface UpdateIssueData {
  title?: string;
  description?: string;
  status?: IssueStatus;
  priority?: IssuePriority;
  assigneeId?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface IssueWithCreator {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  priority: IssuePriority;
  createdAt: Date | null;
  updatedAt: Date | null;
  createdBy: {
    id: string;
    name: string;
    email: string;
  } | null;
}
