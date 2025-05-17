import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  try {
   
    const response = await fetch(`https://api.pexels.com/videos/videos/${id}`, {
      headers: {
        Authorization: "79olecnbkMllO3gaidCw5AvxLbCVmnwPh8rlyq7YtRHKSvxpkG0BOyU6",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Video not found" }, { status: 404 })
      }
      throw new Error(`Pexels API responded with status: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching video from Pexels:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}
