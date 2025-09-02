'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, CheckCircle, Clock, Webhook, FileDown } from 'lucide-react'

function AnimatedNumber({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [current, setCurrent] = useState(0)
  useEffect(() => {
    let start = 0
    const step = value / (duration / 16)
    const id = setInterval(() => {
      start += step
      if (start >= value) {
        setCurrent(value)
        clearInterval(id)
      } else {
        setCurrent(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(id)
  }, [value, duration])
  return <span>{current}</span>
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  return (
    <div className="w-full h-2 rounded-full bg-white/10">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.6 }}
        className="h-2 rounded-full bg-slate-300"
      />
    </div>
  )
}

export function HeroPreview() {
  const total = 1200
  const processed = 816
  const inQueue = 24
  const processing = 6

  const timeline = [
    { icon: Upload, label: 'Received', meta: 'CSV_Claims_2025_07.csv', state: 'done' as const },
    { icon: CheckCircle, label: 'Validated', meta: '1,200 rows • 0 errors', state: 'done' as const },
    { icon: Clock, label: 'Matching', meta: 'Processing 6 workers', state: 'active' as const },
    { icon: Webhook, label: 'Webhooks', meta: 'Queued (delivery on completion)', state: 'pending' as const },
    { icon: FileDown, label: 'Export', meta: 'CSV/PDF', state: 'pending' as const },
  ]

  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-indigo-500/10 blur-2xl" />
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-lg shadow-2xl overflow-hidden"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Request/Response sample (compact) */}
          <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-white/10">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-2">API Request</div>
            <pre className="text-sm leading-relaxed text-slate-200 bg-black/30 rounded-lg p-4 overflow-x-auto">
{`POST /api/death-check/search
{
  "firstName": "Jane",
  "lastName": "Doe",
  "dateOfBirth": "1972-04-18",
  "city": "Boston",
  "state": "MA"
}`}
            </pre>
            <div className="text-xs uppercase tracking-wider text-slate-400 mt-4 mb-2">API Response</div>
            <pre className="text-sm leading-relaxed text-emerald-200 bg-black/30 rounded-lg p-4 overflow-x-auto">
{`{
  "ok": true,
  "result": {
    "isDeceased": true,
    "confidence": 0.92
  }
}`}
            </pre>
          </div>

          {/* Right: Batch Upload Preview */}
          <div className="p-6 md:p-8">
            <div className="text-xs uppercase tracking-wider text-slate-400 mb-3">Batch Upload Preview</div>
            <div className="rounded-xl border border-white/10 bg-slate-950/40 p-6 space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-slate-200">CSV_Claims_2025_07.csv</div>
                <div className="text-xs text-slate-400">{processed}/{total} processed</div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">In Queue</div>
                  <div className="mt-1 text-2xl font-mono text-white"><AnimatedNumber value={inQueue} /></div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Processing</div>
                  <div className="mt-1 text-2xl font-mono text-white"><AnimatedNumber value={processing} /></div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Completed</div>
                  <div className="mt-1 text-2xl font-mono text-white"><AnimatedNumber value={processed} /></div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <span>Overall progress</span>
                  <span>{Math.round((processed / total) * 100)}%</span>
                </div>
                <ProgressBar value={processed} max={total} />
              </div>

              {/* Timeline */}
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide mb-2">Pipeline</div>
                <div className="space-y-2">
                  {timeline.map((step, i) => (
                    <div key={i} className="flex items-center justify-between rounded border border-white/5 bg-white/[0.02] px-3 py-2">
                      <div className="flex items-center gap-3">
                        <step.icon className="h-4 w-4 text-slate-300" />
                        <div>
                          <div className="text-sm text-slate-200">{step.label}</div>
                          <div className="text-xs text-slate-500">{step.meta}</div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        {step.state === 'done' ? 'Completed' : step.state === 'active' ? 'In progress' : 'Pending'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

