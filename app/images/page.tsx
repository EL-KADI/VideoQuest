import { ImageGrid } from "@/components/image-grid"
import { SearchBar } from "@/components/search-bar"

export default function ImagesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Images</h1>
        <p className="text-muted-foreground">Explore high-quality images from around the web</p>
      </div>
      <SearchBar />
      <ImageGrid />
    </div>
  )
}
