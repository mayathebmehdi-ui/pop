'use client'

import { motion } from 'framer-motion'
import { Clock, Mail, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function PendingApproval() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <div className="relative mb-8">
          <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full flex items-center justify-center">
            <Clock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <motion.div
            className="absolute inset-0 w-16 h-16 mx-auto border-2 border-amber-200 dark:border-amber-800 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-4">
          Account Pending Approval
        </h1>
        
        <div className="space-y-4 text-muted-foreground mb-8">
          <p>
            Your account has been created successfully, but it requires approval before you can access the system.
          </p>
          
          <div className="flex items-center justify-center gap-2 text-sm">
            <Mail className="w-4 h-4" />
            <span>
              Notification sent to: <strong>{process.env.NEXT_PUBLIC_APPROVER_EMAIL || 'peter@publichealthresearch.net'}</strong>
            </span>
          </div>
          
          <p className="text-sm">
            You will receive an email confirmation once your account has been reviewed and approved.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-left">
              <p className="font-medium text-foreground mb-1">Security Notice</p>
              <p className="text-muted-foreground">
                All new accounts require administrative approval to ensure security and compliance with our verification protocols.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" asChild className="flex-1">
            <Link href="/login">Back to Login</Link>
          </Button>
          <Button variant="outline" asChild className="flex-1">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
