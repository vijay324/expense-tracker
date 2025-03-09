import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Handler } from "typed-route-handler";

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
};
