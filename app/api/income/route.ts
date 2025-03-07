import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// Get all income entries for the current user
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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

    // Get all income entries for the user
    const incomes = await prisma.income.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json(incomes);
  } catch (error) {
    console.error("[INCOME_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// Create a new income entry
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
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

    return NextResponse.json(income);
  } catch (error) {
    console.error("[INCOME_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
