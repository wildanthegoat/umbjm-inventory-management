import React from "react";
import Image from 'next/image';
import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import logo from "../../public/logo-umbjm.png";

export function AppSidebar({ ...props }) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 py-2 text-sidebar-accent-foreground">
          <div className="flex aspect-square h-10 w-10 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Image className="size-full" src={logo} alt="logo" />
          </div>
          <div className="text-center text-sm">
            <span className="truncate font-semibold"></span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
