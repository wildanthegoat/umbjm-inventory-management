"use client";
import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { addLokasi } from '@/function/lokasi';
import { toast } from "sonner"

export function AddLokasi() {
  const [isOpen, setIsOpen] = useState(false);
  const [kampus, setKampus] = useState('');
  const [gedung, setGedung] = useState('');
  const [ruangan, setRuangan] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addLokasi,
    onSuccess: () => {
      queryClient.invalidateQueries('lokasi');
      setIsOpen(false);
      toast.success('Lokasi berhasil ditambahkan!');
      setKampus('');
      setGedung('');
      setRuangan('');
    },
    onError: () => {
      toast.error('Gagal menambahkan lokasi!');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ kampus, gedung, ruangan });
  };

  const handleOpenChange = (isOpen) => {
    setIsOpen(isOpen);
    if (isOpen) {
      setKampus('');
      setGedung('');
      setRuangan('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button >
          <Plus className="mr-2 h-4 w-4" /> Tambah Lokasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Tambah Lokasi</DialogTitle>
          <DialogDescription>
            Masukkan data Lokasi
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="kampus" className="text-right">
                Nama Kampus
              </Label>
              <Input
                id="kampus"
                value={kampus}
                onChange={(e) => setKampus(e.target.value)}
                className="col-span-3"
                placeholder="Masukkan Nama Kampus"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="gedung" className="text-right">
                Nama Gedung
              </Label>
              <Input
                id="gedung"
                value={gedung}
                onChange={(e) => setGedung(e.target.value)}
                className="col-span-3"
                placeholder="Masukkan Nama Gedung"
              />
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
            <Button type="submit">Tambah</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
