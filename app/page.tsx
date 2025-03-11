"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { redirect } from "next/navigation";

export default function Page() {
  const { userId, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded) {
      if (userId) {
        // If user is authenticated, redirect to dashboard
        redirect("/dashboard");
      } else {
        // If user is not authenticated, redirect to sign-in
        redirect("/sign-in");
      }
    }
  }, [isLoaded, userId]);

  // Show loading state while auth is being loaded
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Expense Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}
