"use client";
import React, { useState } from 'react';
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
import { addUser } from '@/function/user';
import { toast } from "sonner"

function AddUser() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [divisi, setDivisi] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addUser,
    onSuccess: () => {
      queryClient.invalidateQueries('user');
      setIsOpen(false);
      toast.success('User berhasil ditambahkan!');
      setName('');
      setUsername('');
      setPassword('');
      setRole('');
      setDivisi('');
    },
    onError: () => {
      toast.error('Gagal menambahkan User!');
    },
  });
  
  
  const handleOpenChange = (isOpen) => {
    setIsOpen(isOpen);
    if (isOpen) {
      setName('');
      setUsername('');
      setPassword('');
      setRole('');
      setDivisi('');  
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name, username, password, role, divisi });
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600">
            <Plus className="mr-2 h-4 w-4" /> Tambah User 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Tambah User</DialogTitle>
          <DialogDescription>
            Masukkan data User
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nama User
              </Label>
              <Input 
                id="name" 
                className="col-span-3" 
                placeholder="Masukkan Nama User" 
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input 
                id="username" 
                className="col-span-3" 
                placeholder="Masukkan Username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input 
                id="password" 
                className="col-span-3" 
                placeholder="Masukkan Password" 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select 
                onValueChange={(value) => setRole(value)}
                value={role}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Pilih Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="divisi" className="text-right">
                Divisi
              </Label>
              <Input 
                id="divisi" 
                className="col-span-3" 
                placeholder="Masukkan Divisi" 
                value={divisi}
                onChange={(e) => setDivisi(e.target.value)}
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

export default AddUser;