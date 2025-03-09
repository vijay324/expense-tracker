import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import type { Handler } from "typed-route-handler";

interface User {
  id: string;
  clerkId: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Force dynamic rendering
export const dynamic = "force-dynamic";

// Initialize or get user
export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user exists in our database
    let user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    // If user doesn't exist, create a new user
    if (!user) {
      // Get user details from Clerk
      const response = await fetch(`https://api.clerk.dev/v1/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user from Clerk");
      }

      const clerkUser = await response.json();

      // Create user in our database
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.email_addresses[0].email_address,
          name: `${clerkUser.first_name} ${clerkUser.last_name}`,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const POST: Handler<User> = async (req) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Find or create user in our database
    const user = await prisma.user.upsert({
      where: {
        clerkId: userId,
      },
      update: {
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      },
      create: {
        clerkId: userId,
        email: clerkUser.emailAddresses[0]?.emailAddress || "",
        name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};
