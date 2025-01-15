// pages/kategori/index.jsx
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
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { AddKategori } from "./addKategori";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchKategori } from "@/function/kategori";
import { useGlobalFilter } from "@/function/useGlobalFilter";
import { UpdateKategori } from "./updateKategori";
import { DeleteKategori } from "./deleteKategori";
import { useSession } from "next-auth/react";
import { RoleBasedAccess } from "@/function/roleAccess";

const KategoriPage = () => {
  const { globalFilter, handleGlobalFilterChange, filterData } =
    useGlobalFilter();
  const { data, isLoading, error } = useQuery({
    queryKey: ["kategori"],
    queryFn: fetchKategori,
  });

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  const filteredData = filterData(data || [], ["nama_kategori"]);
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <div>
      <Head>
        <title>Kategori</title>
      </Head>
      <div className="mt-3 mb-3 mx-auto h-full w-full max-w-5xl rounded-xl flex items-start justify-between">
        <Heading title="Kategori" />
        <RoleBasedAccess role={["SUPER_ADMIN", "ADMIN"]} userRole={userRole}>
        <AddKategori />
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
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Kategori</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={2}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : filteredData?.map((kategori) => (
                    <TableRow key={kategori.id}>
                      <TableCell>{kategori.nama_kategori}</TableCell>
                      <TableCell>
                      <RoleBasedAccess role={["SUPER_ADMIN", "ADMIN"]} userRole={userRole}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <UpdateKategori kategori={kategori} />
                              <DropdownMenuSeparator/>
                              <DeleteKategori kategoriId={kategori.id} namaKategori={kategori.nama_kategori} />
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </RoleBasedAccess>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default KategoriPage;
