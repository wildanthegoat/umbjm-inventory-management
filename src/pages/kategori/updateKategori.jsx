// src/pages/kategori/updateKategori.jsx
"use client";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FilePenLine } from "lucide-react";
import { updateKategori } from "@/function/kategori";
import { toast } from "sonner";

function UpdateKategori({ kategori = {} }) {
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [nama_kategori, setNamaKategori] = useState(kategori?.nama_kategori || "");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: updateKategori,
    onSuccess: () => {
      queryClient.invalidateQueries("kategori");
      setIsUpdateOpen(false);
      toast.success("Kategori berhasil diupdate!");
    },
    onError: () => {
      toast.error("Gagal mengupdate Kategori!");
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    mutation.mutate({ id: kategori.id, nama_kategori });
  };

  const handleUpdateChange = (isOpen) => {
    setIsUpdateOpen(isOpen);
    if (isOpen) {
      setNamaKategori(kategori.nama_kategori);
    }
  };

  const handleClose = () => {
    setIsUpdateOpen(false);
  };

  return (
    <Dialog open={isUpdateOpen} onOpenChange={handleUpdateChange} >
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full">
          <FilePenLine className="mr-2 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[525px] bg-neutral-50"
        onClose={handleClose}
      >
        <DialogHeader>
          <DialogTitle>Update Kategori</DialogTitle>
          <DialogDescription>Perbarui data Kategori</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleUpdate}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama Kategori
              </Label>
              <Input
                id="name"
                value={nama_kategori}
                onChange={(e) => setNamaKategori(e.target.value)}
                className="col-span-3"
                placeholder="Masukkan Nama Kategori"
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

export default UpdateKategori;