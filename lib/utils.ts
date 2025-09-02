import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function calculateMatchConfidence(result: any): number {
  if (!result || typeof result !== 'object') return 0
  
  let confidence = 0
  
  // Base confidence if we have any result
  if (result.result === 'True' || result.result === true) {
    confidence += 40
  }
  
  // Date of death precision
  if (result.dod_precision) {
    switch (result.dod_precision.toLowerCase()) {
      case 'exact':
        confidence += 30
        break
      case 'month':
        confidence += 20
        break
      case 'year':
        confidence += 10
        break
    }
  }
  
  // Source quality
  if (result.url) {
    confidence += 15
  }
  
  if (result.article) {
    confidence += 10
  }
  
  // Additional data points
  if (result.age) confidence += 5
  if (result.location) confidence += 5
  
  // Cap at 99% to never show 100% certainty
  return Math.min(confidence, 99)
}

export function formatSearchPayload(payload: any): string {
  if (!payload || typeof payload !== 'object') return 'N/A'
  
  const parts = []
  if (payload.fname) parts.push(payload.fname)
  if (payload.mname) parts.push(payload.mname)
  if (payload.lname) parts.push(payload.lname)
  
  const name = parts.join(' ')
  const dob = payload.dob ? ` (DOB: ${payload.dob})` : ''
  const location = payload.city && payload.state ? ` - ${payload.city}, ${payload.state}` : ''
  
  return `${name}${dob}${location}`
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function truncate(str: string, length: number = 50): string {
  if (str.length <= length) return str
  return str.substring(0, length) + '...'
}

export function getInitials(firstName?: string, lastName?: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || ''
  const last = lastName?.charAt(0)?.toUpperCase() || ''
  return first + last || 'U'
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}