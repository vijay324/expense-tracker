import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  ArrowRight,
  BarChart2,
  DollarSign,
  PieChart,
  Shield,
  IndianRupee,
  TrendingDown,
  BarChart,
} from "lucide-react";

export default async function LandingPage() {
  // Check if the user is already authenticated
  const { userId } = await auth();

  // If authenticated, redirect to dashboard
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Manage Your Finances with Ease
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Track expenses, analyze spending patterns, and achieve your
              financial goals with our intuitive expense tracking application.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Get Started
              </Link>
              <Link
                href="/sign-in"
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Powerful Features to Manage Your Money
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <IndianRupee className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Income Tracking</h3>
              <p className="text-muted-foreground">
                Record and categorize all your income sources to get a complete
                financial picture.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingDown className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expense Management</h3>
              <p className="text-muted-foreground">
                Track your expenses by categories and identify spending patterns
                to optimize your finances.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg shadow-sm border border-border">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <BarChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Financial Reports</h3>
              <p className="text-muted-foreground">
                Get detailed reports and visualizations to understand your
                financial health and make better decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users who have taken control of their finances
            with our platform.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Create Your Account <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 mt-auto">
        <div className="container mx-auto px-4 text-center">
          <p>
            © {new Date().getFullYear()} Finance Tracker. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
