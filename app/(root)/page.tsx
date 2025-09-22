import { redirect } from "next/navigation";
import { getIssues } from "@/lib/actions/issue.actions";
import { IssuesDashboard } from "../../components/issues-dashboard";

export default async function Home() {
  // const session = await auth()
  const allIssues = await getIssues();

  return (
    <div className="">
      <IssuesDashboard issues={allIssues} />
    </div>
  );
}
