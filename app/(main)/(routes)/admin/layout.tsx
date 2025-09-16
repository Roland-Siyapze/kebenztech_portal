import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = auth();

  if (!userId) redirect("/");

  const user = await db.user.findUnique({
    where: { userId },
  });

  if (user?.role !== "ADMIN") {
    return redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 p-4 border-r border-gray-200">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link href="/admin" className="block py-2 px-4 rounded hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/admin/users" className="block py-2 px-4 rounded hover:bg-gray-200">
            Users
          </Link>
          <Link href="/admin/create" className="block py-2 px-4 rounded hover:bg-gray-200">
            Create Course
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}