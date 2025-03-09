export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div className="flex-1 p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome to Expense Tracker
        </h2>
      </div>
      <p className="mb-4">
        Please use the sidebar to navigate to different sections of the
        application.
      </p>
      <p className="mb-4">
        You can view your dashboard, manage income and expenses, or generate
        reports.
      </p>
      <div className="mt-8">
        <a
          href="/dashboard"
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Go to Dashboard
        </a>
      </div>
    </div>
  );
}
