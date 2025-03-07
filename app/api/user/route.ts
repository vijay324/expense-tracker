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

export const GET: Handler<User> = async (req) => {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (!user) {
      // If user doesn't exist, create them
      const clerkUser = await currentUser();

      if (!clerkUser) {
        return new NextResponse("User not found", { status: 404 });
      }

      const newUser = await prisma.user.create({
        data: {
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          name: `${clerkUser.firstName || ""} ${
            clerkUser.lastName || ""
          }`.trim(),
        },
      });

      return NextResponse.json(newUser);
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
};

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
