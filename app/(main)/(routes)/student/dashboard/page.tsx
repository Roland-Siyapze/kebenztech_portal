// app/(main)/(routes)/student/dashboard/page.tsx

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

import { ArrowLeft } from "lucide-react";
import { StudentDashboardContent } from "./_components/StudentDashboardContent";

export default async function DashboardPage() {
  const { userId } = auth();

  if (!userId) return redirect("/");

  // Fetch user data
  const userData = await db.user.findUnique({
    where: { userId },
  });

  // Fetch purchased courses
  const purchasedCourses = await db.course.findMany({
    where: {
      isPublished: true,
      purchases: {
        some: {
          userId,
        },
      },
    },
    include: {
      category: true,
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
      purchases: {
        where: {
          userId,
        },
      },
      attachments: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  // Get all purchases for this user to show purchase history
  const allPurchases = await db.purchase.findMany({
    where: {
      userId,
    },
    include: {
      course: {
        include: {
          category: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="w-full h-auto min-h-screen p-10">
      <Link
        href={`/`}
        className="flex items-center text-sm hover:opacity-75 transition mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Link>

      <StudentDashboardContent 
        userData={userData}
        purchasedCourses={purchasedCourses}
        allPurchases={allPurchases}
      />
    </div>
  );
}