"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface Note {
  id: string
  videoId: number
  timestamp: number
  text: string
  createdAt: string
}

interface NotesSectionProps {
  videoId: number
}

export function NotesSection({ videoId }: NotesSectionProps) {
  const [notes, setNotes] = useLocalStorage<Note[]>("video_notes", [])
  const [newNote, setNewNote] = useState("")
  const [currentTime, setCurrentTime] = useState(0)

  
  useEffect(() => {
    const videoElement = document.querySelector("video")
    if (!videoElement) return

    const updateTime = () => {
      setCurrentTime(videoElement.currentTime)
    }

    videoElement.addEventListener("timeupdate", updateTime)

    return () => {
      videoElement.removeEventListener("timeupdate", updateTime)
    }
  }, [])

  const videoNotes = notes.filter((note) => note.videoId === videoId)

  const addNote = () => {
    if (!newNote.trim()) return

    const note: Note = {
      id: Date.now().toString(),
      videoId,
      timestamp: currentTime,
      text: newNote,
      createdAt: new Date().toISOString(),
    }

    setNotes([...notes, note])
    setNewNote("")
  }

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id))
  }

  const seekToTimestamp = (timestamp: number) => {
    const videoElement = document.querySelector("video")
    if (!videoElement) return

    videoElement.currentTime = timestamp
    videoElement.play()
  }

  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Notes</h2>

      <div className="flex gap-2 mb-6">
        <div className="flex-1">
          <Textarea
            placeholder="Add a note about this video..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="resize-none"
          />
          <div className="text-xs text-muted-foreground mt-1">Current timestamp: {formatTimestamp(currentTime)}</div>
        </div>
        <Button onClick={addNote}>Add Note</Button>
      </div>

      {videoNotes.length > 0 ? (
        <div className="space-y-4">
          {videoNotes.map((note) => (
            <div key={note.id} className="border rounded-md p-4">
              <div className="flex justify-between items-start">
                <button
                  onClick={() => seekToTimestamp(note.timestamp)}
                  className="text-sm font-medium text-primary hover:underline"
                >
                  {formatTimestamp(note.timestamp)}
                </button>
                <Button variant="ghost" size="sm" onClick={() => deleteNote(note.id)} className="h-6 px-2">
                  Delete
                </Button>
              </div>
              <p className="mt-2">{note.text}</p>
              <div className="text-xs text-muted-foreground mt-2">{new Date(note.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">No notes yet. Add your first note above.</div>
      )}
    </div>
  )
}
