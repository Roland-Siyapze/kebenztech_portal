// app/(main)/(routes)/admin/_components/UserDataTable.tsx
"use client";

import React, { useMemo, useState } from "react";
import { User, Role } from "@prisma/client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Chip,
  Pagination,
  SortDescriptor,
  Tooltip,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { SearchIcon, EditIcon, Trash2Icon } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { ConfirmModel } from "@/components/model/ConfirmModel";

interface UserDataTableProps {
  users: User[];
  onEditUser: (userId: string) => void;
}

export const UserDataTable = ({ users }: UserDataTableProps) => {
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filterValue, setFilterValue] = useState("");
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "createdAt",
    direction: "descending",
  });

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...users];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter(
        (user) =>
          user.email.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.firstName.toLowerCase().includes(filterValue.toLowerCase()) ||
          user.lastName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [users, filterValue, hasSearchFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number;
      const second = b[sortDescriptor.column as keyof User] as number;
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onSearchChange = (value: string) => {
    setFilterValue(value);
    setPage(1);
  };

  const onClear = () => {
    setFilterValue("");
    setPage(1);
  };

  const handleRoleChange = async (userId: string, newRole: Role) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role: newRole });
      toast.success("User role updated");
      // Refresh the page to see changes
      window.location.reload();
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      toast.success("User deleted");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const getRoleColor = (role: Role) => {
    return role === "ADMIN" ? "primary" : "default";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          isClearable
          className="w-full sm:max-w-[44%]"
          placeholder="Search by name or email..."
          startContent={<SearchIcon />}
          value={filterValue}
          onClear={onClear}
          onValueChange={onSearchChange}
        />
      </div>

      <Table
        aria-label="Users table"
        bottomContent={
          <div className="flex w-full justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={setPage}
            />
          </div>
        }
        classNames={{
          wrapper: "min-h-[222px]",
        }}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
      >
        <TableHeader>
          <TableColumn key="firstName" allowsSorting>
            NAME
          </TableColumn>
          <TableColumn key="email" allowsSorting>
            EMAIL
          </TableColumn>
          <TableColumn key="role" allowsSorting>
            ROLE
          </TableColumn>
          <TableColumn key="createdAt" allowsSorting>
            JOINED
          </TableColumn>
          <TableColumn key="actions">ACTIONS</TableColumn>
        </TableHeader>
        <TableBody items={sortedItems}>
          {(user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <img
                    src={user.imageUrl || "/default-avatar.png"}
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">ID: {user.userId}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <Chip color={getRoleColor(user.role)} variant="flat">
                  {user.role}
                </Chip>
              </TableCell>
              <TableCell>
                {new Date(user.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Tooltip content="Edit user">
                    <Button 
                      isIconOnly 
                      size="sm" 
                      variant="light" 
                      color="primary"
                      onClick={() => onEditUser(user.id)}
                    >
                      <EditIcon size={16} />
                    </Button>
                  </Tooltip>
                  <Tooltip content="Delete user">
                    <ConfirmModel
                      onConfirm={() => handleDeleteUser(user.id)}
                      title="Delete User"
                      description="Are you sure you want to delete this user? This action cannot be undone."
                    >
                      <Button isIconOnly size="sm" variant="light" color="danger">
                        <Trash2Icon size={16} />
                      </Button>
                    </ConfirmModel>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};