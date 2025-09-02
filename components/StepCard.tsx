'use client'

import { motion } from 'framer-motion'
import { LucideIcon, ArrowRight } from 'lucide-react'

interface StepCardProps {
  icon: LucideIcon
  title: string
  description: string
  step: number
  isLast?: boolean
}

export function StepCard({ icon: Icon, title, description, step, isLast }: StepCardProps) {
  return (
    <div className="flex items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: step * 0.2 }}
        viewport={{ once: true }}
        className="relative"
      >
        <div className="flex flex-col items-center text-center max-w-xs">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 border-2 border-primary/20 mb-4 relative">
            <Icon className="h-8 w-8 text-primary" />
            <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
              {step}
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </motion.div>
      
      {!isLast && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: (step * 0.2) + 0.3 }}
          viewport={{ once: true }}
          className="hidden lg:flex items-center justify-center mx-8"
        >
          <ArrowRight className="h-6 w-6 text-muted-foreground" />
        </motion.div>
      )}
    </div>
  )
}
