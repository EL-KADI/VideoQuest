"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { BarChart3, Film, Heart, ImageIcon, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"

export function MobileMenu() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

 
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const navItems = [
    {
      name: "Videos",
      href: "/",
      icon: <Film className="h-5 w-5 mr-3 " />,
      active: pathname === "/",
    },
    {
      name: "Images",
      href: "/images",
      icon: <ImageIcon className="h-5 w-5 mr-3" />,
      active: pathname === "/images",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5 mr-3" />,
      active: pathname === "/dashboard",
    },
    {
      name: "Favorites",
      href: "/favorites",
      icon: <Heart className="h-5 w-5 mr-3" />,
      active: pathname === "/favorites",
    },
  ]

  return (
    <div className="md:hidden me-3 ">
      <Button className=" bg-transpernt border-0" variant="outline" size="icon" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
        <Menu className="h-5 w-5 bg-transpernt border-0" />
      </Button>

  
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
        
          <div
            className="fixed -top-1 right-3 bottom-0 w-[250px] bg-background  p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end items-center  mb-6">
              <Button className="ms-auto text-right" variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5 mx-auto" />
              </Button>
            </div>

            <nav className="flex flex-col space-y-1 bg-gray-200 dark:bg-[#021124]">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 rounded-md text-sm font-medium transition-colors",
                    item.active
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
