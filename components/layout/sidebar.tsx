"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  closeMobileSidebar?: () => void;
}

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Income",
    icon: TrendingUp,
    href: "/income",
    color: "text-emerald-500",
  },
  {
    label: "Expenses",
    icon: TrendingDown,
    href: "/expenses",
    color: "text-rose-500",
  },
  {
    label: "Budget",
    icon: PiggyBank,
    href: "/budget",
    color: "text-violet-500",
  },
];

export function Sidebar({ closeMobileSidebar }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const handleLinkClick = () => {
    if (closeMobileSidebar) {
      closeMobileSidebar();
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-lg">
      {/* User profile section */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
        <Link
          href="/dashboard"
          className="flex items-center mb-6"
          onClick={handleLinkClick}
        >
          <div className="w-8 h-8 mr-2 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">ET</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Expense<span className="text-primary">Tracker</span>
          </h1>
        </Link>

        <div className="flex items-center mt-4">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user?.firstName?.charAt(0) || user?.username?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {user?.fullName || user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {user?.primaryEmailAddress?.emailAddress || ""}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <div className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              onClick={handleLinkClick}
              className={cn(
                "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                pathname === route.href
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              {route.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Footer with sign out button */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-700">
        <SignOutButton>
          <Button
            variant="ghost"
            className="w-full justify-start text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
          >
            <LogOut className="h-5 w-5 mr-3 text-gray-500" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </div>
  );
}
