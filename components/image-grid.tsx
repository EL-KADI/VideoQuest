"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { ImageCard } from "@/components/image-card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"


const FALLBACK_IMAGES = [
  {
    id: 1,
    width: 1920,
    height: 1080,
    url: "#",
    photographer: "Sample Photographer",
    photographer_url: "#",
    photographer_id: 1,
    avg_color: "#888888",
    src: {
      original: "/placeholder.svg?height=1080&width=1920",
      large2x: "/placeholder.svg?height=1080&width=1920",
      large: "/placeholder.svg?height=1080&width=1920",
      medium: "/placeholder.svg?height=720&width=1280",
      small: "/placeholder.svg?height=480&width=640",
      portrait: "/placeholder.svg?height=1080&width=720",
      landscape: "/placeholder.svg?height=720&width=1080",
      tiny: "/placeholder.svg?height=240&width=320",
    },
    alt: "Sample Image 1",
  },
  {
    id: 2,
    width: 1920,
    height: 1080,
    url: "#",
    photographer: "Demo Photographer",
    photographer_url: "#",
    photographer_id: 2,
    avg_color: "#777777",
    src: {
      original: "/placeholder.svg?height=1080&width=1920",
      large2x: "/placeholder.svg?height=1080&width=1920",
      large: "/placeholder.svg?height=1080&width=1920",
      medium: "/placeholder.svg?height=720&width=1280",
      small: "/placeholder.svg?height=480&width=640",
      portrait: "/placeholder.svg?height=1080&width=720",
      landscape: "/placeholder.svg?height=720&width=1080",
      tiny: "/placeholder.svg?height=240&width=320",
    },
    alt: "Sample Image 2",
  },
  {
    id: 3,
    width: 1920,
    height: 1080,
    url: "#",
    photographer: "Test Photographer",
    photographer_url: "#",
    photographer_id: 3,
    avg_color: "#666666",
    src: {
      original: "/placeholder.svg?height=1080&width=1920",
      large2x: "/placeholder.svg?height=1080&width=1920",
      large: "/placeholder.svg?height=1080&width=1920",
      medium: "/placeholder.svg?height=720&width=1280",
      small: "/placeholder.svg?height=480&width=640",
      portrait: "/placeholder.svg?height=1080&width=720",
      landscape: "/placeholder.svg?height=720&width=1080",
      tiny: "/placeholder.svg?height=240&width=320",
    },
    alt: "Sample Image 3",
  },
  {
    id: 4,
    width: 1920,
    height: 1080,
    url: "#",
    photographer: "Example Photographer",
    photographer_url: "#",
    photographer_id: 4,
    avg_color: "#555555",
    src: {
      original: "/placeholder.svg?height=1080&width=1920",
      large2x: "/placeholder.svg?height=1080&width=1920",
      large: "/placeholder.svg?height=1080&width=1920",
      medium: "/placeholder.svg?height=720&width=1280",
      small: "/placeholder.svg?height=480&width=640",
      portrait: "/placeholder.svg?height=1080&width=720",
      landscape: "/placeholder.svg?height=720&width=1080",
      tiny: "/placeholder.svg?height=240&width=320",
    },
    alt: "Sample Image 4",
  },
]

interface Image {
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

export function ImageGrid() {
  const searchParams = useSearchParams()
  const query = searchParams.get("query") || "nature"

  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [retryCount, setRetryCount] = useState(0)
  const [useFallback, setUseFallback] = useState(false)

  const fetchImages = useCallback(
    async (currentPage: number, isRetry = false) => {
      if (useFallback && !isRetry) {
        return 
      }

      try {
        setLoading(true)
        if (!isRetry) {
          setError("")
        }

     
        const apiUrl = `/api/images?query=${encodeURIComponent(query)}&page=${currentPage}&per_page=12`

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

        if (!data.photos || !Array.isArray(data.photos)) {
          console.error("Unexpected API response:", data)
          throw new Error("Invalid API response format")
        }

        if (currentPage === 1) {
          setImages(data.photos)
        } else {
          setImages((prev) => [...prev, ...data.photos])
        }

        setHasMore(!!data.next_page)
        setUseFallback(false)
      } catch (err) {
        console.error("Error fetching images:", err)

     
        if (currentPage === 1 && (retryCount >= 2 || isRetry)) {
          console.log("Using fallback image data")
          setImages(FALLBACK_IMAGES)
          setHasMore(false)
          setUseFallback(true)
          setError("Unable to connect to the image service. Showing sample content instead.")
        } else {
          setError("Error loading images. Please try again.")
        }
      } finally {
        setLoading(false)
      }
    },
    [query, retryCount, useFallback],
  )

  useEffect(() => {
    fetchImages(page)
  }, [fetchImages, page])

 
  useEffect(() => {
    setPage(1)
    setImages([])
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
    fetchImages(page, true)
  }

  if (loading && images.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error && images.length === 0 && !useFallback) {
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

  if (images.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No images found</h3>
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
            {error || "Unable to connect to the image service. Showing sample content instead."}
            <Button onClick={handleRetry} variant="link" className="p-0 h-auto ml-2">
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {images.map((image) => (
          <ImageCard key={image.id} image={image} />
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
