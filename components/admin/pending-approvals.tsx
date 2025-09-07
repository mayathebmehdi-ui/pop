'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Clock, User, Mail, Calendar, CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

interface PendingUser {
  id: string
  email: string
  name: string
  firstName?: string
  lastName?: string
  createdAt: string
  role: string
}

export function PendingApprovals() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(false)
  const [processingUsers, setProcessingUsers] = useState<Set<string>>(new Set())

  const loadPendingUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/pending-approvals')
      if (response.ok) {
        const data = await response.json()
        setPendingUsers(data.pendingUsers || [])
      }
    } catch (error) {
      console.error('Error loading pending users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPendingUsers()
  }, [])

  const handleApproval = async (userId: string, action: 'approve' | 'reject', reason?: string) => {
    setProcessingUsers(prev => new Set(prev).add(userId))
    
    try {
      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, reason })
      })

      if (response.ok) {
        // Remove from pending list
        setPendingUsers(prev => prev.filter(user => user.id !== userId))
        console.log(`User ${action}d successfully`)
      } else {
        const error = await response.json()
        console.error('Approval failed:', error.error)
      }
    } catch (error) {
      console.error('Error processing approval:', error)
    } finally {
      setProcessingUsers(prev => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Clock className="h-5 w-5 text-amber-500" />
          <h2 className="text-xl font-semibold text-foreground">Pending Approvals</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-5 w-5 text-amber-500" />
        <h2 className="text-xl font-semibold text-foreground">Pending Approvals</h2>
        <span className="bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-full text-sm font-medium">
          {pendingUsers.length}
        </span>
      </div>

      {pendingUsers.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
          <p className="text-muted-foreground">No pending approvals</p>
          <p className="text-sm text-muted-foreground mt-1">All users have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{user.name}</span>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded">
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="h-3 w-3" />
                    Awaiting administrative approval
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                    onClick={() => handleApproval(user.id, 'approve')}
                    disabled={processingUsers.has(user.id)}
                  >
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Approve
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                    onClick={() => handleApproval(user.id, 'reject')}
                    disabled={processingUsers.has(user.id)}
                  >
                    <XCircle className="h-3 w-3 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
              
              {processingUsers.has(user.id) && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
                  Processing...
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {pendingUsers.length > 0 && (
        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-200 mb-1">Approval Actions</p>
              <p className="text-amber-700 dark:text-amber-300">
                Approved users will receive email confirmation and can immediately access the system. 
                Rejected users will be notified and their accounts will be deactivated.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
