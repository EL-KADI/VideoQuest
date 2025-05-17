import { FavoritesList } from "@/components/favorites-list"

export default function FavoritesPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Favorites</h1>
        <p className="text-muted-foreground">View and manage your favorite videos and images</p>
      </div>
      <FavoritesList />
    </div>
  )
}
