'use client'

import { motion } from 'framer-motion'

interface BadgeRowProps {
  badges: string[]
}

export function BadgeRow({ badges }: BadgeRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="flex flex-wrap items-center justify-center gap-2 text-sm text-muted-foreground"
    >
      {badges.map((badge, index) => (
        <span key={badge} className="flex items-center">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-medium border border-primary/20">
            {badge}
          </span>
          {index < badges.length - 1 && (
            <span className="mx-2 text-muted-foreground/50">•</span>
          )}
        </span>
      ))}
    </motion.div>
  )
}
