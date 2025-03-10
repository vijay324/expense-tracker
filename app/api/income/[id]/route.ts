import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Handler } from "typed-route-handler";
import { broadcastEvent } from "../../events/route";

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

// Get a specific income entry
export const GET: Handler<Income> = async (req, { params }) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure params is resolved
    const resolvedParams = await params;
    const id = resolvedParams.id as string;

    if (!id) {
      return new NextResponse("Income ID is required", { status: 400 });
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

    // Get the income entry
    const income = await prisma.income.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!income) {
      return new NextResponse("Income not found", { status: 404 });
    }

    return NextResponse.json(income);
  } catch (error) {
    console.error("[INCOME_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

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

// Update a specific income entry
export const PATCH: Handler<Income> = async (req, { params }) => {
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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure params is resolved
    const resolvedParams = await params;
    const id = resolvedParams.id as string;

    if (!id) {
      return new NextResponse("Income ID is required", { status: 400 });
    }

    const body = await req.json();
    const { amount, category, description, date } = body;

    // Get the user from our database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Update the income entry
    const income = await prisma.income.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        category,
        description,
        date: date ? new Date(date) : undefined,
      },
    });

    return NextResponse.json(income);
  } catch (error) {
    console.error("Error updating income:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};

// Delete a specific income entry
export const DELETE: Handler = async (req, { params }) => {
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
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure params is resolved
    const resolvedParams = await params;
    const id = resolvedParams.id as string;

    if (!id) {
      return new NextResponse("Income ID is required", { status: 400 });
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

    // Delete the income entry
    await prisma.income.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting income:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
