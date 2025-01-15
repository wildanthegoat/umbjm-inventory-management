"use client";
import React from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Home,
  Package,
  MapPin,
  UserRound,
  Boxes,
} from "lucide-react";

export function NavMain() {
  const router = useRouter();
  const { pathname } = router;
  const { data: session } = useSession();
  const userRole = session?.user?.role;

  return (
    <SidebarMenu>
      {/* Dashboard Link */}
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
          <a href="/dashboard">
            <Home className="mr-2 h-5 w-5" />
            <span>Dashboard</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Barang Link */}
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/barang"}>
          <a href="/barang">
            <Package className="mr-2 h-5 w-5" />
            <span>Barang</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Kategori Link */}
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/kategori"}>
          <a href="/kategori">
            <Boxes className="mr-2 h-5 w-5" />
            <span>Kategori</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* Lokasi Link */}
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={pathname === "/lokasi"}>
          <a href="/lokasi">
            <MapPin className="mr-2 h-5 w-5" />
            <span>Lokasi</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>

      {/* User Link - only to SUPER_ADMIN */}
      {userRole === "SUPER_ADMIN" && (
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === "/user"}>
            <a href="/user">
              <UserRound className="mr-2 h-5 w-5" />
              <span>User</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
    </SidebarMenu>
  );
}
