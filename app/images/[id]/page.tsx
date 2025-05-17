"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Heart, Download, ArrowLeft, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"

interface ImageDetails {
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

export default function ImageDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [image, setImage] = useState<ImageDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  const [favorites, setFavorites] = useLocalStorage<number[]>("image_favorites", [])
  const isFavorite = favorites.includes(Number(id))

  const [visits, setVisits] = useLocalStorage<{ id: number; date: string }[]>("image_visits", [])
  const [visitRecorded, setVisitRecorded] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const [relatedImages, setRelatedImages] = useState<ImageDetails[]>([])
  const [loadingRelated, setLoadingRelated] = useState(true)

  useEffect(() => {
    const fetchImage = async () => {
      if (!id) return

      try {
        setLoading(true)
        setError("")

       
        const response = await fetch(`/api/images/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          cache: "no-store",
        })

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Image not found")
          }
          throw new Error(`Failed to fetch image: ${response.status}`)
        }

        const data = await response.json()
        setImage(data)
      } catch (err) {
        console.error("Error loading image:", err)
        setError(err instanceof Error ? err.message : "Error loading image. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchImage()
  }, [id, retryCount])

 
  useEffect(() => {
    if (image && !visitRecorded) {
     
      const newVisit = { id: Number(id), date: new Date().toISOString() }
      setVisits((prev) => {
        const filtered = prev.filter((v) => v.id !== Number(id))
        return [newVisit, ...filtered]
      })
      setVisitRecorded(true)
    }
  }, [image, id, setVisits, visitRecorded])

 
  useEffect(() => {
    const fetchRelatedImages = async () => {
      if (!image) return

      try {
        setLoadingRelated(true)
       
        const query = image.photographer || "similar"
        const response = await fetch(`/api/related/images?id=${id}&query=${encodeURIComponent(query)}&limit=3`)

        if (!response.ok) {
          throw new Error("Failed to fetch related images")
        }

        const data = await response.json()
        setRelatedImages(data.images || [])
      } catch (error) {
        console.error("Error fetching related images:", error)
      } finally {
        setLoadingRelated(false)
      }
    }

    if (image) {
      fetchRelatedImages()
    }
  }, [image, id])

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav !== Number(id)))
      toast({
        title: "Removed from favorites",
        description: "Image has been removed from your favorites",
      })
    } else {
      setFavorites([...favorites, Number(id)])
      toast({
        title: "Added to favorites",
        description: "Image has been added to your favorites",
      })
    }
  }

  const handleDownload = async () => {
    if (!image) return

    try {
      setIsDownloading(true)

     
      const downloads = JSON.parse(localStorage.getItem("image_downloads") || "[]")
      const newDownload = { id: Number(id), date: new Date().toISOString() }
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

  if (error || !image) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Image not found"}</AlertDescription>
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

  return (
    <div className="container mx-auto px-4 py-6">
      <Button onClick={goBack} variant="outline" className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Go Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={image.src.large2x || "/placeholder.svg"}
              alt={image.alt || "Image"}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 800px"
              priority
            />
          </div>

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
            <h1 className="text-2xl font-bold">{image.alt || `Photo by ${image.photographer}`}</h1>
            <div className="mt-2 text-muted-foreground">
              <p>
                By:{" "}
                <a href={image.photographer_url} target="_blank" rel="noopener noreferrer" className="underline">
                  {image.photographer}
                </a>
              </p>
              <p>
                Resolution: {image.width}x{image.height}
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Related Images</h2>
          {loadingRelated ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-muted animate-pulse h-32 rounded-md" />
              ))}
            </div>
          ) : relatedImages.length > 0 ? (
            <div className="space-y-4">
              {relatedImages.map((relatedImage) => (
                <Link href={`/images/${relatedImage.id}`} key={relatedImage.id}>
                  <div className="flex gap-2 p-2 rounded-md hover:bg-muted transition-colors">
                    <div className="relative w-24 h-16 flex-shrink-0">
                      <Image
                        src={relatedImage.src.small || "/placeholder.svg"}
                        alt={relatedImage.alt || `Photo by ${relatedImage.photographer}`}
                        fill
                        className="object-cover rounded-md"
                        sizes="100px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">
                        {relatedImage.alt || `Photo by ${relatedImage.photographer}`}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{relatedImage.photographer}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-muted h-32 rounded-md flex items-center justify-center">
              <p className="text-sm text-muted-foreground">No related images found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
