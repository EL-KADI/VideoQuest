"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { VideoCard } from "@/components/video-card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


const FALLBACK_VIDEOS = [
  {
    id: 1,
    width: 1920,
    height: 1080,
    url: "#",
    image: "/placeholder.svg?height=1080&width=1920",
    duration: 30,
    user: {
      name: "Sample User",
      url: "#",
    },
    video_files: [
      {
        id: 101,
        quality: "hd",
        file_type: "video/mp4",
        width: 1920,
        height: 1080,
        link: "https://example.com/sample-video.mp4",
      },
    ],
    video_pictures: [
      {
        id: 201,
        picture: "/placeholder.svg?height=720&width=1280",
        nr: 0,
      },
    ],
  },
  {
    id: 2,
    width: 1920,
    height: 1080,
    url: "#",
    image: "/placeholder.svg?height=1080&width=1920",
    duration: 45,
    user: {
      name: "Demo Creator",
      url: "#",
    },
    video_files: [
      {
        id: 102,
        quality: "hd",
        file_type: "video/mp4",
        width: 1920,
        height: 1080,
        link: "https://example.com/sample-video-2.mp4",
      },
    ],
    video_pictures: [
      {
        id: 202,
        picture: "/placeholder.svg?height=720&width=1280",
        nr: 0,
      },
    ],
  },
  {
    id: 3,
    width: 1920,
    height: 1080,
    url: "#",
    image: "/placeholder.svg?height=1080&width=1920",
    duration: 60,
    user: {
      name: "Test Producer",
      url: "#",
    },
    video_files: [
      {
        id: 103,
        quality: "hd",
        file_type: "video/mp4",
        width: 1920,
        height: 1080,
        link: "https://example.com/sample-video-3.mp4",
      },
    ],
    video_pictures: [
      {
        id: 203,
        picture: "/placeholder.svg?height=720&width=1280",
        nr: 0,
      },
    ],
  },
  {
    id: 4,
    width: 1920,
    height: 1080,
    url: "#",
    image: "/placeholder.svg?height=1080&width=1920",
    duration: 25,
    user: {
      name: "Example Studio",
      url: "#",
    },
    video_files: [
      {
        id: 104,
        quality: "hd",
        file_type: "video/mp4",
        width: 1920,
        height: 1080,
        link: "https://example.com/sample-video-4.mp4",
      },
    ],
    video_pictures: [
      {
        id: 204,
        picture: "/placeholder.svg?height=720&width=1280",
        nr: 0,
      },
    ],
  },
]

interface Video {
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

export function VideoGrid() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || "nature"

  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [useFallback, setUseFallback] = useState(false)

  const fetchVideos = useCallback(
    async (currentPage: number, isRetry = false) => {
      if (useFallback && !isRetry) {
        return 
      }

      try {
        setLoading(true)
        if (!isRetry) {
          setError("")
        }

       
        const apiUrl = `/api/videos?query=${encodeURIComponent(query)}&page=${currentPage}&per_page=12`

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`)
        }

        const data = await response.json()

        if (!data.videos || !Array.isArray(data.videos)) {
          console.error("Unexpected API response:", data)
          throw new Error("Invalid API response format")
        }

        if (currentPage === 1) {
          setVideos(data.videos)
        } else {
          setVideos((prev) => [...prev, ...data.videos])
        }

        setHasMore(!!data.next_page)
        setUseFallback(false)
      } catch (err) {
        console.error("Error fetching videos:", err)

       
        if (currentPage === 1 && (retryCount >= 2 || isRetry)) {
          console.log("Using fallback video data")
          setVideos(FALLBACK_VIDEOS)
          setHasMore(false)
          setUseFallback(true)
          setError("Unable to connect to the video service. Showing sample content instead.")
        } else {
          setError("Error loading videos. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    },
    [query, retryCount, useFallback],
  )

 
  useEffect(() => {
    fetchVideos(page)
  }, [fetchVideos, page])

  useEffect(() => {
    setPage(1)
    setVideos([])
    setRetryCount(0)
    setUseFallback(false)
  }, [query])

  const loadMore = () => {
    if (!useFallback) {
      setPage((prev) => prev + 1)
    }
  }

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1)
    fetchVideos(page, true)
  }

  if (loading && videos.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && videos.length === 0 && !useFallback) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (videos.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No videos found</h3>
        <p className="text-muted-foreground">Try a different search term</p>
      </div>
    )
  }

  return (
    <div>
      {useFallback && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Connection Issue</AlertTitle>
          <AlertDescription>
            {error || "Unable to connect to the video service. Showing sample content instead."}
            <Button onClick={handleRetry} variant="link" className="p-0 h-auto ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>

      {hasMore && !useFallback && (
        <div className="mt-8 flex justify-center">
          <Button onClick={loadMore} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
