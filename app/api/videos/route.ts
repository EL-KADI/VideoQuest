import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Get query parameters
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query") || "nature"
  const page = searchParams.get("page") || "1"
  const per_page = searchParams.get("per_page") || "12"

  try {
   
    const endpoint = query
      ? `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${per_page}`
      : `https://api.pexels.com/videos/popular?page=${page}&per_page=${per_page}`

   
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

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching videos from Pexels:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}
