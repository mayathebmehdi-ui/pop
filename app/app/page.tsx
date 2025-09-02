'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Footer } from '@/components/Footer'
import { Search, Upload, History, User, Calendar, MapPin, LogOut, Settings } from 'lucide-react'
import { calculateMatchConfidence } from '@/lib/utils'
import { SearchResult, User as UserType } from '@/types'

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('search')
  const [searchHistory, setSearchHistory] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [currentUser, setCurrentUser] = useState<UserType | null>(null)
  
  // Search form state
  const [searchForm, setSearchForm] = useState({
    fname: '',
    lname: '',
    mname: '',
    dob: '',
    city: '',
    state: ''
  })
  const [searchErrors, setSearchErrors] = useState<Record<string, string>>({})
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [searching, setSearching] = useState(false)

  // Bulk upload state
  const [bulkFile, setBulkFile] = useState<File | null>(null)
  const [bulkResults, setBulkResults] = useState<SearchResult[]>([])
  const [bulkProcessing, setBulkProcessing] = useState(false)

  useEffect(() => {
    if (activeTab === 'history') {
      loadSearchHistory()
    }
  }, [activeTab])

  useEffect(() => {
    loadCurrentUser()
  }, [])

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/validate-session')
      if (response.ok) {
        const user = await response.json()
        setCurrentUser(user)
      }
    } catch (error) {
      console.error('Error loading user:', error)
    }
  }

  const loadSearchHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/user/search-history')
      if (response.ok) {
        const data = await response.json()
        setSearchHistory(data.searches || [])
      }
    } catch (error) {
      console.error('Error loading search history:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSearching(true)
    setSearchErrors({})
    setSearchResult(null)

    // Validate required fields
    const errors: Record<string, string> = {}
    if (!searchForm.fname.trim()) errors.fname = 'First name is required'
    if (!searchForm.lname.trim()) errors.lname = 'Last name is required'
    if (!searchForm.city.trim()) errors.city = 'City is required'
    if (!searchForm.state.trim()) errors.state = 'State is required'
    if (!searchForm.dob.trim()) errors.dob = 'Date of birth is required'

    if (Object.keys(errors).length > 0) {
      setSearchErrors(errors)
      setSearching(false)
      return
    }

    try {
      // Normalize DOB: YYYY-MM-DD → YYYYMMDD
      let normalizedDob = searchForm.dob
      if (normalizedDob.includes('-')) {
        const [year, month, day] = normalizedDob.split('-')
        normalizedDob = `${year}${month}${day}`
      }

      const params = new URLSearchParams({
        fname: searchForm.fname.toUpperCase(),
        lname: searchForm.lname.toUpperCase(),
        city: searchForm.city.toUpperCase(),
        state: searchForm.state.toUpperCase(),
        dob: normalizedDob,
        ...(searchForm.mname && { mname: searchForm.mname.toUpperCase() })
      })

      const response = await fetch(`/api/death-check/search?${params}`)
      const data = await response.json()

      if (response.ok) {
        setSearchResult(data)
        // Refresh history if on history tab
        if (activeTab === 'history') {
          loadSearchHistory()
        }
      } else {
        setSearchErrors({ submit: data.error || 'Search failed' })
      }
    } catch (error) {
      setSearchErrors({ submit: 'Network error. Please try again.' })
    } finally {
      setSearching(false)
    }
  }

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bulkFile) return

    setBulkProcessing(true)
    setBulkResults([])

    const formData = new FormData()
    formData.append('file', bulkFile)

    try {
      const response = await fetch('/api/bulk/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      if (response.ok) {
        setBulkResults(data.results || [])
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (error) {
      alert('Network error. Please try again.')
    } finally {
      setBulkProcessing(false)
    }
  }

  const exportResults = (format: 'json' | 'csv') => {
    if (bulkResults.length === 0) return

    let content = ''
    let filename = ''
    let mimeType = ''

    if (format === 'json') {
      content = JSON.stringify(bulkResults, null, 2)
      filename = `bulk-results-${Date.now()}.json`
      mimeType = 'application/json'
    } else {
      // CSV export
      const headers = ['fname', 'lname', 'mname', 'dob', 'city', 'state', 'status', 'result']
      const rows = bulkResults.map(row => [
        row.payload.firstName || '',
        row.payload.lastName || '',
        row.payload.mname || '',
        row.payload.dateOfBirth || '',
        row.payload.city || '',
        row.payload.state || '',
        row.status || '',
        row.result ? JSON.stringify(row.result) : ''
      ])
      
      content = [headers, ...rows].map(row => 
        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
      ).join('\n')
      
      filename = `bulk-results-${Date.now()}.csv`
      mimeType = 'text/csv'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/login'
    } catch (error) {
      console.error('Logout error:', error)
      // Force redirect even if logout fails
      window.location.href = '/login'
    }
  }

  const tabs = [
    { id: 'search', label: '', icon: Search },
    { id: 'bulk', label: '', icon: Upload },
    { id: 'history', label: 'History', icon: History },
  ]

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">

      
      {/* Profile Header */}
      <div className="bg-slate-900/50 border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">
                {currentUser ? (
                  currentUser.firstName && currentUser.lastName 
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser.email
                ) : 'Loading...'}
              </h2>
              <p className="text-sm text-slate-400">
                {currentUser?.role === 'ADMIN' ? 'Administrator' : 'User'} • Death Record Verification
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-400 hover:bg-red-950/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
              <User className="h-8 w-8 text-indigo-400" />
              Dashboard
            </h1>
            <p className="text-slate-400">
              Search death records, upload bulk files, and view your search history
            </p>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-slate-900/50 p-1 rounded-2xl border border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Search Tab */}
            {activeTab === 'search' && (
              <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-8">
                {/* Search Header */}
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 mb-8 border border-indigo-500/20">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                      <Search className="h-6 w-6" />
                      Death Record Search
                    </h2>
                    <p className="text-slate-300">
                      Search for death records with comprehensive data verification
                    </p>
                  </div>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSearchSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        First Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          value={searchForm.fname}
                          onChange={(e) => setSearchForm(prev => ({ ...prev, fname: e.target.value }))}
                          className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                          placeholder="John"
                        />
                      </div>
                      {searchErrors.fname && (
                        <p className="mt-1 text-sm text-red-400">{searchErrors.fname}</p>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Last Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          value={searchForm.lname}
                          onChange={(e) => setSearchForm(prev => ({ ...prev, lname: e.target.value }))}
                          className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                          placeholder="Doe"
                        />
                      </div>
                      {searchErrors.lname && (
                        <p className="mt-1 text-sm text-red-400">{searchErrors.lname}</p>
                      )}
                    </div>

                    {/* Middle Name */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Middle Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          value={searchForm.mname}
                          onChange={(e) => setSearchForm(prev => ({ ...prev, mname: e.target.value }))}
                          className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                          placeholder="Michael"
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="date"
                          value={searchForm.dob}
                          onChange={(e) => setSearchForm(prev => ({ ...prev, dob: e.target.value }))}
                          className="pl-10 bg-slate-800/50 border-slate-600 text-white"
                        />
                      </div>
                      {searchErrors.dob && (
                        <p className="mt-1 text-sm text-red-400">{searchErrors.dob}</p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        City *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          value={searchForm.city}
                          onChange={(e) => setSearchForm(prev => ({ ...prev, city: e.target.value }))}
                          className="pl-10 bg-slate-800/50 border-slate-600 text-white placeholder-slate-400"
                          placeholder="Chicago"
                        />
                      </div>
                      {searchErrors.city && (
                        <p className="mt-1 text-sm text-red-400">{searchErrors.city}</p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">
                        State *
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <select
                          value={searchForm.state}
                          onChange={(e) => setSearchForm(prev => ({ ...prev, state: e.target.value }))}
                          className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value="">Select State</option>
                          {usStates.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>
                      {searchErrors.state && (
                        <p className="mt-1 text-sm text-red-400">{searchErrors.state}</p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-center">
                    <Button
                      type="submit"
                      disabled={searching}
                      className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all"
                    >
                      {searching ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="h-4 w-4 mr-2" />
                          Search Records
                        </>
                      )}
                    </Button>
                  </div>

                  {searchErrors.submit && (
                    <div className="text-center">
                      <p className="text-red-400">{searchErrors.submit}</p>
                    </div>
                  )}
                </form>

                {/* Search Results */}
                {searchResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8"
                  >
                    <div className="rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/60 to-slate-900/30 shadow-xl overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-900/60">
                        <h3 className="text-xl font-semibold text-white">Verification Results</h3>
                        {(() => {
                          const isMatch = searchResult?.result?.result === 'True' || searchResult?.result?.result === true
                          return (
                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              isMatch
                                ? 'bg-emerald-400/10 text-emerald-300 border-emerald-400/30'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}>
                              {isMatch ? 'Death Record Found' : 'No Record Found'}
                            </span>
                          )
                        })()}
                      </div>

                      <div className="px-6 py-6">
                        {(() => {
                          const payload = searchResult?.payload || {}
                          const api = searchResult?.result || {}
                          const fullName = [payload.firstName, payload.mname, payload.lastName].filter(Boolean).join(' ')
                          const location = [payload.city, payload.state].filter(Boolean).join(', ')
                          const formatDate = (value?: string) => {
                            if (!value || typeof value !== 'string') return '—'
                            const trimmed = value.replaceAll('-', '')
                            if (trimmed.length === 8) {
                              const y = trimmed.slice(0, 4)
                              const m = trimmed.slice(4, 6)
                              const d = trimmed.slice(6, 8)
                              return `${m}/${d}/${y}`
                            }
                            return value
                          }
                          const dob = formatDate(payload.dateOfBirth)
                          const dod = formatDate((api as any).dod)
                          const precision = ((api as any).dod_precision || '—').toString().replace(/_/g, ' ').toUpperCase()
                          const confidence = calculateMatchConfidence(api)

                          return (
                            <>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Full Name</div>
                                  <div className="text-sm text-white font-medium">{fullName || '—'}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Location</div>
                                  <div className="text-sm text-white font-medium">{location || '—'}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Date of Birth</div>
                                  <div className="text-sm text-white font-medium">{dob}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Date of Death</div>
                                  <div className="text-sm text-white font-medium">{dod}</div>
                                </div>
                                <div>
                                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-1">Data Precision</div>
                                  <div className="text-sm text-white font-medium">{precision}</div>
                                </div>
                                <div className="md:col-span-2">
                                  <div className="flex items-center justify-between mb-2">
                                    <div className="text-xs uppercase tracking-wide text-slate-400">Match Confidence</div>
                                    <div className="text-sm text-indigo-300 font-semibold">{confidence}%</div>
                                  </div>
                                  <div className="h-2 rounded-full bg-slate-800 border border-slate-700 overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                                      style={{ width: `${confidence}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {((api as any).url || (api as any).article) && (
                                <div className="mt-6 pt-6 border-t border-white/10">
                                  <div className="text-xs uppercase tracking-wide text-slate-400 mb-2">Source</div>
                                  {(api as any).url && (
                                    <a
                                      href={(api as any).url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center text-sm text-indigo-300 hover:text-indigo-200 underline underline-offset-4"
                                    >
                                      View Source
                                    </a>
                                  )}
                                  {(api as any).article && (
                                    <p className="mt-2 text-sm text-slate-300 leading-relaxed">{(api as any).article}</p>
                                  )}
                                </div>
                              )}
                            </>
                          )
                        })()}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            {/* Bulk Upload Tab */}
            {activeTab === 'bulk' && (
              <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <Upload className="h-6 w-6" />
                  Bulk Upload
                </h2>

                <form onSubmit={handleBulkUpload} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Upload CSV/Excel File
                    </label>
                    <input
                      type="file"
                      accept=".csv,.xlsx,.xls"
                      onChange={(e) => setBulkFile(e.target.files?.[0] || null)}
                      className="w-full p-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-500 file:text-white file:font-medium hover:file:bg-indigo-600"
                    />
                    <p className="mt-2 text-sm text-slate-400">
                      Required columns: fname, lname, city, state, dob. Optional: mname
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={!bulkFile || bulkProcessing}
                    className="bg-indigo-500 hover:bg-indigo-600"
                  >
                    {bulkProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload & Process
                      </>
                    )}
                  </Button>
                </form>

                {/* Bulk Results */}
                {bulkResults.length > 0 && (
                  <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-white">
                        Results ({bulkResults.length} records)
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => exportResults('json')}
                          variant="outline"
                          size="sm"
                        >
                          Export JSON
                        </Button>
                        <Button
                          onClick={() => exportResults('csv')}
                          variant="outline"
                          size="sm"
                        >
                          Export CSV
                        </Button>
                      </div>
                    </div>
                    
                    <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-slate-300">
                        {JSON.stringify(bulkResults, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-slate-900/50 rounded-2xl border border-white/10 p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <History className="h-6 w-6" />
                  Search History
                </h2>

                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
                  </div>
                ) : searchHistory.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <History className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No search history found</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {searchHistory.map((search) => (
                      <div key={search.id} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="font-medium text-white">
                              Search #{search.id.substring(0, 8)}
                            </div>
                            <div className="text-sm text-slate-400">
                              {new Date(search.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            search.status === 'ok' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                          }`}>
                            {search.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-300 mb-2">
                          <strong>Query:</strong> {JSON.stringify(search.payload)}
                        </div>
                        {search.result && (
                          <details className="text-sm text-slate-400">
                            <summary className="cursor-pointer hover:text-slate-300">View Result</summary>
                            <pre className="mt-2 p-3 bg-slate-900/50 rounded-lg overflow-x-auto">
                              {JSON.stringify(search.result, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
