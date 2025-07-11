'use client'

import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function FilesPage() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Accepted files:', acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    multiple: true,
  })

  return (
    <div className="p-6 space-y-8 h-[calc(100vh-64px)] overflow-y-auto text-black flex flex-col">

       {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`self-center w-full max-w-4xl bg-white/10 border border-white/20 rounded-lg p-6 backdrop-blur-md shadow-md cursor-pointer text-center transition ${
          isDragActive ? 'border-blue-400' : 'hover:border-white/30'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-black">
          {isDragActive
            ? 'Drop the files here...'
            : 'Drag and drop files here, or click to browse'}
        </p>
        <p className="text-xs text-black mt-2">
          Accepted: PDF, TXT, DOC, DOCX
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          'Total documents in queue',
          'Your Processed Documents',
          'Your Documents in Queue',
        ].map((label, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 flex flex-col items-center justify-center shadow hover:shadow-lg transition"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <span className="text-6xl font-bold text-blue-800">0</span>
            </div>
            <p className="text-sm text-center">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Your Files</h2>
        <ul className="space-y-3">
          {[1, 2, 3].map((file) => (
            <li
              key={file}
              className="bg-white/10 border border-white/20 backdrop-blur-md rounded p-3 shadow hover:shadow-md transition"
            >
              📄 File {file}.pdf
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
