'use client'

import { motion } from 'framer-motion'

export function SecurityBadges() {
  const items = ['PII minimization', 'Encryption at rest & in transit', 'Audit logs', 'Granular RBAC', 'SSO (SAML/OIDC)']
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {items.map((label, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.05 }}
          className="rounded-xl border border-border bg-card p-4 text-center"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">{label}</span>
        </motion.div>
      ))}
    </div>
  )
}


