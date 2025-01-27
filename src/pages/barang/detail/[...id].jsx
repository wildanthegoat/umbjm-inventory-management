import { QRCodeCanvas } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import html2canvas from "html2canvas";

const BarangDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [umur, setUmur] = useState({ days: 0, months: 0, years: 0 });
  const qrRef = useRef(null); 

  useEffect(() => {
    if (!id) {
      return;
    }
    fetch(`/api/barang?id=${id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        if (data.tanggal_masuk) {
          calculateAge(new Date(data.tanggal_masuk));
        }
      });
  }, [id]);

  const calculateAge = (tanggalMasuk) => {
    const now = new Date();
    const diffTime = Math.abs(now - tanggalMasuk);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = diffDays % 30;
    setUmur({ days, months, years });
  };

  const formatDateString = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
  };

  const downloadQRCode = async () => {
    if (!qrRef.current) return;
    // Capture the QR code container as an image
    const canvas = await html2canvas(qrRef.current, { scale: 8 });
    const image = canvas.toDataURL("image/png");
    // Create a download link
    const link = document.createElement("a");
    link.href = image;
    link.download = `qr-code-${data.nama_barang || "barang"}.png`;
    link.click();
  };

  const formatRupiah = (value) => {
    if (!value) return "0";
    return new Intl.NumberFormat("id-ID", {
      minimumFractionDigits: 0,
    }).format(value).replace(/,/g, ".");
  };
  return (
    <div>
      <Head>
        <title>Detail Barang</title>
      </Head>
      <div className="mt-3 mb-3 mx-auto h-full w-full max-w-5xl rounded-xl flex items-start justify-between">
        <Heading title="Detail Barang" />
        <Button onClick={() => router.back()}>Kembali</Button>
      </div>
      <Separator />
      <div className="mt-10 px-10 max-w-4xl mx-auto rounded-md border border-border/50 grid grid-cols-2">
        {data && (
          <>
            {/* Left Section */}
            <div className="items-center mt-5">
              <Heading title={data.nama_barang} />
              <p>
                <strong>Kondisi:</strong> <Badge>{data.kondisi}</Badge>
              </p>
              <p>
                <strong>Kategori:</strong>{" "}
                {data.kategori && data.kategori.nama_kategori}
              </p>
              <p>
                <strong>Lokasi:</strong> {data.lokasi && data.lokasi.kampus}
              </p>
              <p>
                <strong>Gedung:</strong> {data.lokasi && data.lokasi.gedung}
              </p>
              <p>
                <strong>Ruangan:</strong> {data.lokasi && data.lokasi.ruangan}
              </p>
              <p>
                <strong>Jumlah:</strong>
              </p>
              <p className="text-3xl">{data.jumlah}</p>
            </div>
            {/* Right Section */}
            <div className="items-center mt-5">
              <p>
                <strong>Harga:</strong>
              </p>
              <p className="text-3xl">Rp. {formatRupiah(data.harga)}</p>
              <p>
                <strong>Tanggal Masuk:</strong>
              </p>
              <Input
                value={formatDateString(data.tanggal_masuk)}
                className="border rounded-md px-3 py-2 w-36"
                readOnly
              />
              <p>
                <strong>Umur:</strong> {umur.years} years, {umur.months} months,{" "}
                {umur.days} days
              </p>
              <p>
                <strong>Deskripsi:</strong>
              </p>
              <Textarea value={data.deskripsi} readOnly />
            </div>
            <div className="mt-2 items-center flex">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600">Generate QR Code</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Generate QR </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div
                      ref={qrRef}
                      className="mt-3 flex flex-col items-center justify-center"
                    >
                      <p className="text-lg font-bold mb-2">
                        {data.nama_barang}
                      </p>
                      <QRCodeCanvas
                        value={`${process.env.NEXT_PUBLIC_API_URL}/barang/detail/${id}`}
                        size={256}
                        level="H"
                        includeMargin
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button className="mt-2" onClick={downloadQRCode}>
                      Download QR Code
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BarangDetailPage;
