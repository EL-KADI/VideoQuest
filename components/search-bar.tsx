"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("query") || ""

  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 500)

  useEffect(() => {
    if (debouncedQuery) {
      const params = new URLSearchParams(searchParams)
      params.set("query", debouncedQuery)
      router.push(`?${params.toString()}`)
    }
  }, [debouncedQuery, router, searchParams])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      const params = new URLSearchParams(searchParams)
      params.set("query", query)
      router.push(`?${params.toString()}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-3xl mx-auto mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search videos, topics, or keywords..."
          className="pl-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <Button type="submit" className="ml-2">
        Search
      </Button>
    </form>
  )
}
