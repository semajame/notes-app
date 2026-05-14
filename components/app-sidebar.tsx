"use client"

import * as React from "react"
import { createClient } from "@/supabase/client"

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

import { TerminalSquareIcon, BookOpenIcon, TerminalIcon } from "lucide-react"

const supabase = createClient()

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <BookOpenIcon />,
      isActive: true,
    },
    {
      title: "Notes",
      url: "/notes",
      icon: <TerminalSquareIcon />,
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
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>

                <div className="grid flex-1 text-start text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>

                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
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
