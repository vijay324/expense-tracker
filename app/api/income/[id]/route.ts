import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Get a specific income entry
export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = context.params;

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
}

// Update a specific income entry
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = context.params;

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
    console.error("[INCOME_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Delete a specific income entry
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = context.params;

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
    console.error("[INCOME_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
