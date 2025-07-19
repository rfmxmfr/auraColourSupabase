
import { KanbanBoard } from "@/components/admin/KanbanBoard";

export default function AdminDashboardPage() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Submissions Dashboard</h1>
      </div>
      <div
        className="flex flex-1 items-start justify-center rounded-lg border border-dashed shadow-sm p-4"
        x-chunk="dashboard-02-chunk-1"
      >
        <KanbanBoard />
      </div>
    </>
  );
}
