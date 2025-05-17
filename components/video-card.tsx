"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Heart, Download, Play, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { useState } from "react"

interface VideoCardProps {
  video: {
    id: number
    width: number
    height: number
    url: string
    image: string
    duration: number
    user: {
      name: string
      url: string
    }
    video_files: {
      id: number
      quality: string
      file_type: string
      width: number
      height: number
      link: string
    }[]
    video_pictures: {
      id: number
      picture: string
      nr: number
    }[]
  }
}

export function VideoCard({ video }: VideoCardProps) {
  const { toast } = useToast()
  const [favorites, setFavorites] = useLocalStorage<number[]>("favorites", [])
  const isFavorite = favorites.includes(video.id)
  const [isDownloading, setIsDownloading] = useState(false)

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFavorite) {
      setFavorites(favorites.filter((id) => id !== video.id))
      toast({
        title: "Removed from favorites",
        description: "Video has been removed from your favorites",
      })
    } else {
      setFavorites([...favorites, video.id])
      toast({
        title: "Added to favorites",
        description: "Video has been added to your favorites",
      })
    }
  }

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      setIsDownloading(true)

      const bestQuality = video.video_files.reduce((prev, current) => {
        return prev.width > current.width ? prev : current
      })

     
      const downloads = JSON.parse(localStorage.getItem("downloads") || "[]")
      const newDownload = { id: video.id, date: new Date().toISOString() }
      localStorage.setItem("downloads", JSON.stringify([newDownload, ...downloads]))

      window.open(bestQuality.link, "_blank")

      toast({
        title: "Download started",
        description: "Your video is being downloaded",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download failed",
        description: "There was a problem downloading the video. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Link href={`/videos/${video.id}`}>
      <Card className="overflow-hidden transition-all hover:shadow-md">
        <div className="relative aspect-video">
          <Image
            src={video.image || "/placeholder.svg"}
            alt={`Video by ${video.user.name}`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button size="icon" variant="secondary" className="rounded-full">
              <Play className="h-6 w-6" />
              <span className="sr-only">Play video</span>
            </Button>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
            {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
          </div>
        </div>
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium line-clamp-2">{`Video by ${video.user.name}`}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {video.width}x{video.height} • {video.duration}s
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
