"use client";

import { TrendingUp, TrendingDown } from "lucide-react";

const transactions = [
  {
    id: "1",
    amount: 8500,
    status: "income",
    category: "Freelance",
    date: "2023-03-01",
    description: "Website Development",
  },
  {
    id: "2",
    amount: 2500,
    status: "expense",
    category: "Bills & Recharge",
    date: "2023-03-03",
    description: "Electricity Bill",
  },
  {
    id: "3",
    amount: 1200,
    status: "expense",
    category: "Entertainment",
    date: "2023-03-05",
    description: "Movie Tickets",
  },
  {
    id: "4",
    amount: 15000,
    status: "income",
    category: "Job",
    date: "2023-03-10",
    description: "Salary",
  },
  {
    id: "5",
    amount: 3500,
    status: "expense",
    category: "Traveling",
    date: "2023-03-15",
    description: "Weekend Trip",
  },
];

export function RecentTransactions() {
  return (
    <div className="space-y-8">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <div
            className={`${
              transaction.status === "income" ? "bg-emerald-500" : "bg-rose-500"
            } p-2 rounded-full mr-4`}
          >
            {transaction.status === "income" ? (
              <TrendingUp className="h-4 w-4 text-white" />
            ) : (
              <TrendingDown className="h-4 w-4 text-white" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {transaction.category}
            </p>
          </div>
          <div
            className={`${
              transaction.status === "income"
                ? "text-emerald-500"
                : "text-rose-500"
            } font-medium`}
          >
            {transaction.status === "income" ? "+" : "-"}₹
            {transaction.amount.toLocaleString()}
          </div>
        </div>
      ))}
    </div>
  );
}
