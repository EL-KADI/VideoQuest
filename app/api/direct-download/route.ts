import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")

  if (!url) {
    return NextResponse.json({ error: "URL parameter is required" }, { status: 400 })
  }

  try {

    return NextResponse.redirect(url)
  } catch (error) {
    console.error("Error redirecting to download:", error)
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 })
  }
}
