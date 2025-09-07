'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BadgeRow } from '@/components/BadgeRow'
// import { HeroPreview } from '@/components/hero-preview'
// removed scroll indicator

export function Hero() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950/80 shadow-[0_0_80px_-20px_rgba(99,102,241,0.35)]">
      {/* Subtle grid and spotlight */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,.10),transparent_45%)]" />
        <div className="absolute inset-0 bg-grid-slate-100/5 dark:bg-grid-slate-800/10" />
        {/* Conic beams for depth */}
        <div className="absolute inset-0 bg-[conic-gradient(at_50%_120%,rgba(99,102,241,0.08),transparent_30%,rgba(59,130,246,0.06)_60%,rgba(99,102,241,0.08)_100%)]" />
        {/* Sheen sweep */}
        <motion.div
          aria-hidden
          className="absolute -inset-x-10 -top-8 h-20 rotate-[-12deg] bg-gradient-to-r from-white/20 via-white/10 to-transparent opacity-30"
          animate={{ x: ['-20%', '120%'] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Soft bottom reflection */}
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/10 to-transparent"
          initial={{ opacity: 0.06 }}
          animate={{ opacity: [0.06, 0.12, 0.06] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Animated aurora accents */}
        <motion.div
          aria-hidden
          className="absolute -top-28 -right-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl"
          animate={{ x: [0, 24, -12, 0], y: [0, -14, 10, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />
        <motion.div
          aria-hidden
          className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"
          animate={{ x: [0, -16, 12, 0], y: [0, 14, -12, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="relative z-10 px-6 py-10 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary mb-4">
              Enterprise Solution
            </div>
            <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
              Verify deceased status with
              <span className="ml-2 bg-gradient-to-r from-primary via-indigo-400 to-sky-400 bg-clip-text text-transparent">confidence</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-slate-300">
              Monitoring, batch searching and single search options for all enterprise clients to confirm deaths on your accounts. Results come complete with confidence scoring.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/request-account">Request Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
            <div className="mt-6">
              <BadgeRow badges={["Batch Solution", "Monitoring", "Single Search", "Audit Logs"]} />
            </div>
          </motion.div>

          {/* Preview moved to dedicated section on the landing page */}
        </div>
      </div>

      
    </div>
  )
}


