import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url")
  const filename = request.nextUrl.searchParams.get("filename") || "download"

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
      throw new Error(`Failed to fetch file: ${response.status}`)
    }


    const fileBuffer = await response.arrayBuffer()

  
    const fileResponse = new NextResponse(fileBuffer)

 
    fileResponse.headers.set("Content-Type", response.headers.get("Content-Type") || "application/octet-stream")
    fileResponse.headers.set("Content-Disposition", `attachment; filename="${filename}"`)

    return fileResponse
  } catch (error) {
    console.error("Error downloading file:", error)
    return NextResponse.json({ error: "Failed to download file" }, { status: 500 })
  }
}
