import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { DashboardLayout } from "../components/layout/dashboard-layout";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Expense Tracker",
  description: "Track your income and expenses with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <DashboardLayout>{children}</DashboardLayout>
        </body>
      </html>
    </ClerkProvider>
  );
}
