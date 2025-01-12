"use client";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { addKategori } from "@/function/kategori";
import { toast } from "sonner"

export function AddKategori() {
  const [isOpen, setIsOpen] = useState(false);
  const [nama_kategori, setKategori,] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addKategori,
    onSuccess: () => {
      queryClient.invalidateQueries('kategori');
      setIsOpen(false);
      toast.success('Kategori berhasil ditambahkan!');
      setKategori('');
    },
    onError: () => {
      toast.error('Gagal menambahkan Kategori!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ nama_kategori });
  };

  const handleOpenChange = (isOpen) => {
    setIsOpen(isOpen);
    if (isOpen) {
      setKategori('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600">
          <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px] bg-neutral-50">
        <DialogHeader>
          <DialogTitle>Tambah Kategori</DialogTitle>
          <DialogDescription>Masukkan data Kategori</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama Kategori
              </Label>
              <Input
                id="name"
                value={nama_kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="col-span-3"
                placeholder="Masukkan Nama Kategori"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Menambahkan..." : "Tambah"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
