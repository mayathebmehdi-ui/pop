'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
 
import { Users, Shield, Mail } from 'lucide-react'
import { User } from '@/types'

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const toggleUserActive = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch('/api/admin/users/toggle-active', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !isActive })
      })
      
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error toggling user:', error)
    }
  }

  const toggleUserRole = async (userId: string, role: string) => {
    try {
      const response = await fetch('/api/admin/users/toggle-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: role === 'ADMIN' ? 'USER' : 'ADMIN' })
      })
      
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      console.error('Error toggling role:', error)
    }
  }

  const resendTempPassword = async (userId: string) => {
    try {
      const response = await fetch('/api/admin/users/resend-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      })
      
      if (response.ok) {
        alert('Temporary password sent!')
        loadData()
      }
    } catch (error) {
      console.error('Error resending password:', error)
    }
  }

  const deleteUser = async (userId: string, userEmail: string) => {
    if (confirm(`Are you sure you want to DELETE user ${userEmail}? This action cannot be undone.`)) {
      try {
        const response = await fetch('/api/admin/users/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
        
        if (response.ok) {
          alert('User deleted successfully!')
          loadData()
        } else {
          alert('Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user')
      }
    }
  }

  const logout = async () => {
    try {
      console.log('🚪 Admin logout clicked...')
      const res = await fetch('/api/logout', { 
        method: 'POST',
        credentials: 'include' // Important pour envoyer les cookies
      })
      console.log('🚪 Logout response:', res.status)
      
      if (res.ok) {
        console.log('✅ Logout successful, redirecting to login...')
        // Force reload to clear any cached state
        window.location.href = '/login'
      } else {
        console.error('❌ Logout failed:', res.status)
        // Fallback: redirect anyway to clear state
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('❌ Logout error:', error)
      // Fallback: redirect anyway
      window.location.href = '/login'
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      {/* Minimal top bar with Logout */}
      <div className="w-full border-b border-white/10 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="text-slate-300 text-sm">Admin</div>
          <div className="flex items-center gap-3">
            <Button size="sm" variant="outline" onClick={logout} className="text-xs">Logout</Button>
          </div>
        </div>
      </div>
      
      <main className="flex-1 py-8 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-indigo-400" />
              Admin Panel
            </h1>
            <p className="text-slate-400">
              Manage user accounts and permissions
            </p>
          </div>

          {/* Users Management */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-slate-900/50 rounded-2xl border border-white/10 p-6"
          >
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-white mb-4">Users</h2>
                {users.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-slate-700">
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">User</th>
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">Role</th>
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">Status</th>
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">Created</th>
                          <th className="text-left py-3 px-4 text-slate-300 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                            <td className="py-4 px-4">
                              <div>
                                <div className="font-medium text-white">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-slate-400">{user.email}</div>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === 'ADMIN' 
                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-red-400'}`}></div>
                                <span className={user.isActive ? 'text-green-400' : 'text-red-400'}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </span>
                                {user.mustReset && (
                                  <span className="ml-2 px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">
                                    Must Reset
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-slate-400 text-sm">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleUserActive(user.id, user.isActive)}
                                  className="text-xs"
                                >
                                  {user.isActive ? 'Deactivate' : 'Activate'}
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => toggleUserRole(user.id, user.role)}
                                  className="text-xs"
                                >
                                  {user.role === 'ADMIN' ? 'Make User' : 'Make Admin'}
                                </Button>
                                {user.mustReset && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => resendTempPassword(user.id)}
                                    className="text-xs"
                                  >
                                    <Mail className="h-3 w-3 mr-1" />
                                    Resend
                                  </Button>
                                )}
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => deleteUser(user.id, user.email)}
                                  className="text-xs bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      
    </div>
  )
}
