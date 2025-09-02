// User types
export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: 'USER' | 'ADMIN'
  isActive: boolean
  mustReset: boolean
  createdAt: string
  updatedAt: string
}

// Search related types
export interface SearchPayload {
  firstName?: string
  lastName?: string
  dateOfBirth?: string
  lastFourDigits?: string
  [key: string]: string | undefined
}

export interface SearchResult {
  id: string
  payload: SearchPayload
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'queued' | 'ok' | 'error'
  result?: {
    isDeceased: boolean
    confidence: number
    result?: string | boolean // For legacy 'True'/'False' values
    error?: string
    dod?: string
    dod_precision?: string
    url?: string
    article?: string
    matchedData?: {
      firstName?: string
      lastName?: string
      dateOfBirth?: string
      dateOfDeath?: string
      location?: string
      [key: string]: any
    }
    source?: string
    verifiedAt?: string
    [key: string]: any // For additional API fields
  }
  createdAt: string
  updatedAt?: string
}

export interface SearchRequest {
  id: string
  userId: string
  payload: SearchPayload
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'queued' | 'ok' | 'error'
  result?: SearchResult['result']
  createdAt: string
  updatedAt?: string
}

// Batch upload types
export interface BatchUpload {
  id: string
  userId: string
  filename: string
  totalRecords: number
  processedRecords: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'done' | 'processing'
  createdAt: string
  updatedAt?: string
  errorMessage?: string
}

// Form types
export interface LoginFormData {
  email: string
  password: string
}

export interface RequestAccountFormData {
  company: string
  email: string
  useCase: string
  expectedVolume: string
  message?: string
}

export interface ResetPasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Component prop types
export interface NavbarProps {
  user?: User | null
}

export interface ResultCardProps {
  result: SearchResult
  index: number
}

export interface StepCardProps {
  icon: any // LucideIcon
  title: string
  description: string
  step: number
  isLast?: boolean
}

export interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export interface BadgeRowProps {
  items: string[]
}

export interface SectionProps {
  children: React.ReactNode
  className?: string
}

export interface FAQItemProps {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}
