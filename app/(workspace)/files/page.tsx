"use client";

import { useEffect, useState } from "react";

type FileItem = {
  id: string;
  name: string;
  file_url: string;
  file_type: string;
  created_at: string;
};

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  const fetchFiles = async () => {
    const res = await fetch("/api/files");
    const data = await res.json();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/files", {
      method: "POST",
      body: formData,
    });

    fetchFiles();
  };

  return (
    <div className="flex h-screen bg-[var(--bg)]">
      {/* LEFT: FILE LIST */}
      <div className="w-1/3 border-r border-[var(--border)] p-4">
        <h2 className="text-xl font-bold mb-4 text-[var(--text)]">
          Files & PDFs
        </h2>

        <input type="file" onChange={uploadFile} className="mb-4" />

        <div className="flex flex-col gap-2">
          {files.map((file) => (
            <button
              key={file.id}
              onClick={() => setSelectedFile(file)}
              className="text-left p-3 rounded-lg bg-[var(--bg2)] hover:bg-[var(--bg3)] text-[var(--text)]"
            >
              📄 {file.name}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: VIEWER */}
      <div className="flex-1 p-6">
        {selectedFile ? (
          <>
            <h3 className="text-lg font-bold mb-4 text-[var(--text)]">
              {selectedFile.name}
            </h3>

            {/* PDF / file viewer */}
            {selectedFile.file_type.includes("pdf") ? (
              <iframe
                src={selectedFile.file_url}
                className="w-full h-full rounded-lg border"
              />
            ) : (
              <img
                src={selectedFile.file_url}
                className="max-w-full max-h-full rounded-lg"
              />
            )}
          </>
        ) : (
          <p className="text-[var(--muted)]">Select a file to preview</p>
        )}
      </div>
    </div>
  );
}
