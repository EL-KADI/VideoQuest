import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const videoId = request.nextUrl.searchParams.get("id") || "video"

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {
   
    const response = await fetch(url, {
      headers: {
        Authorization: "79olecnbkMllO3gaidCw5AvxLbCVmnwPh8rlyq7YtRHKSvxpkG0BOyU6",
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch video: ${response.status}`)
    }

    const videoBuffer = await response.arrayBuffer()

    return new NextResponse(videoBuffer, {
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="video-${videoId}.mp4"`,
        "Content-Length": videoBuffer.byteLength.toString(),
      },
    })
  } catch (error) {
    console.error("Error downloading video:", error)
    return NextResponse.json({ error: "Failed to download video" }, { status: 500 })
  }
}
