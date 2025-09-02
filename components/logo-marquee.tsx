'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface LogoMarqueeProps {
  items?: string[]
}

export function LogoMarquee({ items }: LogoMarqueeProps) {
  const logos = useMemo(
    () => items ?? ['Acme Insurance', 'Nimbus Bank', 'MediCare', 'StateWorks', 'Lex & Co', 'Nova Health', 'Fintrust', 'ClearLegal'],
    [items]
  )

  return (
    <div className="relative overflow-hidden py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: '-50%' }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="flex gap-10 whitespace-nowrap will-change-transform"
      >
        {[...logos, ...logos].map((name, i) => (
          <div key={`${name}-${i}`} className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
            <div className="h-6 w-6 rounded-md bg-primary/20 border border-primary/30" />
            <span className="text-sm text-muted-foreground">{name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}


