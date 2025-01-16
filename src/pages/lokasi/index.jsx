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
import { AddLokasi } from "./addLokasi";
import { fetchLokasi } from "@/function/lokasi";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { useGlobalFilter } from "@/function/useGlobalFilter";
import { useColumnVisibility } from "@/function/useColumnVisibility";
import { UpdateLokasi } from "./updateLokasi";
import { DeleteLokasi } from "./deleteLokasi";
import { useSession } from "next-auth/react";
import { RoleBasedAccess } from "@/function/roleAccess";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 7;

const LokasiPage = () => {
  const { globalFilter, handleGlobalFilterChange, filterData } = useGlobalFilter();
  const { visibleColumns, handleColumnVisibilityChange } = useColumnVisibility({
    kampus: true,
    gedung: true,
    ruangan: true,
  });
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["lokasi"],
    queryFn: fetchLokasi,
  });

  const { data: session } = useSession();
  const userRole = session?.user?.role;

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  // Memoize filtered data
  const filteredData = useMemo(
    () => filterData(data || [], ["kampus", "gedung", "ruangan"]),
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
        <title>Lokasi</title>
      </Head>
      <div className="mt-3 mb-3 mx-auto h-full w-full max-w-5xl rounded-xl flex items-start justify-between">
        <Heading title="Lokasi" />
        <RoleBasedAccess role={["SUPER_ADMIN", "ADMIN"]} userRole={userRole}>
          <AddLokasi />
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
              {["kampus", "gedung", "ruangan"].map((column) => (
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
                {visibleColumns.kampus && <TableHead>Nama Kampus</TableHead>}
                {visibleColumns.gedung && <TableHead>Nama Gedung</TableHead>}
                {visibleColumns.ruangan && <TableHead>Nama Ruangan</TableHead>}
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedData.map((lokasi) => (
                    <TableRow key={lokasi.id}>
                      {visibleColumns.kampus && (
                        <TableCell>{lokasi.kampus}</TableCell>
                      )}
                      {visibleColumns.gedung && (
                        <TableCell>{lokasi.gedung}</TableCell>
                      )}
                      {visibleColumns.ruangan && (
                        <TableCell>{lokasi.ruangan}</TableCell>
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
                              <UpdateLokasi lokasi={lokasi} />
                              <DropdownMenuSeparator />
                              <DeleteLokasi
                                lokasiId={lokasi.id}
                                lokasi={`${lokasi.kampus} - ${lokasi.gedung} - ${lokasi.ruangan}`}
                              />
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

export default LokasiPage;