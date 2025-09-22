import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, User } from "lucide-react";
import Link from "next/link";

// Define the Issue type - adjust according to your data structure
interface Issue {
  id: string;
  title: string;
  description?: string;
  status: "open" | "in-progress" | "closed" | "pending";
  priority: "low" | "medium" | "high" | "critical";
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  reporter?: {
    id: string;
    name: string;
    avatar?: string;
  };
  createdAt: string | Date;
  updatedAt?: string | Date;
  labels?: string[];
}

interface IssueCardProps {
  issue: Issue;
}

const statusColors = {
  open: "bg-green-100 text-green-800 border-green-200",
  "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export function IssueCard({ issue }: IssueCardProps) {
  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 cursor-pointer">
      <Link href={`/issues/${issue.id}`} className="block">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                {issue.title}
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 mt-1">
                #{issue.id}
              </CardDescription>
            </div>
            <div className="flex gap-2 ml-4">
              <Badge variant="outline" className={statusColors[issue.status]}>
                {/* {issue.status.replace("-", " ")} */}hi there
              </Badge>
              <Badge
                variant="secondary"
                className={priorityColors[issue.priority]}
              >
                {issue.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {issue.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {issue.description}
            </p>
          )}

          {issue.labels && issue.labels.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {issue.labels.map((label, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  {label}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              {issue.assignee && (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage
                      src={issue.assignee.avatar}
                      alt={issue.assignee.name}
                    />
                    <AvatarFallback className="text-xs">
                      {getInitials(issue.assignee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs">
                    Assigned to {issue.assignee.name}
                  </span>
                </div>
              )}

              {!issue.assignee && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-xs">Unassigned</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4" />
              <span className="text-xs">{formatDate(issue.createdAt)}</span>
            </div>
          </div>

          {issue.reporter && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <Avatar className="w-5 h-5">
                <AvatarImage
                  src={issue.reporter.avatar}
                  alt={issue.reporter.name}
                />
                <AvatarFallback className="text-xs">
                  {getInitials(issue.reporter.name)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">
                Reported by {issue.reporter.name}
              </span>
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
