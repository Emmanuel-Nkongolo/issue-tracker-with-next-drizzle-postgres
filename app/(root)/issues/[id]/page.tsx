import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getIssueById } from "@/lib/actions/issue.actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Toaster } from "sonner";
import IssueForm from "@/components/issue-form";

export default async function UpdateIssuePage(props: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await props.params;
  const issue = await getIssueById(id);

  if (!issue) return "not found";
  //   const session = await getServerSession(auth);

  //   if (!session) {
  //     redirect('/auth/signin');
  //   }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Create New Issue
            </h1>
            <p className="text-gray-600 mt-1">
              Fill out the form below to create a new issue
            </p>
          </div>

          <IssueForm type="Update" issue={issue} issueId={issue.id} />
        </div>
      </div>
    </div>
  );
}
