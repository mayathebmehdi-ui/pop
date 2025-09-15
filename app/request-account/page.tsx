'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { validateEmail } from '@/lib/utils'
import { CheckCircle } from 'lucide-react'

export default function RequestAccountPage() {
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    useCase: '',
    expectedVolume: '',
    message: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate form
    const newErrors: Record<string, string> = {}
    
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required'
    }
    
    if (!formData.email) {
      newErrors.email = 'Work email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.useCase.trim()) {
      newErrors.useCase = 'Use case is required'
    }
    
    if (!formData.expectedVolume.trim()) {
      newErrors.expectedVolume = 'Expected volume is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

      const response = await fetch('/api/request-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        setIsSuccess(true)
        setFormData({
          company: '',
          email: '',
          useCase: '',
          expectedVolume: '',
          message: '',
        })
      } else {
        const data = await response.json().catch(() => ({}))
        if (response.status === 409) {
          setErrors({ email: data.error || 'Account is already created with this email' })
        } else if (data?.error) {
          setErrors({ submit: data.error })
        } else {
          setErrors({ submit: 'Failed to submit request. Please try again.' })
        }
        return
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      if (error instanceof Error && error.name === 'AbortError') {
        setErrors({ submit: 'Request timed out. Please try again or contact support if the problem persists.' })
      } else {
        setErrors({ submit: 'Failed to submit request. Please try again.' })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        
        <main className="flex-1 flex items-center justify-center py-12 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md text-center"
          >
            <div className="rounded-full bg-green-100/10 border border-green-500/30 w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Account Created Successfully!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Your account has been activated and a temporary password has been sent to your email. Please check your inbox (and spam folder) to log in.
            </p>
            <Button asChild>
              <a href="/">Back to home</a>
            </Button>
          </motion.div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Request Enterprise Access
            </h1>
            <p className="text-muted-foreground">
              Tell us about your organization and verification needs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                  Company *
                </label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  required
                  value={formData.company}
                  onChange={handleChange}
                  className={errors.company ? 'border-destructive' : ''}
                  placeholder="Your company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-destructive">{errors.company}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Work email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
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
            </div>

            <div>
              <label htmlFor="useCase" className="block text-sm font-medium text-foreground mb-2">
                Use case *
              </label>
              <Input
                id="useCase"
                name="useCase"
                type="text"
                required
                value={formData.useCase}
                onChange={handleChange}
                className={errors.useCase ? 'border-destructive' : ''}
                placeholder="e.g., Insurance claims, Banking KYC, Healthcare records"
              />
              {errors.useCase && (
                <p className="mt-1 text-sm text-destructive">{errors.useCase}</p>
              )}
            </div>

            <div>
              <label htmlFor="expectedVolume" className="block text-sm font-medium text-foreground mb-2">
                Expected volume *
              </label>
              <Input
                id="expectedVolume"
                name="expectedVolume"
                type="text"
                required
                value={formData.expectedVolume}
                onChange={handleChange}
                className={errors.expectedVolume ? 'border-destructive' : ''}
                placeholder="e.g., 100-500 searches per month"
              />
              {errors.expectedVolume && (
                <p className="mt-1 text-sm text-destructive">{errors.expectedVolume}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                Additional message
              </label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your specific requirements, compliance needs, or integration preferences..."
                className="min-h-[120px]"
              />
            </div>

            {errors.submit && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-sm text-destructive">{errors.submit}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              size="lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <a
                href="/login"
                className="text-primary hover:text-primary/80 transition-colors font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}

