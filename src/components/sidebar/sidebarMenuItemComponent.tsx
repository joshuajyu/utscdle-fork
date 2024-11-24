// SidebarMenuComponent.tsx (Client Component)
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Timer,
  ImagePlus,
  ChartColumn,
  GalleryHorizontalEnd,
} from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export default function SidebarMenuComponent({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  const pathname = usePathname();

  // Define the items array within the Client Component
  const items = [
    {
      title: "Daily Challenge",
      url: "/daily-challenge",
      icon: Calendar,
      accountRequired: false,
    },
    {
      title: "Race",
      url: "/race",
      icon: Timer,
      accountRequired: true,
    },
    {
      title: "Collections",
      url: "/collections",
      icon: GalleryHorizontalEnd,
      accountRequired: true,
    },
    {
      title: "Leaderboard",
      url: "/leaderboard",
      icon: ChartColumn,
      accountRequired: true,
    },
    {
      title: "Submit an Image",
      url: "/submit-image",
      icon: ImagePlus,
      accountRequired: true,
    },
  ];

  // Filter items based on authentication status
  const filteredItems = isAuthenticated
    ? items
    : items.filter((item) => !item.accountRequired);

  return (
    <SidebarMenu>
      {filteredItems.map((item) => {
        const isActive = pathname === item.url;
        const Icon = item.icon;

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={item.url} className="flex items-center">
                <Icon className="mr-2" />
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
