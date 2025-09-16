import React from "react";
import Link from "next/link";
import { CoursesList } from "../_components/CoursesList";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { AdminInfo } from "../_components/AdminInfo";
import { Button } from "@nextui-org/react";

export default async function AdminPage() {
  const { userId } = auth();

  if (!userId) return redirect("/");

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
    <div className="flex w-full h-auto min-h-screen flex-col p-6 gap-6">
      <AdminInfo />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">User Management</h3>
          <p className="text-gray-600 mb-4">Manage system users, roles, and permissions</p>
          <Button as={Link} href="/admin/users" color="primary">
            Manage Users
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Course Management</h3>
          <p className="text-gray-600 mb-4">Create and manage courses</p>
          <Button as={Link} href="/admin/create" color="primary">
            Create Course
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Management Dashboard</h2>
          <p className="text-gray-600 mt-2">
            Manage and publish courses for your learning platform
          </p>
        </div>
        <CoursesList category={category} courses={courses} />
      </div>
    </div>
  );
}