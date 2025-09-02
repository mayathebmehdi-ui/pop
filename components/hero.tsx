'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { BadgeRow } from '@/components/BadgeRow'
import { HeroPreview } from '@/components/hero-preview'

export function Hero() {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-950/80">
      {/* Subtle grid and spotlight */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,.12),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(139,92,246,.10),transparent_45%)]" />
        <div className="absolute inset-0 bg-grid-slate-100/5 dark:bg-grid-slate-800/10" />
      </div>

      <div className="relative z-10 px-6 py-10 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs text-primary mb-4">
              Enterprise • Compliance-first
            </div>
            <h1 className="text-balance text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white">
              Verify deceased status with audit‑ready confidence
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-slate-300">
              API and dashboard to confirm a death within seconds across public sources. Evidence links, confidence scoring, and exportable audit trails.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/request-account">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/login">Login</Link>
              </Button>
            </div>
            <div className="mt-6">
              <BadgeRow badges={["Batch CSV", "Audit Logs", "99.9% Uptime"]} />
            </div>
          </motion.div>

          <div className="mt-12">
            <HeroPreview />
          </div>
        </div>
      </div>
    </div>
  )
}


