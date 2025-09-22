"use client";

import { useState } from "react";
import Link from "next/link";
import { IssueWithCreator, IssueStatus } from "@/types";
// import { IssueCard } from './IssueCard';
import { Plus, Filter } from "lucide-react";
import { IssueCard } from "./issue-card";

interface IssuesDashboardProps {
  issues: IssueWithCreator[];
  userRole?: string;
}

export function IssuesDashboard({ issues, userRole }: IssuesDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "All">("All");

  //   const filteredIssues = statusFilter === 'All'
  //     ? issues
  //     : issues.filter(issue => issue.status === statusFilter);
  const filteredIssues = true;

  const statusCounts = {
    All: issues.length,
    Open: issues.filter((i) => i.status === "Open").length,
    "In-progress": issues.filter((i) => i.status === "In-progress").length,
    Closed: issues.filter((i) => i.status === "Closed").length,
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Issues Dashboard</h2>
          <p className="text-gray-600 mt-1">
            Manage and track all project issues
          </p>
        </div>
        <Link
          href="/issues/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create Issue
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {Object.entries(statusCounts).map(([status, count]) => (
          <div
            key={status}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              statusFilter === status
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setStatusFilter(status as IssueStatus | "All")}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{status}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
              <div
                className={`p-2 rounded-full ${
                  status === "Open"
                    ? "bg-red-100 text-red-600"
                    : status === "In-progress"
                    ? "bg-yellow-100 text-yellow-600"
                    : status === "Closed"
                    ? "bg-green-100 text-green-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <Filter className="h-4 w-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Info */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-500">
          Showing {filteredIssues} of {issues.length} issues
          {/* Showing {filteredIssues.length} of {issues.length} issues */}
        </span>
        {statusFilter !== "All" && (
          <button
            onClick={() => setStatusFilter("All")}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Clear filter
          </button>
        )}
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* {filteredIssues.length > 0 ? (
          filteredIssues.map((issue) => (
            // <IssueCard 
            //   key={issue.id} 
            //   issue={issue} 
            //   userRole={userRole}
            // />
          )) */}
        <IssueCard key={1} issue={issues} />
        {filteredIssues ? (
          <div>issues are displayed here</div>
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">
              {statusFilter === "All"
                ? "No issues found. Create your first issue!"
                : `No ${statusFilter.toLowerCase()} issues found.`}
            </p>
            {statusFilter === "All" && (
              <Link
                href="/issues/create"
                className="inline-flex items-center gap-2 mt-4 text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" />
                Create your first issue
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
