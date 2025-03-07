import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IncomeForm } from "@/components/income/income-form";
import { IncomeList } from "@/components/income/income-list";

export default function IncomePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Income</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Income List</CardTitle>
            <CardDescription>
              View and manage your income entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeList />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Add Income</CardTitle>
            <CardDescription>Add a new income entry</CardDescription>
          </CardHeader>
          <CardContent>
            <IncomeForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
