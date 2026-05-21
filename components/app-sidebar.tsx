"use client"

import * as React from "react"
import { createClient } from "@/supabase/client"
import Image from "next/image"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { FileTextIcon, LayoutDashboardIcon, PenToolIcon } from "lucide-react"
import Link from "next/link"

const supabase = createClient()

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
      isActive: true,
    },
    {
      title: "Notes",
      url: "/notes",
      icon: <FileTextIcon />,
    },
    {
      title: "Whiteboard",
      url: "/whiteboard",
      icon: <PenToolIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    avatar: "",
  })

  React.useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        setUser({
          name:
            user.user_metadata?.full_name ||
            user.email?.split("@")[0] ||
            "User",

          email: user.email || "",

          avatar: user.user_metadata?.avatar_url || "/avatars/default.jpg",
        })
      }
    }

    getUser()
  }, [])

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="relative size-8 overflow-hidden rounded-lg bg-sidebar-primary">
                  <Image
                    src="/assets/logo.png"
                    alt="Notely logo"
                    className="object-cover"
                    width={50}
                    height={50}
                    priority
                  />
                </div>

                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">Notelyyyy</span>

                  <span className="truncate text-xs">
                    Your personal note app
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
