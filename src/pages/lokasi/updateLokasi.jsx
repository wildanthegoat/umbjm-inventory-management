"use client";
import React, { useState, useEffect } from "react";
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
import { FilePenLine } from "lucide-react";
import { updateLokasi } from "@/function/lokasi"; // Update API function
import { toast } from "sonner";

const UpdateLokasi = ({ lokasi }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kampus, setKampus] = useState(lokasi.kampus);
  const [gedung, setGedung] = useState(lokasi.gedung);
  const [ruangan, setRuangan] = useState(lokasi.ruangan);
  const [availableGedung, setAvailableGedung] = useState([]);

  const queryClient = useQueryClient();

  // Define kampus-to-gedung mapping
  const kampusGedungOptions = {
    "Kampus Utama": ["Masjid", "Teknik", "Rektorat"],
    "Kampus 1": [
      "Mas Mansyur",
      "A. Dahlan",
      "Buya Hamka",
      "A.R. Fachruddin",
      "Rektorat",
    ],
    "Kampus 2": ["Gedung 1", "Gedung 2", "Gedung 3"], // Add more as needed
  };

  useEffect(() => {
    // Set available gedung options based on the initial kampus value
    setAvailableGedung(kampusGedungOptions[kampus] || []);
  }, [kampus]);

  const mutation = useMutation({
    mutationFn: updateLokasi,
    onSuccess: () => {
      queryClient.invalidateQueries("lokasi");
      setIsOpen(false);
      toast.success("Lokasi berhasil diperbarui!");
    },
    onError: () => {
      toast.error("Gagal memperbarui lokasi!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ id: lokasi.id, kampus, gedung, ruangan });
  };

  const handleKampusChange = (value) => {
    setKampus(value);
    setAvailableGedung(kampusGedungOptions[value] || []); // Update gedung options
    setGedung(""); // Reset gedung selection
  };

  const handleOpenChange = (isOpen) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      setKampus(lokasi.kampus);
      setGedung(lokasi.gedung);
      setRuangan(lokasi.ruangan);
      setAvailableGedung(kampusGedungOptions[lokasi.kampus] || []);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FilePenLine className="mr-2 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Update Lokasi</DialogTitle>
          <DialogDescription>Perbarui data Lokasi</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kampus" className="text-right">
                Kampus
              </Label>
              <Select onValueChange={handleKampusChange} value={kampus}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Kampus" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="Kampus Utama">Kampus Utama</SelectItem>
                    <SelectItem value="Kampus 1">Kampus 1</SelectItem>
                    <SelectItem value="Kampus 2">Kampus 2</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gedung" className="text-right">
                Nama Gedung
              </Label>
              <Select
                onValueChange={(value) => setGedung(value)}
                value={gedung}
                disabled={!availableGedung.length}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Gedung" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {availableGedung.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ruangan" className="text-right">
                Nama Ruangan
              </Label>
              <Input
                id="ruangan"
                value={ruangan}
                onChange={(e) => setRuangan(e.target.value)}
                className="col-span-3"
                placeholder="Masukkan Nama Ruangan"
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
};

export default UpdateLokasi;