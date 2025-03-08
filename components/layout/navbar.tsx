"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { UserButton } from "@clerk/nextjs";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering theme toggle after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <nav className="fixed top-0 right-0 left-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 h-16 flex items-center justify-end md:justify-end md:left-72">
      <div className="flex items-center gap-4">
        {/* Theme toggle button */}
        {mounted && (
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full h-9 w-9 border-gray-200 dark:border-gray-700"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        )}

        {/* User avatar/button */}
        <div className="h-9 w-9">
          <UserButton
            afterSignOutUrl="/sign-in"
            appearance={{
              elements: {
                userButtonAvatarBox: cn(
                  "h-9 w-9 border border-gray-200 dark:border-gray-700 rounded-full"
                ),
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
};
