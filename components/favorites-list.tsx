"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Download, X, Loader2, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface VideoFavorite {
  id: number
  image: string
  user: {
    name: string
  }
  duration: number
  video_files: {
    id: number
    quality: string
    file_type: string
    width: number
    height: number
    link: string
  }[]
}

interface ImageFavorite {
  id: number
  src: {
    medium: string
    original: string
  }
  alt: string
  photographer: string
}

export function FavoritesList() {
  const [videoFavorites, setVideoFavorites] = useState<VideoFavorite[]>([])
  const [imageFavorites, setImageFavorites] = useState<ImageFavorite[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const [downloadingItems, setDownloadingItems] = useState<Record<string, boolean>>({})
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true)
        setError("")

    
        const videoFavoriteIds = JSON.parse(localStorage.getItem("favorites") || "[]") as number[]
        const imageFavoriteIds = JSON.parse(localStorage.getItem("image_favorites") || "[]") as number[]

        console.log("Video favorite IDs:", videoFavoriteIds)
        console.log("Image favorite IDs:", imageFavoriteIds)

        
        const limitedVideoIds = videoFavoriteIds.slice(0, 10)
        const limitedImageIds = imageFavoriteIds.slice(0, 10)

        
        const videoPromises = limitedVideoIds.map(async (id) => {
          try {
            console.log(`Fetching video ${id}`)
            const response = await fetch(`/api/videos/${id}`, {
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            })

            if (!response.ok) {
              console.error(`Error response for video ${id}:`, response.status)
              return null
            }

            const data = await response.json()
            console.log(`Received data for video ${id}:`, data)
            return data
          } catch (err) {
            console.error(`Error fetching video ${id}:`, err)
            return null
          }
        })

        
        const imagePromises = limitedImageIds.map(async (id) => {
          try {
            console.log(`Fetching image ${id}`)
            const response = await fetch(`/api/images/${id}`, {
              headers: {
                "Content-Type": "application/json",
              },
              cache: "no-store",
            })

            if (!response.ok) {
              console.error(`Error response for image ${id}:`, response.status)
              return null
            }

            const data = await response.json()
            console.log(`Received data for image ${id}:`, data)
            return data
          } catch (err) {
            console.error(`Error fetching image ${id}:`, err)
            return null
          }
        })

        const videoResults = await Promise.all(videoPromises)
        const imageResults = await Promise.all(imagePromises)

        const filteredVideoResults = videoResults.filter(Boolean)
        const filteredImageResults = imageResults.filter(Boolean)

        console.log("Filtered video results:", filteredVideoResults)
        console.log("Filtered image results:", filteredImageResults)

        setVideoFavorites(filteredVideoResults)
        setImageFavorites(filteredImageResults)
      } catch (error) {
        console.error("Error fetching favorites:", error)
        setError("Failed to load favorites. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [retryCount])

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  const removeVideoFavorite = (id: number) => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]") as number[]
    const updatedFavorites = favorites.filter((favId) => favId !== id)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
    setVideoFavorites(videoFavorites.filter((video) => video.id !== id))

    toast({
      title: "Removed from favorites",
      description: "Video has been removed from your favorites",
    })
  }

  const removeImageFavorite = (id: number) => {
    const favorites = JSON.parse(localStorage.getItem("image_favorites") || "[]") as number[]
    const updatedFavorites = favorites.filter((favId) => favId !== id)
    localStorage.setItem("image_favorites", JSON.stringify(updatedFavorites))
    setImageFavorites(imageFavorites.filter((image) => image.id !== id))

    toast({
      title: "Removed from favorites",
      description: "Image has been removed from your favorites",
    })
  }

  const downloadVideo = async (video: VideoFavorite) => {
    try {
      setDownloadingItems((prev) => ({ ...prev, [`video-${video.id}`]: true }))

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
      setDownloadingItems((prev) => ({ ...prev, [`video-${video.id}`]: false }))
    }
  }

  const downloadImage = async (image: ImageFavorite) => {
    try {
      setDownloadingItems((prev) => ({ ...prev, [`image-${image.id}`]: true }))

     
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
      setDownloadingItems((prev) => ({ ...prev, [`image-${image.id}`]: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={handleRetry} variant="outline">
            <Loader2 className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const hasNoFavorites = videoFavorites.length === 0 && imageFavorites.length === 0

  if (hasNoFavorites) {
    return (
      <div className="text-center py-12 border rounded-lg">
        <h3 className="text-lg font-medium">No favorites yet</h3>
        <p className="text-muted-foreground mt-1">Add videos or images to your favorites to see them here</p>
        <div className="mt-4">
          <div className="flex gap-4 justify-center">
            <Link href="/">
              <Button>Browse Videos</Button>
            </Link>
            <Link href="/images">
              <Button variant="outline">Browse Images</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Tabs defaultValue={videoFavorites.length > 0 ? "videos" : "images"}>
      <TabsList className="mb-4">
        <TabsTrigger value="videos">Videos ({videoFavorites.length})</TabsTrigger>
        <TabsTrigger value="images">Images ({imageFavorites.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="videos">
        {videoFavorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoFavorites.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image
                    src={video.image || "/placeholder.svg?height=720&width=1280"}
                    alt={`Video by ${video.user.name}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, "0")}
                  </div>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => removeVideoFavorite(video.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{`Video by ${video.user.name}`}</h3>
                  <div className="flex gap-2">
                    <Link href={`/videos/${video.id}`} passHref>
                      <Button size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadVideo(video)}
                      disabled={downloadingItems[`video-${video.id}`]}
                    >
                      {downloadingItems[`video-${video.id}`] ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium">No favorite videos yet</h3>
            <p className="text-muted-foreground mt-1">Add videos to your favorites to see them here</p>
            <div className="mt-4">
              <Link href="/">
                <Button>Browse Videos</Button>
              </Link>
            </div>
          </div>
        )}
      </TabsContent>

      <TabsContent value="images">
        {imageFavorites.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {imageFavorites.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={image.src.medium || "/placeholder.svg?height=480&width=640"}
                    alt={image.alt || `Photo by ${image.photographer}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full"
                    onClick={() => removeImageFavorite(image.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium mb-2">{image.alt || `Photo by ${image.photographer}`}</h3>
                  <div className="flex gap-2">
                    <Link href={`/images/${image.id}`} passHref>
                      <Button size="sm" className="w-full">
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadImage(image)}
                      disabled={downloadingItems[`image-${image.id}`]}
                    >
                      {downloadingItems[`image-${image.id}`] ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border rounded-lg">
            <h3 className="text-lg font-medium">No favorite images yet</h3>
            <p className="text-muted-foreground mt-1">Add images to your favorites to see them here</p>
            <div className="mt-4">
              <Link href="/images">
                <Button>Browse Images</Button>
              </Link>
            </div>
          </div>
        )}
      </TabsContent>
    </Tabs>
  )
}
