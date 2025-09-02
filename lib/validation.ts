import { z } from 'zod'

export const RequestAccountSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  email: z.string().email('Invalid email address'),
  useCase: z.string().min(1, 'Use case is required'),
  expectedVolume: z.string().min(1, 'Expected volume is required'),
  message: z.string().optional(),
})

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const ResetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export const SearchSchema = z.object({
  fname: z.string().min(1, 'First name is required').transform(s => s.trim().toUpperCase()),
  mname: z.string().optional().transform(s => s ? s.trim().toUpperCase() : undefined),
  lname: z.string().min(1, 'Last name is required').transform(s => s.trim().toUpperCase()),
  dob: z.string().min(1, 'Date of birth is required'),
  city: z.string().min(1, 'City is required').transform(s => s.trim().toUpperCase()),
  state: z.string().length(2, 'State must be 2 characters').transform(s => s.trim().toUpperCase()),
})

export const BulkSearchRowSchema = z.object({
  fname: z.string().min(1, 'First name is required'),
  mname: z.string().optional(),
  lname: z.string().min(1, 'Last name is required'),
  dob: z.string().min(1, 'Date of birth is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
})

export function normalizeDOB(dob: string): string {
  // Convert YYYY-MM-DD to YYYYMMDD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return dob.replace(/-/g, '')
  }
  
  // Already in YYYYMMDD format
  if (/^\d{8}$/.test(dob)) {
    return dob
  }
  
  throw new Error('Invalid date format. Expected YYYY-MM-DD or YYYYMMDD')
}

export function validateBulkCSVRow(row: any): { valid: boolean; data?: any; errors?: string[] } {
  try {
    const result = BulkSearchRowSchema.parse(row)
    
    // Normalize the data
    const normalizedData = {
      fname: result.fname.trim().toUpperCase(),
      mname: result.mname ? result.mname.trim().toUpperCase() : undefined,
      lname: result.lname.trim().toUpperCase(),
      dob: normalizeDOB(result.dob),
      city: result.city.trim().toUpperCase(),
      state: result.state.trim().toUpperCase(),
    }
    
    return { valid: true, data: normalizedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, errors: error.errors.map(e => e.message) }
    }
    return { valid: false, errors: ['Invalid row format'] }
  }
}

export type RequestAccountInput = z.infer<typeof RequestAccountSchema>
export type LoginInput = z.infer<typeof LoginSchema>
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>
export type SearchInput = z.infer<typeof SearchSchema>
export type BulkSearchRowInput = z.infer<typeof BulkSearchRowSchema>
