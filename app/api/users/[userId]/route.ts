// app/api/admin/users/[userId]/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
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

    // Get the user
    const user = await db.user.findUnique({
      where: { id: params.userId },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[ADMIN_USER_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
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

    const { firstName, lastName, email, role, description } = await req.json();

    const user = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        firstName,
        lastName,
        email,
        role,
        description,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[ADMIN_USER_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId: currentUserId } = auth();
    
    if (!currentUserId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if current user is admin
    const currentUser = await db.user.findUnique({
      where: { userId: currentUserId }
    });

    if (currentUser?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get user to delete
    const userToDelete = await db.user.findUnique({
      where: { id: params.userId },
    });

    if (!userToDelete) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Delete from database
    await db.user.delete({
      where: {
        id: params.userId,
      },
    });

    // Delete from Clerk
    await clerkClient.users.deleteUser(userToDelete.userId);

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.log("[ADMIN_USER_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}