import { useMemo, useState } from "react";
import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useGlobalFilter } from "@/function/useGlobalFilter";
import { useColumnVisibility } from "@/function/useColumnVisibility";
import { fetchUser } from "@/function/user";
import AddUser from "@/pages/user/addUser";
import UpdateUser from "@/pages/user/updateUser";
import DeleteUser from "@/pages/user/deleteUser";
import { RoleBasedAccess } from "@/function/roleAccess";
import { useSession } from "next-auth/react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const UserPage = () => {
  const { globalFilter, handleGlobalFilterChange, filterData } = useGlobalFilter();
  const { visibleColumns, handleColumnVisibilityChange } = useColumnVisibility({
    name: true,
    username: true,
    role: true,
    divisi: true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  const { data: session } = useSession();
  const userRole = session?.user?.role;

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  // Memoize filtered data
  const filteredData = useMemo(
    () => filterData(data || [], ["name", "username", "role", "divisi"]),
    [data, filterData]
  );

  // Memoize paginated data
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  return (
    <div>
      <Head>
        <title>User</title>
      </Head>
      <div className="mt-3 mb-3 mx-auto h-full w-full max-w-5xl rounded-xl flex items-start justify-between">
        <Heading title="Users" />
        <RoleBasedAccess role={["SUPER_ADMIN", "ADMIN"]} userRole={userRole}>
          <AddUser />
        </RoleBasedAccess>
      </div>
      <Separator />
      <div className="mt-3 mx-auto h-full w-full max-w-5xl rounded-xl">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter data..."
            value={globalFilter}
            onChange={handleGlobalFilterChange}
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["name", "username", "role", "divisi"].map((column) => (
                <DropdownMenuCheckboxItem
                  key={column}
                  className="capitalize"
                  checked={visibleColumns[column]}
                  onCheckedChange={() => handleColumnVisibilityChange(column)}
                >
                  {column}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {visibleColumns.name && <TableHead>Nama User</TableHead>}
                {visibleColumns.username && <TableHead>Username</TableHead>}
                {visibleColumns.role && <TableHead>Role</TableHead>}
                {visibleColumns.divisi && <TableHead>Divisi</TableHead>}
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={5}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedData.map((user) => (
                    <TableRow key={user.id}>
                      {visibleColumns.name && <TableCell>{user.name}</TableCell>}
                      {visibleColumns.username && (
                        <TableCell>{user.username}</TableCell>
                      )}
                      {visibleColumns.role && <TableCell>{user.role}</TableCell>}
                      {visibleColumns.divisi && (
                        <TableCell>{user.divisi}</TableCell>
                      )}
                      <TableCell>
                        <RoleBasedAccess
                          role={["SUPER_ADMIN", "ADMIN"]}
                          userRole={userRole}
                        >
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <UpdateUser user={user} />
                              <DropdownMenuSeparator />
                              <DeleteUser userId={user.id} userName={user.name} />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </RoleBasedAccess>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end mt-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default UserPage;