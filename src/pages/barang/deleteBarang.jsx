// src/pages/user/deleteUser.jsx
"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteBarang } from "@/function/barang";
export const DeleteBarang = ({ barangId, namaBarang }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => deleteBarang(barangId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]); 
      toast.success(`${namaBarang} has been deleted successfully.`);
    },
    onError: (error) => {
      toast.error(`Failed to delete user: ${error.message}`);
    },
  });

  const handleDelete = () => {
    mutation.mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the Barang{" "}
            <strong>{namaBarang}</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Deleting..." : "Yes, Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
