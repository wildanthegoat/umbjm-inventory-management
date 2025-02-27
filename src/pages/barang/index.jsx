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
import { fetchBarang } from "@/function/barang";
import { useColumnVisibility } from "@/function/useColumnVisibility";
import Link from "next/link";
import { ExportExcel } from "@/components/excel";
import { KategoriFilter } from "@/components/kategori-filter";
import { LokasiFilter } from "@/components/lokasi-filter";
import AddBarang from "@/pages/barang/addBarang";
import UpdateBarang from "@/pages/barang/updateBarang";
import  DeleteBarang  from "@/pages/barang/deleteBarang";
import { useSession } from "next-auth/react";
import { RoleBasedAccess } from "@/function/roleAccess";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
const ITEMS_PER_PAGE = 7;

const BarangPage = () => {
  const { globalFilter, handleGlobalFilterChange, filterData } = useGlobalFilter();
  const [selectedKategori, setSelectedKategori] = useState("");
  const [selectedLokasi, setSelectedLokasi] = useState({
    kampus: "",
    gedung: "",
    ruangan: "",
  });
  const { visibleColumns, handleColumnVisibilityChange } = useColumnVisibility({
    nama_barang: true,
    kondisi: true,
    jumlah: true,
    harga: true,
    total_harga: true,
    kategori: true,
    lokasi: true,
    gedung: false,
    ruangan: false,
  });
  const { data, isLoading, error } = useQuery({
    queryKey: ["barang"],
    queryFn: fetchBarang,
  });

  const [currentPage, setCurrentPage] = useState(1);

  if (error) {
    return <div>Error loading data: {error.message}</div>;
  }

  const filteredData = useMemo(() => {
    if (!data) return [];
    let filtered = data;

    // Apply the category filter
    if (selectedKategori) {
      filtered = filtered.filter((item) => item.kategori.id === selectedKategori);
    }
    
    // Apply the location filter
    if (selectedLokasi.kampus) {
      filtered = filtered.filter((item) => item.lokasi.kampus === selectedLokasi.kampus);
    }

    filtered = filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    // Apply the global search filter
    return filterData(filtered, [
      "nama_barang",
      "kondisi",
      "jumlah",
      "harga",
      "kategori.nama_kategori",
      "lokasi.kampus",
      "lokasi.gedung",
      "lokasi.ruangan",
    ]);
  }, [data, selectedKategori, selectedLokasi, filterData]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const { data: session } = useSession();
  const userRole = session?.user?.role;

  const handleKategoriSelect = (kategoriId) => {
    setSelectedKategori(kategoriId);
  };

  const handleLokasiSelect = (kampus) => {
    setSelectedLokasi({ ...selectedLokasi, kampus });
  };

  const formatRupiah = (value) => {
      return new Intl.NumberFormat("id-ID").format(value);
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
          <LokasiFilter onSelectLokasi={handleLokasiSelect} />
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
                {visibleColumns.nama_barang && <TableHead>Nama Barang</TableHead>}
                {visibleColumns.kondisi && <TableHead>Kondisi</TableHead>}
                {visibleColumns.jumlah && <TableHead>Jumlah</TableHead>}
                {visibleColumns.harga && <TableHead>Harga</TableHead>}
                {visibleColumns.total_harga && <TableHead>Total Harga</TableHead>}
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
                      <TableCell colSpan={8}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : paginatedData.map((barang) => (
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
                        <TableCell>{formatRupiah(barang.harga)}</TableCell>
                      )}
                      {visibleColumns.total_harga && (
                        <TableCell>{formatRupiah(barang.jumlah * barang.harga)}</TableCell>
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
                          <RoleBasedAccess
                            role={["SUPER_ADMIN", "ADMIN"]}
                            userRole={userRole}
                          >
                            <UpdateBarang barang={barang} />
                            <DropdownMenuSeparator />
                            <DeleteBarang
                              barangId={barang.id}
                              namaBarang={barang.nama_barang}
                            />
                          </RoleBasedAccess>
                        </DropdownMenuContent>
                      </DropdownMenu>
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

export default BarangPage;
