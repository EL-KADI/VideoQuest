import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const videoId = request.nextUrl.searchParams.get("id")
  const query = request.nextUrl.searchParams.get("query") || "nature"
  const limit = request.nextUrl.searchParams.get("limit") || "4"

  if (!videoId) {
    return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
  }

  try {

    const endpoint = `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${limit}`

    const response = await fetch(endpoint, {
      headers: {
        Authorization: "79olecnbkMllO3gaidCw5AvxLbCVmnwPh8rlyq7YtRHKSvxpkG0BOyU6",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Pexels API responded with status: ${response.status}`)
    }

    const data = await response.json()

    
    const filteredVideos = data.videos.filter((video: any) => video.id.toString() !== videoId)

    return NextResponse.json({ videos: filteredVideos.slice(0, Number.parseInt(limit)) })
  } catch (error) {
    console.error("Error fetching related videos:", error)
    return NextResponse.json({ error: "Failed to fetch related videos" }, { status: 500 })
  }
}
