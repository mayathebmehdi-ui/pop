'use client'

import { motion } from 'framer-motion'
import { Cloud, FileDown, Database } from 'lucide-react'

export function Integrations() {
  const items = [
    { icon: FileDown, title: 'CSV Batch', desc: 'Bulk uploads with queue management' },
    { icon: Cloud, title: 'S3', desc: 'Optional export to your bucket' },
    { icon: Database, title: 'Snowflake', desc: 'Optional sync to your warehouse' },
  ]
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((it, i) => (
        <motion.div
          key={it.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
          className="rounded-2xl border border-border bg-card p-5"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <it.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-base font-medium text-card-foreground">{it.title}</div>
          </div>
          <div className="text-sm text-muted-foreground">{it.desc}</div>
        </motion.div>
      ))}
    </div>
  )
}


