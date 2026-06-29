"use client"
import * as React from "react"
import { ChevronRight } from "lucide-react"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import Link from "next/link"

type SubItem = {
  id?: string | number
  libelle: string
  url: string
  icon?: React.ReactNode
  active?: boolean
}

type Item = {
  id?: string | number
  title: string
  url: string
  icon?: React.ReactNode
  active?: boolean
  items?: SubItem[]
}

function getKey(item: Item) {
  return item.id ?? item.url ?? item.title
}

function isItemActive(item: Item) {
  return Boolean(item.active) || Boolean(item.items?.some((sub) => sub.active))
}

export function NavMain({ label, items }: { label?: string; items: Item[] }) {
  const [openKeys, setOpenKeys] = React.useState<Set<string | number>>(() => {
    const initial = new Set<string | number>()
    items.forEach((item) => {
      if (isItemActive(item)) initial.add(getKey(item))
    })
    return initial
  })

  React.useEffect(() => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      items.forEach((item) => {
        if (isItemActive(item)) next.add(getKey(item))
      })
      return next
    })
  }, [items])

  const toggle = (key: string | number) => {
    setOpenKeys((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => {
            const key = getKey(item)
            const hasChildren = (item.items?.length ?? 0) > 0
            const isOpen = hasChildren && openKeys.has(key)
            return (
              <SidebarMenuItem key={key}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild={hasChildren}
                  onClick={hasChildren ? () => toggle(key) : undefined}
                >
                  {hasChildren ? (
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 text-left text-lg font-semibold text-black space-y-0.5 transition duration-200 ease-out hover:text-slate-700 hover:bg-slate-100 active:scale-[0.98] active:text-slate-600"
                    >
                      <span className="flex items-center gap-2 text-lg">
                        {item.icon}
                        <span>{item.title}</span>
                      </span>
                      <ChevronRight
                        className={`size-4 shrink-0 transition-transform duration-300 ease-out ${
                          isOpen ? "rotate-90" : "rotate-0"
                        }`}
                      />
                    </button>
                  ) : (
                    <Link
                      href={item.url}
                      className="flex w-full items-center gap-2 text-lg font-semibold text-black transition duration-200 ease-out hover:text-slate-700 hover:bg-slate-100 active:scale-[0.98] active:text-slate-600"
                    >
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  )}
                </SidebarMenuButton>

                {/* Le sous-menu reste toujours monté : on anime sa hauteur via grid-template-rows */}
                {hasChildren && (
                  <div
                    className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      <SidebarMenuSub>
                        {item.items!.map((sub) => (
                          <SidebarMenuSubItem key={sub.id ?? sub.url ?? sub.libelle}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={sub.url}
                                className="flex items-center gap-2 text-lg font-semibold text-black transition duration-200 ease-out hover:text-slate-700 hover:bg-slate-100 active:scale-[0.98] active:text-slate-600"
                              >
                                {sub.icon}
                                <span>{sub.libelle}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </div>
                  </div>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}