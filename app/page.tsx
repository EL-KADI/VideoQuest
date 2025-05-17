import { VideoGrid } from "@/components/video-grid"
import { SearchBar } from "@/components/search-bar"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Discover Videos</h1>
        <p className="text-muted-foreground">Explore educational and entertainment videos from around the web</p>
      </div>
      <SearchBar />
      <VideoGrid />
    </div>
  )
}
