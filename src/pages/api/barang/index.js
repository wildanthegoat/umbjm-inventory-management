import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      if (req.query.id) {
        const barang = await prisma.barang.findUnique({
          where: { id: req.query.id },
          include: {
            kategori: true,
            lokasi: true,
          },
        });
        if (barang) {
          return res.status(200).json(barang);
        } else {
          return res.status(404).json({ error: "Barang not found" });
        }
      } else {
        const barang = await prisma.barang.findMany({
          include: {
            kategori: true,
            lokasi: true,
          },
        });
        return res.status(200).json(barang);
      }
    } catch (error) {
      console.error("Error fetching Barang:", error.message);
      return res.status(500).json({ error: "Failed to fetch Barang" });
    }
  } else if (method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const {
        nama_barang,
        jumlah,
        harga,
        kondisi,
        deskripsi,
        tanggal_masuk, // Ensure this field is included
        kategoriId,
        lokasiId,
      } = req.body;
      console.log("Request body:", req.body);

      if (
        !nama_barang ||
        !jumlah ||
        !harga ||
        !kondisi ||
        !kategoriId ||
        !lokasiId ||
        !tanggal_masuk
      ) {
        return res.status(400).json({ error: "Missing required fields." });
      }
      // Validate foreign key relationships
      const kategoriExists = await prisma.kategori.findUnique({
        where: { id: kategoriId },
      });
      const lokasiExists = await prisma.lokasi.findUnique({
        where: { id: lokasiId },
      });

      if (!kategoriExists || !lokasiExists) {
        return res
          .status(400)
          .json({ error: "Invalid kategoriId or lokasiId." });
      }

      const parsedDate = new Date(tanggal_masuk);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ error: "Invalid date format for tanggal_masuk." });
      }
      const newBarang = await prisma.barang.create({
        data: {
          nama_barang,
          jumlah: parseInt(jumlah, 10),
          harga: parseInt(harga, 10),
          kondisi,
          deskripsi,
          tanggal_masuk: parsedDate,
          kategori: { connect: { id: kategoriId } },
          lokasi: { connect: { id: lokasiId } },
          user: { connect: { id: session.user.id } },
        },
      });

      return res.status(201).json(newBarang);
    } catch (error) {
      console.error("Error creating Barang:", error.message);
      return res.status(500).json({ error: "Failed to create Barang." });
    }
  } 
  else if (method === "PATCH") {
    try {
      const session = await getServerSession(req, res, authOptions);
      if (!session || !session.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const {
        id,
        nama_barang,
        jumlah,
        harga,
        kondisi,
        deskripsi,
        kategoriId,
        lokasiId,
        tanggal_masuk,
      } = req.body;

      if (
        !id ||
        !nama_barang ||
        !jumlah ||
        !harga ||
        !kondisi ||
        !deskripsi ||
        !kategoriId ||
        !lokasiId ||
        !tanggal_masuk
      ) {
        return res.status(400).json({ error: "All fields are required" });
      }
      // Parse the date field
      const parsedTanggalMasuk = new Date(tanggal_masuk);
      // Update the barang record in the database
      const updatedBarang = await prisma.barang.update({
        where: { id },
        data: {
          nama_barang,
          jumlah,
          harga,
          kondisi,
          deskripsi,
          tanggal_masuk: parsedTanggalMasuk,
          kategori: { connect: { id: kategoriId } },
          lokasi: { connect: { id: lokasiId } },
        },
      });

      return res.status(200).json(updatedBarang);
    } catch (error) {
      console.error("Error updating Barang:", error.message);
      return res.status(500).json({ error: "Failed to update Barang." });
    }
  }
  else if (method === "DELETE") {
    try {
      const { id } = req.query;

      if (!id) {
        return res.status(400).json({ error: "Barang ID is required" });
      }

      await prisma.barang.delete({
        where: { id },
      });

      res.status(200).json({ message: "Barang deleted successfully" });
    } catch (error) {
      console.error("Error deleting barang:", error.message);
      res
        .status(500)
        .json({ error: "Failed to delete barang", details: error.message });
    }
  }
  else {
    res.setHeader("Allow", ["GET", "POST", "PATCH", "DELETE"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
