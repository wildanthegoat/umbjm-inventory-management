import Head from "next/head";
import { useMemo, useState } from "react";
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown,  MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useGlobalFilter } from "@/function/useGlobalFilter";
import { AddBarang } from "@/pages/barang/addBarang";
import { fetchBarang } from "@/function/barang";
import { useColumnVisibility } from "@/function/useColumnVisibility";
import Link from "next/link";
import { ExportExcel } from "@/components/excel";
import { KategoriFilter } from "@/components/kategori-filter";
import { UpdateBarang } from "./updateBarang";
import { DeleteBarang } from "./deleteBarang";
import { useSession } from "next-auth/react";
import { RoleBasedAccess } from "@/function/roleAccess";

const BarangPage = () => {
  const { globalFilter, handleGlobalFilterChange, filterData } =
    useGlobalFilter();
  const [selectedKategori, setSelectedKategori] = useState("");
  const { visibleColumns, handleColumnVisibilityChange } = useColumnVisibility({
    nama_barang: true,
    kondisi: true,
    jumlah: true,
    harga: true,
    kategori: true,
    lokasi: true,
    gedung: false,
    ruangan: false,
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["barang"],
    queryFn: fetchBarang,
  });
  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }
  const filteredData = useMemo(() => {
    if (!data) return [];
    // Apply the kategori filter
    let filtered = data;
    if (selectedKategori) {
      filtered = data.filter((item) => item.kategori.id === selectedKategori);
    }
    // Apply the global search filter
    return filterData(filtered, [
      "nama_barang",
      "kondisi",
      "jumlah",
      "harga",
      "kategori.nama_kategori", // Access nested field
      "lokasi.kampus", // Access nested field
      "lokasi.gedung",
      "lokasi.ruangan",
    ]);
  }, [data, selectedKategori, filterData]);
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const handleKategoriSelect = (kategoriId) => {
    setSelectedKategori(kategoriId);
  };
  return (
    <div>
      <Head>
        <title>Barang</title>
      </Head>
      <div className="mt-3 mb-3 mx-auto h-full w-full max-w-5xl rounded-xl flex items-start justify-between">
        <Heading title="Barang" />
        <RoleBasedAccess role={["SUPER_ADMIN", "ADMIN"]} userRole={userRole}>
          <AddBarang />
        </RoleBasedAccess>
      </div>
      <Separator />
      <div className="mt-3 mx-auto h-full w-full max-w-5xl rounded-xl">
        <div className="flex items-center py-4 gap-4">
          <Input
            placeholder="Filter data..."
            value={globalFilter}
            onChange={handleGlobalFilterChange}
            className="max-w-sm"
          />
          <KategoriFilter onSelectKategori={handleKategoriSelect} />
          <ExportExcel />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {[
                "nama_barang",
                "kondisi",
                "jumlah",
                "harga",
                "kategori",
                "lokasi",
                "gedung",
                "ruangan",
              ].map((column) => (
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
                {visibleColumns.nama_barang && (
                  <TableHead>Nama Barang</TableHead>
                )}
                {visibleColumns.kondisi && <TableHead>Kondisi</TableHead>}
                {visibleColumns.jumlah && <TableHead>Jumlah</TableHead>}
                {visibleColumns.harga && <TableHead>Harga</TableHead>}
                {visibleColumns.kategori && <TableHead>Kategori</TableHead>}
                {visibleColumns.lokasi && <TableHead>Lokasi</TableHead>}
                {visibleColumns.gedung && <TableHead>Gedung</TableHead>}
                {visibleColumns.ruangan && <TableHead>Ruangan</TableHead>}
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
                : filteredData.map((barang) => (
                    <TableRow key={barang.id}>
                      {visibleColumns.nama_barang && (
                        <TableCell>{barang.nama_barang}</TableCell>
                      )}
                      {visibleColumns.kondisi && (
                        <TableCell>{barang.kondisi}</TableCell>
                      )}
                      {visibleColumns.jumlah && (
                        <TableCell>{barang.jumlah}</TableCell>
                      )}
                      {visibleColumns.harga && (
                        <TableCell>{barang.harga}</TableCell>
                      )}
                      {visibleColumns.kategori && (
                        <TableCell>{barang.kategori.nama_kategori}</TableCell>
                      )}
                      {visibleColumns.lokasi && (
                        <TableCell>{barang.lokasi.kampus}</TableCell>
                      )}
                      {visibleColumns.gedung && (
                        <TableCell>{barang.lokasi.gedung}</TableCell>
                      )}
                      {visibleColumns.ruangan && (
                        <TableCell>{barang.lokasi.ruangan}</TableCell>
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
                          <DropdownMenuItem>
                            <Link href={`/barang/detail/${barang.id}`}>
                              Detail Barang
                            </Link>
                          </DropdownMenuItem>
                          <RoleBasedAccess role={["SUPER_ADMIN", "ADMIN"]} userRole={userRole}>
                              <UpdateBarang barang={barang} />
                              <DropdownMenuSeparator />
                              <DeleteBarang barangId={barang.id} namaBarang={barang.nama_barang} />
                          </RoleBasedAccess>
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

export default BarangPage;
