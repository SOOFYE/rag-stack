import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import { Queue, QueueEvents, Job } from 'bullmq'
import IORedis from 'ioredis'
import { REDIS_URL } from '../config/redis.ts'

const PORT = 3001

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', 
  },
})

const connection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
})

const queueName = 'document-processing-queue'
const queue = new Queue(queueName, { connection })
const queueEvents = new QueueEvents(queueName, { connection })


io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)

  
socket.on('get:job-status', async ({ objectName }) => {
  const allJobs = await Promise.all([
    queue.getWaiting(),
    queue.getActive(),
    queue.getFailed(),
    queue.getCompleted(),
  ]).then(([waiting, active, failed, completed]) => [
    ...waiting,
    ...active,
    ...failed,
    ...completed,
  ])

  const job = allJobs.find((j) => j.data?.objectName === objectName)

  if (!job) {
    return socket.emit('job:status', {
      objectName,
      status: 'not_found',
    })
  }

  let status: 'waiting' | 'processing' | 'done' | 'failed' = 'waiting'

  if (job.finishedOn) {
    status = 'done'
  } else if (job.failedReason) {
    status = 'failed'
  } else if (job.processedOn) {
    status = 'processing'
  }

  socket.emit('job:status', {
    objectName,
    status,
    reason: job.failedReason || null,
    progress:
      status === 'done'
        ? 100
        : status === 'processing'
        ? 50
        : status === 'failed'
        ? 0
        : 0,
  })

  
})


queueEvents.on('progress', async ({ jobId, data }) => {
  const job = await queue.getJob(jobId)
  if (!job) return

  io.emit('job:progress', {
    objectName: job.data.objectName,
    progress: typeof data === 'number' ? data : 50,
  })
})

queueEvents.on('completed', async ({ jobId }) => {
  const job = await queue.getJob(jobId)
  if (!job) return

  io.emit('job:done', {
    objectName: job.data.objectName,
  })
})

queueEvents.on('failed', async ({ jobId, failedReason }) => {
  const job = await queue.getJob(jobId)
  if (!job) return

  io.emit('job:failed', {
    objectName: job.data.objectName,
    reason: failedReason,
  })
})

//Emit overall queue stats + status list every 3 seconds
setInterval(async () => {
  const [waiting, active, failed] = await Promise.all([
    queue.getWaiting(),
    queue.getActive(),
    queue.getFailed(),
  ])

  io.emit('queue:stats', {
    total: waiting.length + active.length,
    processing: active.length,
    failed: failed.length,
  })

  io.emit('queue:status-list', {
    waiting: waiting.map((j) => ({
      id: j.id,
      objectName: j.data.objectName,
    })),
    processing: active.map((j) => ({
      id: j.id,
      objectName: j.data.objectName,
    })),
    failed: failed.map((j) => ({
      id: j.id,
      objectName: j.data.objectName,
      reason: j.failedReason,
    })),
  })
}, 300)
})


server.listen(PORT, () => {
  console.log(`📡 WebSocket server running on http://localhost:${PORT}`)
})
