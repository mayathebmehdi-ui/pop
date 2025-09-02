'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Calendar, MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { calculateMatchConfidence, formatSearchPayload } from '@/lib/utils'
import { SearchResult, ResultCardProps } from '@/types'

export function ResultCard({ result, index }: ResultCardProps) {
  const confidence = result.result ? calculateMatchConfidence(result.result) : 0
  const hasMatch = result.result?.result === 'True' || result.result?.result === true
  
  const getStatusColor = () => {
    if (result.status === 'error') return 'destructive'
    if (result.status === 'queued') return 'secondary'
    return hasMatch ? 'default' : 'outline'
  }
  
  const getStatusIcon = () => {
    if (result.status === 'error') return AlertCircle
    if (result.status === 'queued') return Clock
    return hasMatch ? CheckCircle : AlertCircle
  }
  
  const StatusIcon = getStatusIcon()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="premium-shadow hover:premium-shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="font-medium text-foreground">
                {formatSearchPayload(result.payload)}
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date(result.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </div>
            </div>
            <Badge variant={getStatusColor()} className="flex items-center gap-1">
              <StatusIcon className="h-3 w-3" />
              {result.status === 'queued' && 'Processing'}
              {result.status === 'error' && 'Error'}
              {result.status === 'ok' && (hasMatch ? 'Match Found' : 'No Match')}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {result.status === 'error' && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">
                {result.result?.error || 'An error occurred while processing this search.'}
              </p>
            </div>
          )}
          
          {result.status === 'queued' && (
            <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20">
              <p className="text-sm text-muted-foreground">
                This search is being processed. Results will appear here shortly.
              </p>
            </div>
          )}
          
          {result.status === 'ok' && result.result && (
            <div className="space-y-3">
              {hasMatch ? (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">Match Confidence</span>
                    <span className="text-sm font-medium text-primary">{confidence}%</span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {result.result.dod && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>DOD: {result.result.dod}</span>
                      </div>
                    )}
                    
                    {result.result.dod_precision && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Precision: {result.result.dod_precision}</span>
                      </div>
                    )}
                    
                    {(result.payload.city || result.payload.state) && (
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{result.payload.city}, {result.payload.state}</span>
                      </div>
                    )}
                  </div>
                  
                  {result.result.url && (
                    <div className="pt-2 border-t border-border">
                      <a
                        href={result.result.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>View Source</span>
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-3 rounded-lg bg-muted/10 border border-border">
                  <p className="text-sm text-muted-foreground">
                    No death record found for the provided information.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Badge component if not already created
function LocalBadge({ variant = 'default', className, children, ...props }: {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  className?: string
  children: React.ReactNode
  [key: string]: any
}) {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    destructive: 'bg-destructive text-destructive-foreground',
    outline: 'border border-input bg-background text-foreground',
  }
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </span>
  )
}
