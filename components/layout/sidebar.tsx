"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  IndianRupee,
  DollarSign,
  CreditCard,
  LayoutDashboard,
  TrendingDown,
  PiggyBank,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  closeMobileSidebar?: () => void;
}

const routes = [
  {
    label: "Dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Income",
    icon: <IndianRupee className="h-5 w-5" />,
    href: "/income",
    color: "text-emerald-500",
  },
  {
    label: "Expenses",
    icon: <TrendingDown className="h-5 w-5" />,
    href: "/expenses",
    color: "text-rose-500",
  },
  {
    label: "Budget",
    icon: <PiggyBank className="h-5 w-5" />,
    href: "/budget",
    color: "text-violet-500",
  },
];

export function Sidebar({ closeMobileSidebar }: SidebarProps) {
  const pathname = usePathname();

  const handleLinkClick = () => {
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white/80 dark:bg-zinc-900/90 backdrop-blur-sm border-r border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
      {/* Mobile close button */}
      {closeMobileSidebar && (
        <div className="absolute top-4 right-4 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeMobileSidebar}
            className="rounded-full h-8 w-8 bg-white/90 dark:bg-zinc-800/90 shadow-sm hover:shadow-md transition-all"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Logo */}
      <div className="px-6 py-8">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">ET</span>
          </div>
          <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 truncate">
            <span className="hidden sm:inline">Expense</span>
            <span className="sm:hidden">E</span>
            <span className="text-primary">Tracker</span>
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-4 py-6">
        <div className="space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center gap-x-3 text-sm font-medium px-4 py-3 rounded-xl transition-all",
                pathname === route.href
                  ? "bg-primary/10 text-primary shadow-sm"
                  : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100/80 dark:hover:bg-zinc-800/60 hover:shadow-sm"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg",
                  pathname === route.href
                    ? "bg-primary/10"
                    : "bg-zinc-100 dark:bg-zinc-800"
                )}
              >
                <div className={cn("shrink-0", route.color)}>{route.icon}</div>
              </div>
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
