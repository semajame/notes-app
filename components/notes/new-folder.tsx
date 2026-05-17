import { FolderPlus, Check } from "lucide-react"
import { useState, useRef, useEffect } from "react"

function NewFolderInput({
  onCreated,
  onCancel,
}: {
  onCreated?: (folder: any) => void
  onCancel: () => void
}) {
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const createFolder = async () => {
    const trimmed = value.trim()

    if (!trimmed || loading) {
      onCancel()
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmed,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to create folder")
      }

      // optional callback to update UI instantly
      onCreated?.(data)

      setValue("")
      onCancel()
    } catch (err) {
      console.error("Create folder error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex items-center gap-1.5 rounded-xl px-2 py-1.5"
      style={{
        background: C.folderActive,
        border: `1px solid ${C.folder}33`,
      }}
    >
      <div className="flex h-5 w-5 shrink-0 items-center justify-center">
        <FolderPlus className="h-3.5 w-3.5" style={{ color: C.folder }} />
      </div>

      <input
        ref={inputRef}
        value={value}
        disabled={loading}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            createFolder()
          }

          if (e.key === "Escape") {
            e.preventDefault()
            onCancel()
          }
        }}
        onBlur={() => {
          if (!loading) {
            createFolder()
          }
        }}
        placeholder="Folder name..."
        className="min-w-0 flex-1 rounded-md bg-white px-1.5 py-0.5 text-xs outline-none disabled:opacity-50"
      />

      <button
        type="button"
        disabled={loading}
        onMouseDown={(e) => {
          e.preventDefault()
        }}
        onClick={createFolder}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition-all disabled:opacity-50"
        aria-label="Create folder"
      >
        {loading ? (
          <span className="text-[10px]">...</span>
        ) : (
          <Check className="h-3 w-3" />
        )}
      </button>
    </div>
  )
}
