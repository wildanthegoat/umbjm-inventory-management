// components/ExportButton.js
import { useState } from "react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export const ExportExcel = () => {
  const [isLoading, setIsLoading] = useState(false);

  const exportToExcel = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/barang");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      // Flatten and format the data
      const rows = data.map((barang) => ({
        "Nama Barang": barang.nama_barang,
        "Kondisi": barang.kondisi,
        "Jumlah": barang.jumlah,
        "Harga": barang.harga,
        "Deskripsi": barang.deskripsi,
        "Tanggal Masuk" :barang.tanggal_masuk,
        "Kategori": barang.kategori.nama_kategori,
        "Lokasi": barang.lokasi.kampus,
        "Gedung": barang.lokasi.gedung,
        "Ruangan": barang.lokasi.ruangan,
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(rows);

      // Customize header names
      XLSX.utils.sheet_add_aoa(worksheet, [
        ["Nama Barang", "Kondisi", "Jumlah", "Harga", "Deskripsi", "Tanggal Masuk","Kategori", "Lokasi", "Gedung", "Ruangan"],
      ], { origin: "A1" });

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data Barang");

      // Write workbook to file
      XLSX.writeFile(workbook, "Data Barang.xlsx", { compression: true });

      setIsLoading(false);
    } catch (error) {
      console.error("Failed to export data:", error);
      setIsLoading(false);
    }
  };

  return (
    <Button variant="outline" className="ml-auto bg-green-500 hover:bg-green-400" onClick={exportToExcel} disabled={isLoading}>
      {isLoading ? "Exporting..." : "Export Data"}
    </Button>
  );
};
