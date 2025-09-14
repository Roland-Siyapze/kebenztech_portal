import React from "react";
import { CoursesList } from "../_components/CoursesList";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AdminInfo } from "../_components/AdminInfo";

export default async function AdminPage() {
  const { userId } = auth();

  if(!userId) return redirect("/") 

  const courses = await db.course.findMany({
    where: {
      userId, // Admin's courses
      isPublished: true,
    },
    include: {
      category: true,
      chapters: true,
    },
    take: 10,
    orderBy: { id: "asc" },
  });

  const category = await db.category.findMany({
    orderBy: {
      name: "desc",
    },
  });

  return (
    <div className="flex w-full h-auto min-h-screen flex-col p-10 gap-20">
      <AdminInfo/>
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Course Management Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage and publish courses for your company's learning platform
          </p>
        </div>
        <CoursesList category={category} courses={courses} />
      </div>
    </div>
  );
}