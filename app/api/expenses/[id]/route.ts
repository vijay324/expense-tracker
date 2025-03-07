import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Handler } from "typed-route-handler";

// Get a specific expense entry
export const GET: Handler = async (req, { params }) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure params is resolved
    const resolvedParams = await params;
    const id = resolvedParams.id;

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
    console.error("[EXPENSE_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// Update a specific expense entry
export const PATCH: Handler = async (req, { params }) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure params is resolved
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!id) {
      return new NextResponse("Expense ID is required", { status: 400 });
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

    // Update the expense entry
    const expense = await prisma.expense.update({
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

    return NextResponse.json(expense);
  } catch (error) {
    console.error("[EXPENSE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

// Delete a specific expense entry
export const DELETE: Handler = async (req, { params }) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Ensure params is resolved
    const resolvedParams = await params;
    const id = resolvedParams.id;

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

    // Delete the expense entry
    await prisma.expense.delete({
      where: {
        id: id,
        userId: user.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[EXPENSE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
