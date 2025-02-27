"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { toast } from "sonner";
import { updateBarang } from "@/function/barang";
import { FilePenLine } from "lucide-react";

function UpdateBarang({ barang }) {
  const [isOpen, setIsOpen] = useState(false);
  const [nama_barang, setNamaBarang] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [kategoriId, setKategori] = useState("");
  const [lokasiId, setLokasi] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kategoriResponse, lokasiResponse] = await Promise.all([
          fetch("/api/kategori"),
          fetch("/api/lokasi"),
        ]);
        setCategories(await kategoriResponse.json());
        setLocations(await lokasiResponse.json());
      } catch (error) {
        console.error("Error fetching categories or locations:", error);
      }
    };
    fetchData();
  }, []);

  const mutation = useMutation({
    mutationFn: updateBarang,
    onSuccess: () => {
      queryClient.invalidateQueries(["barang"]);
      toast.success("Barang berhasil diperbarui!");
    },
    onError: () => {
      toast.error("Gagal memperbarui Barang!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      id: barang.id,
      nama_barang,
      kategoriId,
      lokasiId,
      kondisi,
      jumlah,
      harga,
      deskripsi,
      tanggal_masuk: tanggal,
    });
    handleOpenChange(false);
  };

  const handleOpenChange = (isOpen) => {
    setIsOpen(isOpen);
    if (isOpen) {
      setNamaBarang(barang.nama_barang || "");
      setJumlah(barang.jumlah || "");
      setKategori(barang.kategoriId || "");
      setLokasi(barang.lokasiId || "");
      setKondisi(barang.kondisi || "");
      setHarga(barang.harga || "");
      setDeskripsi(barang.deskripsi || "");
      setTanggal(barang.tanggal_masuk ? format(new Date(barang.tanggal_masuk), "yyyy-MM-dd") : "");
    }
  };
  

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          <FilePenLine className="mr-2 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] ">
        <DialogHeader>
          <DialogTitle>Update Barang</DialogTitle>
          <DialogDescription>Perbarui data Barang</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama Barang
              </Label>
              <Input
                className="col-span-3"
                placeholder="Masukkan Nama Barang"
                value={nama_barang}
                onChange={(e) => setNamaBarang(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kategori" className="text-right">
                Kategori
              </Label>
              <Select
                value={kategoriId}
                onValueChange={(value) => setKategori(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.nama_kategori}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lokasi" className="text-right">
                Lokasi
              </Label>
              <Select
                value={lokasiId}
                onValueChange={(value) => setLokasi(value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {locations.map((loc) => (
                      <SelectItem key={loc.id} value={loc.id}>
                        {loc.kampus} - {loc.gedung} - {loc.ruangan}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kondisi" className="text-right">
                Kondisi
              </Label>
              <Input
                className="col-span-3"
                placeholder="Masukkan Kondisi Barang"
                value={kondisi}
                onChange={(e) => setKondisi(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="jumlah" className="text-right">
                Jumlah
              </Label>
              <Input
                className="col-span-3"
                placeholder="Masukkan Jumlah Barang"
                type="number"
                min="1"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="harga" className="text-right">
                Harga
              </Label>
              <Input
                className="col-span-3"
                placeholder="Masukkan Harga Barang"
                type="number"
                min="1"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tanggal" className="text-right">
                Tanggal Masuk
              </Label>
              <Input
                type="date"
                className="col-span-3"
                placeholder="Masukkan Tanggal"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="deskripsi" className="text-right">
                Deskripsi
              </Label>
              <Textarea
                className="col-span-3"
                placeholder="Masukkan Deskripsi Barang"
                value={deskripsi}
                onChange={(e) => setDeskripsi(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default UpdateBarang;