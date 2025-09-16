// app/api/admin/users/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if current user is admin
    const currentUser = await db.user.findUnique({
      where: { userId }
    });

    if (currentUser?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get all users
    const users = await db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.log("[ADMIN_USERS]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}