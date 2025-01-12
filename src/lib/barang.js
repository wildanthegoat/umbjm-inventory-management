// lib/barang.js
import { prisma } from "@/lib/prisma"; // Assuming you are using Prisma as your ORM

export const getBarangById = async () => {
  const barang = await prisma.barang.findUnique({
    where: { id: id }, 
    include: {
      kategori: true,
      lokasi: true,
    },
  });
  return barang;
};
