import bcrypt from 'bcrypt'
import { db } from './db'
import { User } from '@prisma/client'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789'
  let password = ''
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export async function createUserWithTempPassword(data: {
  email: string
  firstName?: string
  lastName?: string
  role?: 'USER' | 'ADMIN'
}): Promise<{ user: User; tempPassword: string }> {
  const normalizedEmail = data.email.trim().toLowerCase()
  const tempPassword = generateTemporaryPassword()
  const hashedPassword = await hashPassword(tempPassword)
  
  const user = await db.user.create({
    data: {
      email: normalizedEmail,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || 'USER',
      hashedPassword,
      isActive: true,  // Auto-activate new accounts
      mustReset: true, // Force user to set their own password on first login
    },
  })
  
  return { user, tempPassword }
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const normalizedEmail = email.trim().toLowerCase()
  const user = await db.user.findFirst({
    where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
  })
  
  if (!user) {
    return null
  }
  
  const isValid = await verifyPassword(password, user.hashedPassword)
  if (!isValid) {
    return null
  }
  
  return user
}

export function validatePasswordStrength(password: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (password.length < 12) {
    errors.push('Password must contain at least 12 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one symbol (!@#$%^&*...)')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function updateUserPassword(userId: string, newPassword: string): Promise<void> {
  const hashedPassword = await hashPassword(newPassword)
  
  await db.user.update({
    where: { id: userId },
    data: {
      hashedPassword,
      mustReset: false,
    },
  })
}
