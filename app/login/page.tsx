'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { validateEmail } from '@/lib/utils'
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate form
    const newErrors: Record<string, string> = {}
    
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      // Real authentication
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Check if user must reset password first
        if (data.user.mustReset) {
          // Redirect to set password page for first-time login
          window.location.href = '/set-password'
        } else if (data.user.role === 'ADMIN') {
          // Redirect to admin dashboard
          window.location.href = '/admin'
        } else {
          // Redirect to main app
          window.location.href = '/app'
        }
      } else {
        // Login failed
        setErrors({ submit: data.error || 'Login failed' })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
        <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 flex items-center justify-center py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Sign in to your account
            </h1>
            <p className="text-muted-foreground">
              Access your Deceased Status dashboard
            </p>
          </div>

          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
            >
              <p className="text-red-700 dark:text-red-300 text-sm font-medium">
                {errors.submit}
              </p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'border-destructive' : ''}
                placeholder="your@company.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'border-destructive' : ''}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-sm text-primary hover:text-primary/80 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-4">
            <Link
              href="/forgot-password"
              className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors block"
            >
              Forgot your password?
            </Link>
            
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link
                href="/request-account"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Request access
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  )
}
