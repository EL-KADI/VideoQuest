"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Download, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useState } from "react"

interface ImageCardProps {
  image: {
    id: number
    width: number
    height: number
    url: string
    photographer: string
    photographer_url: string
    photographer_id: number
    avg_color: string
    src: {
      original: string
      large2x: string
      large: string
      medium: string
      small: string
      portrait: string
      landscape: string
      tiny: string
    }
    alt: string
  }
}

export function ImageCard({ image }: ImageCardProps) {
  const { toast } = useToast()
  const [favorites, setFavorites] = useLocalStorage<number[]>("image_favorites", [])
  const isFavorite = favorites.includes(image.id)
  const [isDownloading, setIsDownloading] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== image.id))
      toast({
        title: "Removed from favorites",
        description: "Image has been removed from your favorites",
      })
    } else {
      setFavorites([...favorites, image.id])
      toast({
        title: "Added to favorites",
        description: "Image has been added to your favorites",
      })
    }
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsDownloading(true)

     
      const downloads = JSON.parse(localStorage.getItem("image_downloads") || "[]")
      const newDownload = { id: image.id, date: new Date().toISOString() }
      localStorage.setItem("image_downloads", JSON.stringify([newDownload, ...downloads]))

      
      window.open(image.src.original, "_blank")

      toast({
        title: "Download started",
        description: "Your image is being downloaded",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download failed",
        description: "There was a problem downloading the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Link href={`/images/${image.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-[4/3]">
          <Image
            src={image.src.medium || "/placeholder.svg"}
            alt={image.alt || `Photo by ${image.photographer}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium line-clamp-2">{image.alt || `Photo by ${image.photographer}`}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {image.width}x{image.height}
              </p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={toggleFavorite}>
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
                <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleDownload} disabled={isDownloading}>
                {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                <span className="sr-only">Download</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
