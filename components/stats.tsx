'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface Stat {
  label: string
  value: number
  suffix?: string
  duration?: number
}

const useCounter = (target: number, duration = 1200) => {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let raf = 0
    const start = performance.now()
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      setVal(Math.floor(target * p))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

export function Stats() {
  const stats: Stat[] = [
    { label: 'Sources', value: 120, suffix: '+' },
    { label: 'Uptime', value: 99, suffix: '.9%' },
    { label: 'Median Latency', value: 2, suffix: 's' },
    { label: 'Countries', value: 30, suffix: '+' },
  ]

  function AnimatedStat({ s, index }: { s: Stat; index: number }) {
    const v = useCounter(s.value, 1000 + index * 200)
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        className="rounded-2xl border border-border bg-card px-4 py-6 text-center"
      >
        <div className="text-3xl font-semibold text-foreground">
          {v}
          {s.suffix}
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
      </motion.div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((s, i) => (
        <AnimatedStat key={s.label} s={s} index={i} />
      ))}
    </div>
  )
}


