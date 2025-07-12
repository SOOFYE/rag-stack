'use client'

import { useEffect, useState } from 'react'
import { Dashboard } from '@uppy/react'
import '@uppy/core/dist/style.min.css'
import '@uppy/dashboard/dist/style.min.css'
import { useUppyWithSupabase } from '@/hooks/useUppyWithSupabase'
import { toast } from 'react-toastify'
import {socket} from '../../../../../utils/sockets/socket'

type UploadedFile = {
  name: string
  url: string
  object_name: string
}

type FileStatus = 'waiting' | 'processing' | 'done' | 'failed'

type ProgressStatus = {
  [objectName: string]: {
    progress: number
    status: FileStatus
  }
}

export default function FilesPage() {
  const uppy = useUppyWithSupabase({ bucketName: 'documents' })
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [progressMap, setProgressMap] = useState<ProgressStatus>({})
  const [queueStats, setQueueStats] = useState({
    total: 0,
    processing: 0,
    failed: 0,
  })

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/documents')
      const data = await res.json()
      if (res.ok) {
        setUploadedFiles(data.documents)
        
      } else {
        toast.error(data.error || 'Failed to fetch documents')
      }
    } catch (err) {
      console.error(err)
      toast.error('Something went wrong fetching files.')
    }
  }

  const handleUploadSuccess = async (file: any) => {
    const objectName = file.meta?.objectName
    const originalName =
      objectName?.split('-').slice(1).join('-') || file.name

    const metadata = {
      name: originalName,
      object_name: objectName,
      type: file.type,
      size: file.size,
    }

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata),
      })

      if (!res.ok) throw new Error('Failed to save metadata')
      fetchDocuments()
    } catch (err) {
      console.error(err)
      toast.error(`Upload succeeded but saving metadata failed`)
    }
  }

  

 useEffect(() => {
    
    socket.on('queue:stats', (stats) => {
      setQueueStats(stats)
    })

    socket.on('queue:status-list', (data) => {
      const updatedMap: ProgressStatus = {}

      data.waiting.forEach((job: any) => {
        updatedMap[job.objectName] = { progress: 0, status: 'waiting' }
      })

      data.processing.forEach((job: any) => {
        updatedMap[job.objectName] = { progress: 50, status: 'processing' }
      })

      data.failed.forEach((job: any) => {
        updatedMap[job.objectName] = { progress: 0, status: 'failed' }
      })

      setProgressMap(updatedMap)
    })

    socket.on('job:progress', (data) => {
      setProgressMap((prev) => ({
        ...prev,
        [data.objectName]: {
          progress: data.progress,
          status: 'processing',
        },
      }))
    })

    socket.on('job:done', (data) => {
      setProgressMap((prev) => ({
        ...prev,
        [data.objectName]: {
          progress: 100,
          status: 'done',
        },
      }))
    })

    socket.on('job:failed', (data) => {
      setProgressMap((prev) => ({
        ...prev,
        [data.objectName]: {
          progress: 0,
          status: 'failed',
        },
      }))
    })

    return () => {
      socket.disconnect()
    }
  }, [])

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    if (!uppy) return

    const handleUploadError = (file: any, error: any) => {
      console.error(`Error uploading ${file.name}:`, error)
      toast.error(`Failed to upload files`)
    }

    uppy.on('upload-success', handleUploadSuccess)
    uppy.on('upload-error', handleUploadError)

    return () => {
      uppy.off('upload-success', handleUploadSuccess)
      uppy.off('upload-error', handleUploadError)
    }
  }, [uppy])


  return (
    <div className="p-6 space-y-8 h-[calc(100vh-64px)] overflow-y-auto text-black flex flex-col items-center">
      {/* Uppy Dashboard */}
      <div className="w-full max-w-4xl">
        {uppy && <Dashboard uppy={uppy} height={300} />}
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {[
          { label: 'Total documents in queue', value: queueStats.total },
          { label: 'Currently being processed', value: queueStats.processing },
          { label: 'Failed documents in queue', value: queueStats.failed },
        ].map(({ label, value }, idx) => (
          <div
            key={idx}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6 flex flex-col items-center justify-center shadow hover:shadow-lg transition"
          >
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mb-2">
              <span className="text-3xl font-bold text-black">{value}</span>
            </div>
            <p className="text-sm text-center">{label}</p>
          </div>
        ))}
      </div>

 {/* Uploaded Files List */}
      <div className="w-full max-w-4xl">
        <h2 className="text-lg font-semibold mb-4">Your Files</h2>
        <div className="max-h-[600px] overflow-y-scroll">
          <ul className="flex flex-col gap-3">
            {uploadedFiles.map((file, i) => {
              const progress = progressMap[file.object_name]
              const status = progress?.status || 'done'
              const iconClass =
                status === 'processing' ? 'animate-spin' : ''

              return (
                <li
                  key={i}
                  className="bg-white/10 border border-white/20 backdrop-blur-md rounded p-3 shadow hover:shadow-md transition"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className={`text-lg ${iconClass}`}>📄</span>
                      <span className="truncate max-w-xs">{file.name}</span>
                      {progress && (
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            status === 'done'
                              ? 'bg-green-200 text-green-800'
                              : status === 'failed'
                              ? 'bg-red-200 text-red-800'
                              : status === 'waiting'
                              ? 'bg-gray-200 text-gray-800'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                      )}
                    </div>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </a>
                  </div>

                  {/* Progress Bar */}
                  {progress && (
                    <div className="w-full mt-2 bg-white/20 h-2 rounded">
                      <div
                        className={`h-full rounded transition-all duration-500 ${
                          status === 'done'
                            ? 'bg-green-500'
                            : status === 'failed'
                            ? 'bg-red-500'
                            : status === 'waiting'
                            ? 'bg-gray-500'
                            : 'bg-yellow-500'
                        }`}
                        style={{ width: `${progress.progress}%` }}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}