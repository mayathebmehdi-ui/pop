'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Lock, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    // Validate form
    const newErrors: Record<string, string> = {}
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        setErrors({ submit: data.error || 'Password reset failed' })
      }
    } catch (error) {
      console.error('Reset password error:', error)
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

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
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
            <h1 className="text-3xl font-bold text-white mb-4">
              Password Updated!
            </h1>
            <p className="text-lg text-slate-400 mb-8">
              Your password has been successfully changed.
            </p>
            <Button asChild>
              <a href="/app">Go to Dashboard</a>
            </Button>
          </motion.div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <div className="rounded-full bg-indigo-100/10 border border-indigo-500/30 w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-8 w-8 text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Reset Password
            </h1>
            <p className="text-slate-400">
              Change your password to something more secure
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Current Password */}
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="currentPassword"
                    name="currentPassword"
                    type={showPasswords.current ? "text" : "password"}
                    required
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white ${errors.currentPassword ? 'border-red-500' : ''}`}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('current')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.currentPassword}</p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="newPassword"
                    name="newPassword"
                    type={showPasswords.new ? "text" : "password"}
                    required
                    value={formData.newPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white ${errors.newPassword ? 'border-red-500' : ''}`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('new')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.newPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.newPassword}</p>
                )}
                <p className="mt-1 text-xs text-slate-400">
                  Must be at least 8 characters long
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPasswords.confirm ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => toggleShowPassword('confirm')}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-300"
                  >
                    {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
                )}
              </div>

              {errors.submit && (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                  <p className="text-sm text-red-400">{errors.submit}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-indigo-500 hover:bg-indigo-600"
                disabled={isSubmitting}
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating Password...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  )
}
