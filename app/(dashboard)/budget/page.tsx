import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BudgetForm } from "@/components/budget/budget-form";
import { BudgetProgress } from "@/components/budget/budget-progress";

export default function BudgetPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Budget Planning</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
            <CardDescription>
              Track your spending against your annual budget
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetProgress />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Set Annual Budget</CardTitle>
            <CardDescription>Set your budget for the year</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
