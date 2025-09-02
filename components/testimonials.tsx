'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Testimonial {
  quote: string
  author: string
  role: string
}

const ITEMS: Testimonial[] = [
  { quote: 'Reduced manual verification time from days to minutes.', author: 'A. Martin', role: 'Claims Ops, Acme Insurance' },
  { quote: 'The audit trail and evidence links are exactly what compliance needed.', author: 'S. Lewis', role: 'Head of Compliance, Nimbus Bank' },
  { quote: 'We love the batch uploads and webhook callbacks.', author: 'T. Nguyen', role: 'Platform Lead, Nova Health' },
]

export function Testimonials() {
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % ITEMS.length), 4500)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border bg-card p-6 text-center max-w-3xl mx-auto"
        >
          <p className="text-lg leading-relaxed text-card-foreground">&ldquo;{ITEMS[index].quote}&rdquo;</p>
          <div className="mt-4 text-sm text-muted-foreground">{ITEMS[index].author} • {ITEMS[index].role}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}


