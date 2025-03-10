import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Handler } from "typed-route-handler";
import { broadcastEvent } from "../events/route";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface Expense {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  amount: number;
  category: string;
  description: string | null;
  date: Date;
  userId: string;
}

// Helper function to validate CSRF protection
const validateCSRF = (request: Request) => {
  // In development environment, skip CSRF validation
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // Check for the presence of a valid referer header
  const referer = request.headers.get("referer");
  if (!referer) {
    // If no referer, check for custom header that our app sets
    const appOrigin = request.headers.get("x-app-origin");
    return !!appOrigin;
  }

  // Ensure the referer is from the same origin
  try {
    const refererUrl = new URL(referer);
    const requestUrl = new URL(request.url);

    // Check if origins match or if referer is from a trusted domain
    const trustedDomains = [
      requestUrl.origin,
      // Add any other trusted domains here
    ];

    return trustedDomains.includes(refererUrl.origin);
  } catch (error) {
    console.error("Error validating CSRF:", error);
    return false;
  }
};

// Get all expense entries for the current user
export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Get the user from our database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // Get the year from the query params
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get("year");

    // Get expense entries based on filters
    let expenses;

    if (yearParam) {
      // If year is specified, filter by year
      const year = parseInt(yearParam);
      expenses = await prisma.expense.findMany({
        where: {
          userId: user.id,
          date: {
            gte: new Date(`${year}-01-01T00:00:00.000Z`),
            lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
          },
        },
        orderBy: {
          date: "desc",
        },
      });
    } else {
      // If no year specified, get all expense entries
      expenses = await prisma.expense.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          date: "desc",
        },
      });
    }

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}

// Create a new expense entry
export const POST: Handler<Expense> = async (req) => {
  try {
    // Validate CSRF protection
    if (!validateCSRF(req)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request origin" }),
        {
          status: 403,
        }
      );
    }

    const { userId } = await auth();
    if (!userId) {
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Get the user from our database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const body = await req.json();

    // Validate required fields
    if (!body.amount || !body.category || !body.date) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields: amount, category, date",
        }),
        { status: 400 }
      );
    }

    // Validate amount is a positive number
    const amount = parseFloat(body.amount);
    if (isNaN(amount) || amount <= 0) {
      return new NextResponse(
        JSON.stringify({ error: "Amount must be a positive number" }),
        { status: 400 }
      );
    }

    // Create the expense entry
    const expense = await prisma.expense.create({
      data: {
        amount,
        category: body.category,
        description: body.description || null,
        date: new Date(body.date),
        userId: user.id,
      },
    });

    // Broadcast the event to all connected clients
    broadcastEvent("EXPENSE_CREATED", expense);

    return new NextResponse(JSON.stringify(expense), { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
