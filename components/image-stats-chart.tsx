"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useTheme } from "next-themes"

interface Visit {
  id: number
  date: string
}

export function ImageStatsChart() {
  const [data, setData] = useState<any[]>([])
  const { theme } = useTheme()
  const isDark = theme === "dark"

  useEffect(() => {
  
    const visits = JSON.parse(localStorage.getItem("image_visits") || "[]") as Visit[]
    const downloads = JSON.parse(localStorage.getItem("image_downloads") || "[]") as Visit[]

   
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - i)
      return date.toISOString().split("T")[0]
    }).reverse()

    const chartData = last7Days.map((day) => {
      const dayVisits = visits.filter((v) => v.date.startsWith(day)).length
      const dayDownloads = downloads.filter((d) => d.date.startsWith(day)).length

      return {
        date: new Date(day).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        views: dayVisits,
        downloads: dayDownloads,
      }
    })

    setData(chartData)
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
          <XAxis dataKey="date" stroke={isDark ? "#888" : "#333"} />
          <YAxis stroke={isDark ? "#888" : "#333"} />
          <Tooltip
            contentStyle={{
              backgroundColor: isDark ? "#333" : "#fff",
              color: isDark ? "#fff" : "#333",
              border: `1px solid ${isDark ? "#444" : "#ddd"}`,
            }}
          />
          <Legend />
          <Bar dataKey="views" name="Views" fill="#8884d8" />
          <Bar dataKey="downloads" name="Downloads" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
