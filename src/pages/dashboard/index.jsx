import Head from "next/head";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
    Package,
    MapPin,
    UserRound,
    Boxes,
  } from "lucide-react"
import { ArchiveIcon, CubeIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";
const DashboardPage = () => {
  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="mt-10 mx-11 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="col-span-2 items-center">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Barang</CardTitle>
            <Package />
          </CardHeader>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Lokasi</CardTitle>
            <MapPin />
          </CardHeader>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Kategori</CardTitle>
            <Boxes />
          </CardHeader>
        </Card>
        <Card className="col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>User</CardTitle>
            <UserRound />
          </CardHeader>
        </Card>
      </div>
      <div className="mt-10 mx-11 max-w-md">
      </div>
    </div>
  );
};

export default DashboardPage;
