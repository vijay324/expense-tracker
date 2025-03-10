"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
  isMobile: boolean;
}

export function Navbar({ toggleSidebar, isMobile }: NavbarProps) {
  const pathname = usePathname();
  const { user } = useUser();

  // Get page title from pathname
  const getPageTitle = () => {
    const path = pathname.split("/")[1];
    if (!path) return "Dashboard";
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-30 bg-white/45 dark:bg-zinc-900/40 backdrop-blur-xs border-b border-zinc-200/50 dark:border-zinc-800/50 px-4 lg:px-6">
      <div className="h-full flex items-center justify-between">
        {/* Left section - Page Title (visible on desktop) */}
        <div className="flex items-center">
          <div className="hidden lg:flex items-center">
            <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
              {getPageTitle()}
            </h1>
          </div>

          {/* Mobile brand */}
          <div className="flex lg:hidden items-center">
            <div className="w-8 h-8 mr-2 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-lg">SF</span>
            </div>
            <h1 className="text-lg font-bold">
              <span className="hidden xs:inline bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                Financial
              </span>
              {/* <span className="xs:hidden bg-clip-text text-transparent bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400">
                F
              </span> */}
              <span className="text-primary">Tracker</span>
            </h1>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center space-x-3">
          {/* Mobile menu toggle - only visible on mobile */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-9 w-9 rounded-full hover:shadow-sm"
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}

          {/* Theme toggle */}
          <div className=" rounded-full hover:shadow-sm">
            <ModeToggle />
          </div>

          {/* User button */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox:
                  "h-11 w-11 border-2 border-white dark:border-zinc-900 shadow-sm hover:shadow-md transition-shadow rounded-full",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
