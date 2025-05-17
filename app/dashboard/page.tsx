import { StatsCards } from "@/components/stats-cards"
import { VideoStatsChart } from "@/components/video-stats-chart"
import { ImageStatsChart } from "@/components/image-stats-chart"
import { FavoritesList } from "@/components/favorites-list"

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">View your activity statistics and favorites</p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Video Statistics</h2>
          <VideoStatsChart />
        </div>
        <div className="bg-card rounded-lg p-6 shadow">
          <h2 className="text-xl font-semibold mb-4">Image Statistics</h2>
          <ImageStatsChart />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Favorites</h2>
        <FavoritesList />
      </div>
    </div>
  )
}
