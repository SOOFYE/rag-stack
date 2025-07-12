import { Queue } from 'bullmq'
import IORedis from 'ioredis'
import { REDIS_URL } from '../config/redis'

const connection = new IORedis(REDIS_URL,{maxRetriesPerRequest: 3})

export const documentQueue = new Queue('document-processing-queue', {
  connection,
  defaultJobOptions: {
    attempts: 3, 
    backoff: {
      type: 'exponential', 
      delay: 1000, 
    },
    removeOnComplete: true,
    removeOnFail: false, 
  },
})