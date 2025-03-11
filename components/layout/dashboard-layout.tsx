"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Sidebar } from "@/components/layout/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { Toaster } from "react-hot-toast";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    // Initial check
    checkIsMobile();

    // Handle resize
    const handleResize = () => {
      checkIsMobile();
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-full relative bg-zinc-50 dark:bg-black">
        {/* Sidebar - Only one instance that changes position based on screen size */}
        <div
          className={cn(
            "fixed inset-y-0 z-40 w-72 transform transition-transform duration-300 ease-in-out",
            isMobile
              ? isSidebarOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0 lg:w-64 xl:w-72"
          )}
        >
          <Sidebar closeMobileSidebar={() => setIsSidebarOpen(false)} />
        </div>

        {/* Overlay */}
        {isSidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div
          className={cn(
            "min-h-screen flex flex-col transition-all duration-300",
            isMobile ? "pl-0" : "lg:pl-64 xl:pl-72"
          )}
        >
          <Navbar toggleSidebar={toggleSidebar} isMobile={isMobile} />
          <main className="flex-1 pt-16 md:px-4 lg:px-8 pb-8">
            <div className="max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
