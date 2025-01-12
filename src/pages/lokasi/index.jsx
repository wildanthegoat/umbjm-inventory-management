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
import { AlertDelete } from "@/components/alert-delete";
import { UpdateLokasi } from "./updateLokasi";

const LokasiPage = () => {
  const { globalFilter, handleGlobalFilterChange, filterData } =
    useGlobalFilter();
  const { visibleColumns, handleColumnVisibilityChange } = useColumnVisibility({
    kampus: true,
    gedung: true,
    ruangan: true,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["lokasi"],
    queryFn: fetchLokasi,
  });

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  const filteredData = filterData(data || [], ["kampus", "gedung", "ruangan"]);

  return (
    <div>
      <Head>
        <title>Lokasi</title>
      </Head>
      <div className="mt-3 mb-3 mx-auto h-full w-full max-w-5xl rounded-xl flex items-start justify-between">
        <Heading title="Lokasi" />
        <AddLokasi />
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
                      <TableCell colSpan={3}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : filteredData.map((lokasi) => (
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
                            <DropdownMenuSeparator/>
                            <AlertDelete />
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default LokasiPage;
