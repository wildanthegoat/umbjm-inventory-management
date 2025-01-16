"use client";
import React, { useState } from "react";
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
import { addLokasi } from "@/function/lokasi";
import { toast } from "sonner";

export function AddLokasi() {
  const [isOpen, setIsOpen] = useState(false);
  const [kampus, setKampus] = useState("");
  const [gedung, setGedung] = useState("");
  const [ruangan, setRuangan] = useState("");
  const [availableGedung, setAvailableGedung] = useState([]);
  const queryClient = useQueryClient();

  const kampusGedungOptions = {
    "Kampus Utama": ["Masjid", "Teknik", "Rektorat"],
    "Kampus 1": ["Mas Mansyur", "A. Dahlan", "Buya Hamka", "A.R. Fachruddin", "Rektorat"],
    "Kampus 2": ["Gedung 1"],
  };

  const mutation = useMutation({
    mutationFn: addLokasi,
    onSuccess: () => {
      queryClient.invalidateQueries("lokasi");
      setIsOpen(false);
      toast.success("Lokasi berhasil ditambahkan!");
      setKampus("");
      setGedung("");
      setRuangan("");
    },
    onError: () => {
      toast.error("Gagal menambahkan lokasi!");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (!kampus.trim()) {
      toast.error("Silahkan pilih kampus!");
      return;
    }
    if (!gedung.trim()) {
      toast.error("Silahkan pilih gedung!");
      return;
    }
    if (!ruangan.trim()) {
      toast.error("Silahkan masukkan nama ruangan!");
      return;
    }

    mutation.mutate({ kampus, gedung, ruangan });
  };

  const handleKampusChange = (value) => {
    setKampus(value);
    setAvailableGedung(kampusGedungOptions[value] || []);
    setGedung("");
  };

  const handleOpenChange = (isOpen) => {
    setIsOpen(isOpen);
    if (isOpen) {
      setKampus("");
      setGedung("");
      setRuangan("");
      setAvailableGedung([]);
    }
  };

  const isFormValid = kampus && gedung && ruangan.trim();

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Tambah Lokasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tambah Lokasi</DialogTitle>
          <DialogDescription>Masukkan data Lokasi</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kampus" className="text-right">
                Kampus
              </Label>
              <Select
                onValueChange={handleKampusChange}
                value={kampus}
              >
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
          <Button type="submit" disabled={!isFormValid || mutation.isLoading}>
          {mutation.isLoading ? "Menambahkan..." : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}