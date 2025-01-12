import { QRCodeCanvas } from "qrcode.react";
import { Badge } from "@/components/ui/badge";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const BarangDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [umur, setUmur] = useState({ days: 0, months: 0, years: 0 });
  const [showQRCode, setShowQRCode] = useState(false);

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

  const getOrdinalSuffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const formatDateString = (date) => {
    if (!date) return "";
    const options = { year: "numeric", month: "long", day: "numeric" };
    const dateObj = new Date(date);
    const day = dateObj.getDate();
    const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(
      dateObj
    );
    const year = dateObj.getFullYear();
    const suffix = getOrdinalSuffix(day);
    return `${month} ${day}${suffix}, ${year}`;
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
      <div className="mt-5 px-10 max-w-4xl mx-auto rounded-md border border-border/50 flex justify-between">
        {data && (
          <>
            {/* Left Section */}
            <div className="items-center">
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
            <div className="items-center">
              <p>
                <strong>Harga:</strong>
              </p>
              <p className="text-3xl">Rp.{data.harga}</p>
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
              <div className="mt-4">
                <Button onClick={() => setShowQRCode(!showQRCode)}>
                  {showQRCode ? "Hide QR Code" : "Generate QR Code"}
                </Button>
                {showQRCode && (
                  <div className="mt-4">
                    <QRCodeCanvas
                      value={`http://localhost:3000/api/barang?id=${id}`}
                      size={128}
                      level="H"
                      includeMargin
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BarangDetailPage;
