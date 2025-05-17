"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { BarChart3, Film, Heart, ImageIcon, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const navItems = [
    {
      name: "Videos",
      href: "/",
      icon: <Film className="h-5 w-5 mr-2" />,
      active: pathname === "/",
    },
    {
      name: "Images",
      href: "/images",
      icon: <ImageIcon className="h-5 w-5 mr-2" />,
      active: pathname === "/images",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5 mr-2" />,
      active: pathname === "/dashboard",
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: <Heart className="h-5 w-5 mr-2" />,
      active: pathname === "/favorites",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <div className="flex flex-col gap-6 py-4">
          <div className="px-2">
            <h2 className="text-lg font-bold mb-2">VideoQuest</h2>
            <p className="text-sm text-muted-foreground">Explore videos and images</p>
          </div>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                  item.active ? "bg-accent text-accent-foreground" : "hover:bg-muted text-muted-foreground",
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
