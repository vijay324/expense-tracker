"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeProvider } from "next-themes";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="h-full relative bg-gray-50 dark:bg-gray-900">
        {/* Mobile sidebar toggle */}
        <div className="md:hidden fixed top-4 left-4 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-full bg-white shadow-md border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            {isSidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Mobile sidebar overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Navbar */}
        <Navbar />

        {/* Sidebar */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
            md:translate-x-0 md:static md:z-0 md:w-72 md:flex md:flex-col
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <Sidebar closeMobileSidebar={() => setIsSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <main className="min-h-screen md:pl-72 pt-16 transition-all duration-300 ease-in-out">
          <div className="h-full p-4 md:p-6">{children}</div>
        </main>
      </div>
    </ThemeProvider>
  );
}
