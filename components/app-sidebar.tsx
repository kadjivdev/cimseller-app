"use client"

import * as React from "react"

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
import routes from "@/app/routes"
import { useRouter } from "next/navigation"
import { Menu } from "@/myComponents/menu"

const data = {
  user: {
    name: "kADJIV",
    email: "kadjivsarl1@gmail.com",
    avatar: "../app/favicon.ico",
  },
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()

  return (
    <>
      <Sidebar
        collapsible="offcanvas"
        {...props}
        className="shadow-sm border bg-dark rounded" style={{ width: '50vh' }} >
        <SidebarHeader className="border-bottom shadow-sm bg-dark">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="data-[slot=sidebar-menu-button]:p-0!">
                <img src="/cimseller_animated_logo.gif"
                  onClick={() => router.push(routes.dashboard)}
                  style={{ cursor: "pointer" }}
                  width={100} />
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          <Menu />
        </SidebarContent>

        <SidebarFooter className="border-top shadow-sm bg-warning">
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}
