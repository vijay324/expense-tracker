import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Handler } from "typed-route-handler";
import { broadcastEvent } from "../../events/route";

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

// Get a specific expense entry
export const GET: Handler<Expense> = async (req, { params }) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure params is resolved
    const resolvedParams = await params;
    const id = resolvedParams.id as string;

    if (!id) {
      return new NextResponse("Expense ID is required", { status: 400 });
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

    // Get the expense entry
    const expense = await prisma.expense.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!expense) {
      return new NextResponse("Expense not found", { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
      }
    );
  }
};

// Update a specific expense entry
export const PATCH: Handler<Expense> = async (req, { params }) => {
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

    // Ensure params is resolved
    const resolvedParams = await params;
    const id = resolvedParams.id as string;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Expense ID is required" }),
        {
          status: 400,
        }
      );
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

    // Get the expense entry to update
    const expense = await prisma.expense.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!expense) {
      return new NextResponse(JSON.stringify({ error: "Expense not found" }), {
        status: 404,
      });
    }

    const body = await req.json();

    // Validate amount if provided
    let amount = expense.amount;
    if (body.amount !== undefined) {
      amount = parseFloat(body.amount);
      if (isNaN(amount) || amount <= 0) {
        return new NextResponse(
          JSON.stringify({ error: "Amount must be a positive number" }),
          { status: 400 }
        );
      }
    }

    // Update the expense entry
    const updatedExpense = await prisma.expense.update({
      where: {
        id: id,
        userId: user.id,
      },
      data: {
        amount,
        category:
          body.category !== undefined ? body.category : expense.category,
        description:
          body.description !== undefined
            ? body.description
            : expense.description,
        date: body.date !== undefined ? new Date(body.date) : expense.date,
      },
    });

    // Broadcast the event to all connected clients
    broadcastEvent("EXPENSE_UPDATED", updatedExpense);

    return new NextResponse(JSON.stringify(updatedExpense), { status: 200 });
  } catch (error) {
    console.error("Error updating expense:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};

// Delete a specific expense entry
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
      return new NextResponse(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    // Ensure params is resolved
    const resolvedParams = await params;
    const id = resolvedParams.id as string;

    if (!id) {
      return new NextResponse(
        JSON.stringify({ error: "Expense ID is required" }),
        {
          status: 400,
        }
      );
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

    // Get the expense entry to delete
    const expense = await prisma.expense.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!expense) {
      return new NextResponse(JSON.stringify({ error: "Expense not found" }), {
        status: 404,
      });
    }

    // Delete the expense entry
    await prisma.expense.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });

    // Broadcast the event to all connected clients
    broadcastEvent("EXPENSE_DELETED", { id });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
};
