"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { VideoPlayer } from "@/components/video-player"
import { NotesSection } from "@/components/notes-section"
import { Button } from "@/components/ui/button"
import { Heart, Download, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import Image from "next/image"

interface VideoDetails {
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

export default function VideoDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [video, setVideo] = useState<VideoDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  const [favorites, setFavorites] = useLocalStorage<number[]>("favorites", [])
  const isFavorite = favorites.includes(Number(id))

  const [visits, setVisits] = useLocalStorage<{ id: number; date: string }[]>("visits", [])
  const [visitRecorded, setVisitRecorded] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const [relatedVideos, setRelatedVideos] = useState<VideoDetails[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)

  useEffect(() => {
    const fetchVideo = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError("")

        
        const response = await fetch(`/api/videos/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Video not found")
          }
          throw new Error(`Failed to fetch video: ${response.status}`)
        }

        const data = await response.json()
        setVideo(data)
      } catch (err) {
        console.error("Error loading video:", err)
        setError(err instanceof Error ? err.message : "Error loading video. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchVideo()
  }, [id, retryCount])

  
  useEffect(() => {
    if (video && !visitRecorded) {
      // Record visit
      const newVisit = { id: Number(id), date: new Date().toISOString() }
      setVisits((prev) => {
        const filtered = prev.filter((v) => v.id !== Number(id))
        return [newVisit, ...filtered]
      })
      setVisitRecorded(true)
    }
  }, [video, id, setVisits, visitRecorded])

 
  useEffect(() => {
    const fetchRelatedVideos = async () => {
      if (!video) return

      try {
        setLoadingRelated(true)
      
        const query = video.user.name || "similar"
        const response = await fetch(`/api/related/videos?id=${id}&query=${encodeURIComponent(query)}&limit=3`)

        if (!response.ok) {
          throw new Error("Failed to fetch related videos")
        }

        const data = await response.json()
        setRelatedVideos(data.videos || [])
      } catch (error) {
        console.error("Error fetching related videos:", error)
      } finally {
        setLoadingRelated(false)
      }
    }

    if (video) {
      fetchRelatedVideos()
    }
  }, [video, id])

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav !== Number(id)))
      toast({
        title: "Removed from favorites",
        description: "Video has been removed from your favorites",
      })
    } else {
      setFavorites([...favorites, Number(id)])
      toast({
        title: "Added to favorites",
        description: "Video has been added to your favorites",
      })
    }
  }

  const handleDownload = async () => {
    if (!video) return

    try {
      setIsDownloading(true)

      const bestQuality = video.video_files.reduce((prev, current) => {
        return prev.width > current.width ? prev : current
      })

    
      const downloads = JSON.parse(localStorage.getItem("downloads") || "[]")
      const newDownload = { id: Number(id), date: new Date().toISOString() }
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

  const goBack = () => {
    router.back()
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Video not found"}</AlertDescription>
        </Alert>
        <div className="flex gap-2">
          <Button onClick={goBack} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
          <Button onClick={handleRetry} variant="default">
            Try Again
          </Button>
        </div>
      </div>
    )
  }


  const bestQualityVideo = video.video_files.reduce((prev, current) => {
    return (prev.width || 0) > (current.width || 0) ? prev : current
  })

  return (
    <div className="container mx-auto px-4 py-6">
      <Button onClick={goBack} variant="outline" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <VideoPlayer src={bestQualityVideo.link} poster={video.image} />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button onClick={toggleFavorite} variant={isFavorite ? "default" : "outline"}>
              <Heart className={`mr-2 h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Favorited" : "Add to Favorites"}
            </Button>

            <Button onClick={handleDownload} variant="outline" disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </>
              )}
            </Button>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold">{`Video by ${video.user.name}`}</h1>
            <div className="mt-2 text-muted-foreground">
              <p>Duration: {video.duration} seconds</p>
              <p>
                Resolution: {bestQualityVideo.width}x{bestQualityVideo.height}
              </p>
            </div>
          </div>

          <NotesSection videoId={Number(id)} />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Related Videos</h2>
          {loadingRelated ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted animate-pulse h-32 rounded-md" />
              ))}
            </div>
          ) : relatedVideos.length > 0 ? (
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <Link href={`/videos/${relatedVideo.id}`} key={relatedVideo.id}>
                  <div className="flex gap-2 p-2 rounded-md hover:bg-muted transition-colors">
                    <div className="relative w-24 h-16 flex-shrink-0">
                      <Image
                        src={relatedVideo.image || "/placeholder.svg"}
                        alt={`Video by ${relatedVideo.user.name}`}
                        fill
                        className="object-cover rounded-md"
                        sizes="100px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">{`Video by ${relatedVideo.user.name}`}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {Math.floor(relatedVideo.duration / 60)}:
                        {(relatedVideo.duration % 60).toString().padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-muted h-32 rounded-md flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No related videos found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
