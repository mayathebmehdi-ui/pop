'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Book, Code, FileText, ExternalLink } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Section } from '@/components/Section'
import { Button } from '@/components/ui/button'
export default function DocsPage() {
  const docSections = [
    {
      icon: Code,
      title: 'API Reference',
      description: 'Complete REST API documentation with endpoints, parameters, and response schemas.',
      href: '#api-reference',
    },
    {
      icon: Book,
      title: 'Integration Guide',
      description: 'Step-by-step guides for implementing death status verification in your applications.',
      href: '#integration',
    },
    {
      icon: FileText,
      title: 'SDK & Libraries',
      description: 'Official SDKs and code examples for popular programming languages.',
      href: '#sdks',
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
                Documentation
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to integrate Deceased Status verification into your enterprise applications.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {docSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{section.description}</p>
                    <Link
                      href={section.href}
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Learn more
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center bg-muted/30 rounded-2xl p-12"
          >
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Coming Soon
            </h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our comprehensive documentation is being finalized. In the meantime, request access to get early access to our API documentation and integration support.
            </p>
            <Button size="lg" asChild>
              <Link href="/request-account">Request Early Access</Link>
            </Button>
          </motion.div>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
