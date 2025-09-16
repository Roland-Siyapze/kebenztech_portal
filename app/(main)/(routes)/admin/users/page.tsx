// app/(main)/(routes)/admin/users/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { User } from "@prisma/client";
import { UserDataTable } from "../_components/UserDataTable";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/admin/users");
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleEditUser = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserDataTable users={users} onEditUser={handleEditUser} />
    </div>
  );
}