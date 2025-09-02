import { Queue, Worker, Job } from 'bullmq'
import IORedis from 'ioredis'
import { db } from './db'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

export const bulkSearchQueue = new Queue('bulk-search', {
  connection,
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
  },
})

export interface BulkSearchJobData {
  batchId: string
  userId: string
  rows: Array<{
    fname: string
    mname?: string
    lname: string
    dob: string
    city: string
    state: string
  }>
}

export interface SearchResult {
  success: boolean
  data?: any
  error?: string
}

async function processDeathCheckSearch(searchData: {
  fname: string
  mname?: string
  lname: string
  dob: string
  city: string
  state: string
}): Promise<SearchResult> {
  try {
    const apiUrl = process.env.DEATH_CHECK_API_URL
    const apiKey = process.env.DEATH_CHECK_API_KEY
    
    if (!apiUrl || !apiKey) {
      throw new Error('API configuration missing')
    }
    
    const params = new URLSearchParams({
      fname: searchData.fname,
      lname: searchData.lname,
      dob: searchData.dob,
      city: searchData.city,
      state: searchData.state,
    })
    
    if (searchData.mname) {
      params.set('mname', searchData.mname)
    }
    
    const response = await fetch(`${apiUrl}?${params}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
    })
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}: ${response.statusText}`)
    }
    
    const result = await response.json()
    return { success: true, data: result }
  } catch (error) {
    console.error('Death check search error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}

// Worker to process bulk search jobs
const bulkSearchWorker = new Worker<BulkSearchJobData>(
  'bulk-search',
  async (job: Job<BulkSearchJobData>) => {
    const { batchId, userId, rows } = job.data
    
    try {
      // Update batch status to processing
      await db.batchUpload.update({
        where: { id: batchId },
        data: { 
          status: 'processing',
          totalRows: rows.length 
        },
      })
      
      const results = []
      let processedCount = 0
      let errorCount = 0
      
      for (const row of rows) {
        try {
          // Update progress
          await job.updateProgress({
            processed: processedCount,
            total: rows.length,
            current: row,
          })
          
          // Process the search
          const searchResult = await processDeathCheckSearch(row)
          
          // Store individual search request
          const searchRequest = await db.searchRequest.create({
            data: {
              userId,
              payload: JSON.stringify(row),
              status: searchResult.success ? 'ok' : 'error',
              result: searchResult.data || { error: searchResult.error },
            },
          })
          
          results.push({
            ...row,
            requestId: searchRequest.id,
            status: searchResult.success ? 'ok' : 'error',
            result: searchResult.data,
            error: searchResult.error,
          })
          
          if (searchResult.success) {
            processedCount++
          } else {
            errorCount++
          }
          
          // Update batch progress
          await db.batchUpload.update({
            where: { id: batchId },
            data: {
              processedRows: processedCount,
              errorRows: errorCount,
            },
          })
          
          // Small delay to avoid overwhelming the API
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          console.error('Error processing row:', error)
          errorCount++
          results.push({
            ...row,
            status: 'error',
            error: error instanceof Error ? error.message : 'Processing error',
          })
        }
      }
      
      // Mark batch as complete
      await db.batchUpload.update({
        where: { id: batchId },
        data: {
          status: 'done',
          processedRows: processedCount,
          errorRows: errorCount,
          // In a real app, you'd upload results to S3 or similar and store the URL
          resultUrl: `/api/batch/${batchId}/results`,
        },
      })
      
      return {
        batchId,
        totalRows: rows.length,
        processedRows: processedCount,
        errorRows: errorCount,
        results,
      }
    } catch (error) {
      console.error('Bulk search job failed:', error)
      
      // Mark batch as error
      await db.batchUpload.update({
        where: { id: batchId },
        data: { 
          status: 'error',
        },
      })
      
      throw error
    }
  },
  { connection }
)

export { bulkSearchWorker }
