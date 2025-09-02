'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  Upload,
  Search,
  FileOutput,
  Shield,
  Gauge,
  FileText,
  History,
  Users,
  Monitor,
  Mail,
  Settings,
  Building2,
  CreditCard,
  Heart,
  Scale,
  FileCheck,
  DollarSign,
  ChevronDown,
} from 'lucide-react'

import { Navbar } from '@/components/Navbar'
import { ScrollProgress } from '@/components/scroll-progress'
import { LogoMarquee } from '@/components/logo-marquee'
import { Stats } from '@/components/stats'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/Footer'
import { Section } from '@/components/Section'
import { Button } from '@/components/ui/button'
import { FeatureCard } from '@/components/FeatureCard'
import { StepCard } from '@/components/StepCard'
import { BadgeRow } from '@/components/BadgeRow'
import { HeroPreview } from '@/components/hero-preview'
import { SecurityBadges } from '@/components/security-badges'
import { Integrations } from '@/components/integrations'
import { Hero } from '@/components/hero'
import { useState } from 'react'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const features = [
    {
      icon: Gauge,
      title: 'Coverage & confidence scoring',
      description: 'Advanced algorithms provide confidence scoring for every verification with transparent evidence links.',
    },
    {
      icon: Settings,
      title: 'API + Dashboard',
      description: 'RESTful API with comprehensive documentation plus intuitive dashboard for manual lookups.',
    },
    {
      icon: Upload,
      title: 'Batch uploads (CSV) & rate-limited queues',
      description: 'Process thousands of records via CSV upload with intelligent rate limiting and queue management.',
    },
    
    {
      icon: History,
      title: 'Audit logs & exports (CSV/PDF)',
      description: 'Complete audit trails with exportable logs in CSV/PDF format for compliance requirements.',
    },
    {
      icon: Users,
      title: 'Role-based access & SSO-ready (SAML/OIDC)',
      description: 'Enterprise-ready with role-based permissions and SSO integration via SAML/OIDC.',
    },
    {
      icon: Monitor,
      title: 'Monitoring & uptime (status page)',
      description: 'Real-time system monitoring with public status page and uptime guarantees.',
    },
    {
      icon: Mail,
      title: 'Support: email + enterprise SLAs',
      description: 'Dedicated support channels with enterprise SLA options and technical assistance.',
    },
  ]

  const useCases = [
    {
      icon: Building2,
      title: 'Insurance & Claims',
      description: 'Verify beneficiary status and expedite claims processing with confidence.',
    },
    {
      icon: CreditCard,
      title: 'Banking & KYC',
      description: 'Maintain accurate customer records and comply with KYC refresh requirements.',
    },
    {
      icon: Heart,
      title: 'Healthcare',
      description: 'Update patient records responsibly while maintaining HIPAA compliance.',
    },
    {
      icon: Scale,
      title: 'Government',
      description: 'Maintain citizen databases and benefit program integrity.',
    },
    {
      icon: FileCheck,
      title: 'Legal & estates',
      description: 'Support estate administration and probate proceedings.',
    },
    {
      icon: DollarSign,
      title: 'Collections',
      description: 'Responsible debt collection with proper verification protocols.',
    },
  ]

  const faqItems = [
    {
      question: 'How accurate are your death status verifications?',
      answer: 'Our multi-source verification provides confidence scores based on evidence quality. We correlate data across public obituaries, memorials, legal notices, and authorized registries. Accuracy varies by region and source availability, with detailed confidence metrics provided for each result.',
    },
    {
      question: 'What data sources do you use?',
      answer: 'We access public obituaries and memorials, public probate and legal notices, and authorized registries where legally permitted. Source availability varies by jurisdiction and we provide full transparency about which sources contributed to each verification.',
    },
    {
      question: 'Is this service legal and ethical to use?',
      answer: 'Yes, when used for legitimate business purposes. Our service only accesses publicly available information and operates within legal frameworks. Users must comply with applicable laws including FCRA, HIPAA, and privacy regulations in their jurisdiction.',
    },
    {
      question: 'How does API access work and what are the rate limits?',
      answer: 'Our RESTful API supports real-time queries with tiered rate limits based on your plan. Standard plans include 1000 requests per hour, with enterprise plans offering higher limits and dedicated infrastructure.',
    },
    {
      question: 'What about batch processing and SLAs?',
      answer: 'Batch CSV uploads support up to 10,000 records per file with processing typically completed within 24 hours. Enterprise plans include guaranteed SLAs with 99.9% uptime and priority processing.',
    },
    {
      question: 'How do you handle privacy and data retention?',
      answer: 'We implement PII minimization, encrypt all data in transit and at rest, and maintain transparent audit trails. Data retention follows your specified requirements with automatic purging options and full GDPR compliance.',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <ScrollProgress />
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <Section className="pt-2 lg:pt-4">
          <Hero />
        </Section>



        {/* How it works */}
        <Section id="product">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              How it works
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:gap-6">
            <StepCard
              icon={Upload}
              title="Submit"
              description="Name + DOB (+ optional last-4 where permitted) via API, batch CSV, or UI."
              step={1}
            />
            <StepCard
              icon={Search}
              title="Match"
              description="Multi-source correlation across public obituaries, memorials, public notices & permitted registries."
              step={2}
            />
            <StepCard
              icon={FileOutput}
              title="Deliver"
              description="Confidence score, evidence links, exportable PDF/CSV."
              step={3}
              isLast
            />
          </div>
        </Section>

        {/* Features */}
        <Section className="bg-muted/30">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Key Features
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                index={index}
              />
            ))}
          </div>
        </Section>

        {/* Data Sources */}
        <Section id="data-sources">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Data Sources
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance mb-8">
              Transparent access to public information with regional compliance
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Public obituaries & memorials</h3>
              <p className="text-muted-foreground">Newspapers, funeral homes, and memorial websites</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Scale className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Public probate/legal notices</h3>
              <p className="text-muted-foreground">Court filings and legal publications</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authorized/permitted registries</h3>
              <p className="text-muted-foreground">Where applicable and legally permitted</p>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-muted-foreground italic">
              Disclaimer: Source availability varies by region & permissions.
            </p>
          </motion.div>
        </Section>

        {/* Pricing (replacing Integrations) */}
        <Section id="pricing" className="bg-muted/30">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Pricing</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent plans that grow with your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Starter */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xl font-semibold mb-2">Starter</h3>
              <p className="text-muted-foreground mb-4">Pay as you go</p>
              <div className="text-3xl font-bold mb-6">$0<span className="text-base text-muted-foreground font-normal"> + usage</span></div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>Manual searches</li>
                <li>CSV batch (up to 1k rows)</li>
                <li>Email support</li>
              </ul>
              <Button asChild className="w-full"><a href="#request-account">Create Account</a></Button>
            </div>
            {/* Team */}
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6">
              <h3 className="text-xl font-semibold mb-2">Team</h3>
              <p className="text-muted-foreground mb-4">Best for growing teams</p>
              <div className="text-3xl font-bold mb-6">$199<span className="text-base text-muted-foreground font-normal">/mo</span></div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>Everything in Starter</li>
                <li>CSV batch (up to 10k rows)</li>
                <li>Priority processing</li>
              </ul>
              <Button asChild className="w-full"><a href="#request-account">Create Account</a></Button>
            </div>
            {/* Enterprise */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-muted-foreground mb-4">Custom SLAs & volume</p>
              <div className="text-3xl font-bold mb-6">Custom</div>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>Dedicated infrastructure</li>
                <li>Custom SLAs</li>
                <li>Premium support</li>
              </ul>
              <Button variant="outline" asChild className="w-full"><a href="#request-account">Contact Sales</a></Button>
            </div>
          </div>
        </Section>

        <Section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Use Cases
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <FeatureCard
                key={useCase.title}
                icon={useCase.icon}
                title={useCase.title}
                description={useCase.description}
                index={index}
              />
            ))}
          </div>
        </Section>

        {/* Create Account */}
        <Section id="request-account">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Get Started
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance mb-8">
              Request access to our professional death verification service. Enterprise plans available.
            </p>
            <Button size="lg" asChild>
              <Link href="/request-account">Create Account</Link>
            </Button>
          </div>
        </Section>

        {/* Testimonials */}
        <Section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">What teams say</h2>
            <p className="text-muted-foreground">Real feedback from early enterprise users</p>
          </div>
          <Testimonials />
        </Section>

        {/* FAQ */}
        <Section className="bg-muted/30">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left focus:outline-none focus:ring-2 focus:ring-primary focus:ring-inset hover:bg-accent/50 transition-colors"
                  aria-expanded={openFaq === index}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-foreground pr-4">{item.question}</h3>
                    <ChevronDown
                      className={`h-5 w-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-4 text-muted-foreground leading-relaxed">
                      {item.answer}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </Section>

        {/* CTA Band */}
        <Section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-indigo-500/10 border border-primary/20"
          >
            <div className="relative px-8 py-16 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Ready to verify responsibly?
              </h2>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="/request-account">Create Account</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/login">Login</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </Section>

        
      </main>

      <Footer />
    </div>
  )
}