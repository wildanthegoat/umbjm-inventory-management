import Head from "next/head";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, MapPin, UserRound, Boxes } from "lucide-react";
import { fetchBarang } from "@/function/barang";
import { fetchKategori } from "@/function/kategori";
import { fetchLokasi } from "@/function/lokasi";
import { fetchUser } from "@/function/user";

const DashboardPage = () => {
  // Fetch data using React Query
  const { data: barangData } = useQuery({
    queryKey: ["barang"],
    queryFn: fetchBarang,
  });

  const { data: kategoriData } = useQuery({
    queryKey: ["kategori"],
    queryFn: fetchKategori,
  });

  const { data: lokasiData } = useQuery({
    queryKey: ["lokasi"],
    queryFn: fetchLokasi,
  });

  const { data: userData } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });

  // Calculate totals
  const totalBarang = barangData?.length || 0;
  const totalKategori = kategoriData?.length || 0;
  const totalLokasi = lokasiData?.length || 0;
  const totalUser = userData?.length || 0;

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="mt-10 mx-11 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2 items-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Total Barang</CardTitle>
            <Package />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalBarang}
          </CardContent>
          <CardFooter className="text-xs">have been added</CardFooter>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Total Lokasi</CardTitle>
            <MapPin />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalLokasi}
          </CardContent>
          <CardFooter className="text-xs">have been added</CardFooter>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Total Kategori</CardTitle>
            <Boxes />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalKategori}
          </CardContent>
          <CardFooter className="text-xs">have been added</CardFooter>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Total User</CardTitle>
            <UserRound />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalUser}
          </CardContent>
          <CardFooter className="text-xs">have been added</CardFooter>
        </Card>
      </div>
      <div className="mt-10 mx-11 max-w-md"></div>
    </div>
  );
};

export default DashboardPage;