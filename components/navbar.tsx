"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { BarChart3, Film, Heart, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { MobileMenu } from "@/components/mobile-menu"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Videos",
      href: "/",
      icon: <Film className="h-4 w-4 mr-2" />,
      active: pathname === "/",
    },
    {
      name: "Images",
      href: "/images",
      icon: <ImageIcon className="h-4 w-4 mr-2" />,
      active: pathname === "/images",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-4 w-4 mr-2" />,
      active: pathname === "/dashboard",
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: <Heart className="h-4 w-4 mr-2" />,
      active: pathname === "/favorites",
    },
  ]

  return (
    <header className="sticky top-0 z-40  border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-center ">
        <div className="flex items-center  gap-2">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold ms-5">VideoQuest</span>
          </Link>
        </div>

        <nav className="hidden md:flex  justify-center  mx-auto lg:me-auto items-center gap-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-4 py-2  text-sm font-medium transition-colors hover:text-primary",
                item.active ? "text-primary" : "text-muted-foreground",
              )}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1 ms-auto md:ms-0 ">
          <ThemeToggle  />
        <MobileMenu /> 
        </div>
      </div>
    </header>
  )
}
