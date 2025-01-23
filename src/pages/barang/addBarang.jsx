//pages/barang/addBarang.jsx
"use client";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Plus } from "lucide-react";
import { addBarang } from "@/function/barang";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

function AddBarang() {
  const [namaBarang, setNamaBarang] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [kategori, setKategori] = useState("");
  const [lokasi, setLokasi] = useState("");
  const [kondisi, setKondisi] = useState("");
  const [harga, setHarga] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [tanggal, setTanggal] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  

  useEffect(() => {
    fetch('/api/kategori')
      .then((response) => response.json())
      .then((data) => setCategories(data));
    fetch('/api/lokasi')
      .then((response) => response.json())
      .then((data) => setLocations(data));
  }, []);

  const mutation = useMutation({
    mutationFn: addBarang,
    onSuccess: () => {
      queryClient.invalidateQueries('barang');
      toast.success('Barang berhasil ditambahkan!');
      setNamaBarang("");
      setJumlah("");
      setKategori("");
      setLokasi("");
      setKondisi("");
      setTanggal(null);
    },
    onError: () => {
      toast.error('Gagal menambahkan Barang!');
    },
  });

  const formattedDate = tanggal ? format(new Date(tanggal), "yyyy-MM-dd") : null;

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      nama_barang: namaBarang,
      jumlah: parseInt(jumlah, 10),
      kategoriId: kategori,
      lokasiId: lokasi,
      kondisi,
      harga: parseInt(harga, 10),
      deskripsi,
      tanggal_masuk: formattedDate,
    });
    handleOpenChange(false);
  };

  const handleOpenChange = (isOpen) => {
    setIsOpen(isOpen);
    if (isOpen) {
      setNamaBarang("");
      setJumlah("");
      setKategori("");
      setLokasi("");
      setKondisi("");
      setHarga("");
      setDeskripsi("");
      setTanggal(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Barang{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px] ">
        <DialogHeader>
          <DialogTitle>Tambah Barang</DialogTitle>
          <DialogDescription>Masukkan data Barang</DialogDescription>
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
              value={namaBarang}
              onChange={(e) => setNamaBarang(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="kategori" className="text-right">
              Kategori
            </Label>
            <Select onValueChange={(value) => setKategori(value)}>
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
            <Select onValueChange={(value) => setLokasi(value)}>
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
            <Label htmlFor="kondisi" className="text-right">
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
          <Button type="submit">
            Tambahkan
          </Button>          
        </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddBarang;