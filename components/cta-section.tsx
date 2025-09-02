'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useLanguage } from '@/components/language-provider'

export function CTASection() {
  const { t } = useLanguage()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/10 to-indigo-500/10 border border-primary/20"
    >
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]" />
      <div className="relative px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          {t('ctaBand.text')}
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/request-account">{t('ctaBand.primary')}</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/login">{t('ctaBand.secondary')}</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

