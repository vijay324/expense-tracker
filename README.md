# Expense Tracker

A comprehensive expense tracking application built with Next.js, Clerk authentication, and MongoDB.

## Features

- **User Authentication**: Secure authentication using Clerk
- **Dashboard**: Overview of income, expenses, and budget with charts and metrics
- **Income Management**: Track income from various categories (Startup, Job, Freelance, Social Media)
- **Expense Management**: Track expenses across different categories (Bills & Recharge, Traveling, Entertainment, Education & Courses)
- **Budget Planning**: Set and track annual budgets
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI
- **Authentication**: Clerk
- **Database**: MongoDB
- **ORM**: Prisma
- **Charts**: Recharts
- **Form Handling**: React Hook Form, Zod

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB database
- Clerk account

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/expense-tracker.git
   cd expense-tracker
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables:

   ```
   DATABASE_URL="your_mongodb_connection_string"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Run the development server:

   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Sign Up/Sign In**: Create an account or sign in using Clerk authentication.
2. **Dashboard**: View your financial overview with charts and metrics.
3. **Income**: Add and manage your income entries from various categories.
4. **Expenses**: Add and manage your expense entries from various categories.
5. **Budget**: Set and track your annual budget.

## Project Structure

- `/app`: Next.js app router pages
- `/components`: React components
  - `/ui`: UI components (buttons, cards, etc.)
  - `/dashboard`: Dashboard-specific components
  - `/income`: Income-related components
  - `/expenses`: Expense-related components
  - `/budget`: Budget-related components
  - `/layout`: Layout components (sidebar, etc.)
- `/lib`: Utility functions and shared code
- `/prisma`: Prisma schema and migrations
- `/api`: API routes for CRUD operations

## License

This project is licensed under the MIT License.
