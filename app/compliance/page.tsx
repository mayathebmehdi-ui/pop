'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, FileCheck, Eye, Clock, Users } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Section } from '@/components/Section'
export default function CompliancePage() {
  const complianceFeatures = [
    {
      icon: Shield,
      title: 'SOC 2 Aligned Controls',
      description: 'Security, availability, and confidentiality controls aligned with SOC 2 Type II standards.',
    },
    {
      icon: Lock,
      title: 'Data Encryption',
      description: 'End-to-end encryption in transit and at rest using industry-standard AES-256 encryption.',
    },
    {
      icon: FileCheck,
      title: 'Audit Trails',
      description: 'Comprehensive logging and audit trails for all verification requests and data access.',
    },
    {
      icon: Eye,
      title: 'PII Minimization',
      description: 'Minimal data collection and processing with automatic data purging options.',
    },
    {
      icon: Clock,
      title: 'Data Retention',
      description: 'Configurable retention policies with automatic deletion and GDPR compliance.',
    },
    {
      icon: Users,
      title: 'Access Controls',
      description: 'Role-based access control with SSO integration and multi-factor authentication.',
    },
  ]

  const regulations = [
    {
      title: 'FCRA Compliance',
      description: 'Our service is designed to support FCRA-compliant use cases when used for permissible purposes.',
    },
    {
      title: 'GDPR Ready',
      description: 'Full GDPR compliance with data subject rights, privacy by design, and EU data residency options.',
    },
    {
      title: 'HIPAA Considerations',
      description: 'Healthcare-specific security controls and BAA availability for covered entities.',
    },
    {
      title: 'State Privacy Laws',
      description: 'Compliance with CCPA, CPRA, and other state privacy regulations.',
    },
  ]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Section>
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Compliance & Security
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Enterprise-grade security and compliance standards for sensitive death status verification.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {complianceFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section className="bg-muted/30">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Regulatory Compliance
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              We help organizations maintain compliance with relevant regulations and industry standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {regulations.map((regulation, index) => (
              <motion.div
                key={regulation.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <h3 className="text-lg font-semibold text-card-foreground mb-3">{regulation.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{regulation.description}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        <Section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-primary/5 via-primary/10 to-indigo-500/10 border border-primary/20 rounded-3xl p-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Responsible Verification
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto">
              We treat death status verification with the sensitivity and care it requires. Our platform is designed for legitimate business purposes only, with strict ethical guidelines and transparent practices.
            </p>
            <div className="max-w-4xl mx-auto text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Permitted Use Cases</h4>
                  <ul className="space-y-1">
                    <li>• Insurance claim verification</li>
                    <li>• Banking and financial KYC</li>
                    <li>• Healthcare record management</li>
                    <li>• Estate and probate administration</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Prohibited Uses</h4>
                  <ul className="space-y-1">
                    <li>• Identity theft or fraud</li>
                    <li>• Harassment or stalking</li>
                    <li>• Discriminatory practices</li>
                    <li>• Unauthorized background checks</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
