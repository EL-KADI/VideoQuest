"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, Download, Heart } from "lucide-react"

export function StatsCards() {
  const [stats, setStats] = useState({
    videoVisits: 0,
    imageVisits: 0,
    videoDownloads: 0,
    imageDownloads: 0,
    videoFavorites: 0,
    imageFavorites: 0,
    notes: 0,
  })

  useEffect(() => {
  
    const videoVisits = JSON.parse(localStorage.getItem("visits") || "[]").length
    const imageVisits = JSON.parse(localStorage.getItem("image_visits") || "[]").length
    const videoDownloads = JSON.parse(localStorage.getItem("downloads") || "[]").length
    const imageDownloads = JSON.parse(localStorage.getItem("image_downloads") || "[]").length
    const videoFavorites = JSON.parse(localStorage.getItem("favorites") || "[]").length
    const imageFavorites = JSON.parse(localStorage.getItem("image_favorites") || "[]").length
    const notes = JSON.parse(localStorage.getItem("video_notes") || "[]").length

    setStats({
      videoVisits,
      imageVisits,
      videoDownloads,
      imageDownloads,
      videoFavorites,
      imageFavorites,
      notes,
    })
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Video Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.videoVisits}</div>
          <p className="text-xs text-muted-foreground">Videos you've watched</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Image Views</CardTitle>
          <Eye className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.imageVisits}</div>
          <p className="text-xs text-muted-foreground">Images you've viewed</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Downloads</CardTitle>
          <Download className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.videoDownloads + stats.imageDownloads}</div>
          <p className="text-xs text-muted-foreground">
            {stats.videoDownloads} videos, {stats.imageDownloads} images
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Favorites</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.videoFavorites + stats.imageFavorites}</div>
          <p className="text-xs text-muted-foreground">
            {stats.videoFavorites} videos, {stats.imageFavorites} images
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
