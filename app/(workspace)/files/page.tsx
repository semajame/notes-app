"use client"

import { useEffect, useState } from "react"

type FileItem = {
  id: string
  name: string
  file_url: string
  file_type: string
  created_at: string
}

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([])
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null)

  const fetchFiles = async () => {
    const res = await fetch("/api/files")
    const data = await res.json()
    setFiles(data)
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("file", file)

    await fetch("/api/files", {
      method: "POST",
      body: formData,
    })

    fetchFiles()
  }

  return (
    <div className="flex h-full bg-[var(--bg)]">
      <div className="w-1/3 border-r border-[var(--border)] p-4">
        <h2 className="mb-4 text-xl font-bold text-[var(--text)]">
          Files & PDFs
        </h2>

        <input type="file" onChange={uploadFile} className="mb-4" />

        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className="rounded-lg bg-[var(--bg2)] p-3 text-left text-[var(--text)] hover:bg-[var(--bg3)]"
            >
              {file.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6">
        {selectedFile ? (
          <>
            <h3 className="mb-4 text-lg font-bold text-[var(--text)]">
              {selectedFile.name}
            </h3>

            {selectedFile.file_type.includes("pdf") ? (
              <iframe
                src={selectedFile.file_url}
                className="h-full w-full rounded-lg border"
              />
            ) : (
              <img
                src={selectedFile.file_url}
                className="max-h-full max-w-full rounded-lg"
                alt={selectedFile.name}
              />
            )}
          </>
        ) : (
          <p className="text-[var(--muted)]">Select a file to preview</p>
        )}
      </div>
    </div>
  )
}
