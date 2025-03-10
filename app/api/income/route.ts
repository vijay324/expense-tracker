import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Handler } from "typed-route-handler";
import { broadcastEvent } from "@/lib/event-service";

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface Income {
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

// Get all income entries for the current user
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

    // Get income entries based on filters
    let incomes;

    if (yearParam) {
      // If year is specified, filter by year
      const year = parseInt(yearParam);
      incomes = await prisma.income.findMany({
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
      // If no year specified, get all income entries
      incomes = await prisma.income.findMany({
        where: {
          userId: user.id,
        },
        orderBy: {
          date: "desc",
        },
      });
    }

    return NextResponse.json(incomes);
  } catch (error) {
    console.error("Error fetching income:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
      }
    );
  }
}

// Create a new income entry
export const POST: Handler<Income> = async (req) => {
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

    const body = await req.json();
    const { amount, category, description, date } = body;

    if (!amount || !category || !date) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get the user from our database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Create a new income entry
    const income = await prisma.income.create({
      data: {
        amount: parseFloat(amount),
        category,
        description: description || "",
        date: new Date(date),
        userId: user.id,
      },
    });

    // Broadcast the event to all connected clients
    broadcastEvent("INCOME_CREATED", income);

    return NextResponse.json(income);
  } catch (error) {
    console.error("Error creating income:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
