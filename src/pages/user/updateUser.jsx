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
import { updateUser } from "@/function/user"; // Assume updateUser is defined
import { toast } from "sonner";

export function UpdateUser({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState(""); // Optional: Leave blank for no change
  const [role, setRole] = useState("");
  const [divisi, setDivisi] = useState("");
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || "");
      setUsername(user.username || "");
      setRole(user.role || "");
      setDivisi(user.divisi || "");
      setPassword(""); // Leave password empty unless explicitly changed
    }
  }, [user, isOpen]);

  const mutation = useMutation({
    mutationFn: updateUser, // Ensure updateUser is correctly implemented
    onSuccess: () => {
      queryClient.invalidateQueries("user");
      setIsOpen(false);
      toast.success("User berhasil diperbarui!");
    },
    onError: () => {
      toast.error("Gagal memperbarui User!");
    },
  });

  const handleOpenChange = (isOpen) => {
    setIsOpen(isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      id: user.id, 
      name,
      username,
      password: password || undefined, // Only send password if it's changed
      role,
      divisi,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FilePenLine className="mr-2 h-4 w-4" /> Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Update User</DialogTitle>
          <DialogDescription>Perbarui data User</DialogDescription>
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
                placeholder="Masukkan Password (Opsional)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select onValueChange={(value) => setRole(value)} value={role}>
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
            <Button type="submit" disabled={mutation.isLoading}>
              {mutation.isLoading ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
