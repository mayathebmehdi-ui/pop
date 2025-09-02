'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Mail, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    if (!email) {
      setError('Email is required')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to send reset email')
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <Navbar />
        
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                
                <h1 className="text-2xl font-bold text-slate-200 mb-4">
                  Email Sent!
                </h1>
                
                <p className="text-slate-400 mb-8 leading-relaxed">
                  If an account with that email exists, we've sent you a temporary password. 
                  Check your email and use it to log in.
                </p>
                
                <div className="space-y-4">
                  <Link href="/login">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                  
                  <button
                    onClick={() => {
                      setIsSuccess(false)
                      setEmail('')
                    }}
                    className="w-full text-slate-400 hover:text-slate-300 text-sm"
                  >
                    Send to different email
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6">
                <Mail className="w-8 h-8 text-indigo-400" />
              </div>
              
              <h1 className="text-3xl font-bold text-slate-200 mb-2">
                Forgot Password?
              </h1>
              
              <p className="text-slate-400">
                Enter your email and we'll send you a temporary password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="bg-slate-800/50 border-slate-700 text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                  disabled={isSubmitting}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 transition-all duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reset Email
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <Link 
                href="/login"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 inline mr-1" />
                Back to Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  )
}
