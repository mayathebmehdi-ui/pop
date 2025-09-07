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
import { Stats } from '@/components/stats'
import { Testimonials } from '@/components/testimonials'
import { Footer } from '@/components/Footer'
import { Section } from '@/components/Section'
import { Button } from '@/components/ui/button'
import { FeatureCard } from '@/components/FeatureCard'
import { StepCard } from '@/components/StepCard'
import { BadgeRow } from '@/components/BadgeRow'
import { SecurityBadges } from '@/components/security-badges'
import { Integrations } from '@/components/integrations'
import { Hero } from '@/components/hero'
import { useState } from 'react'

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const features = [
    {
      icon: Gauge,
      title: 'Coverage with confidence scoring',
      description: 'Advanced models assign a confidence score to every verification with transparent evidence links.',
    },
    {
      icon: Settings,
      title: 'Dashboard',
      description: 'An intuitive dashboard for manual lookups and team workflows.',
    },
    {
      icon: Upload,
      title: 'CSV batch uploads with smart queuing',
      description: 'Upload thousands via CSV with smart rate limits and managed queues.',
    },
    
    {
      icon: History,
      title: 'Audit trails and exports (CSV/PDF)',
      description: 'Full audit trails with exportable CSV/PDF logs for compliance needs.',
    },
    {
      icon: Users,
      title: 'Role-based access and SSO (SAML/OIDC)',
      description: 'Enterprise‑ready roles and SSO via SAML/OIDC.',
    },
    {
      icon: Monitor,
      title: 'Monitoring and uptime (status page)',
      description: 'Real‑time monitoring, a public status page, and strong uptime.',
    },
    {
      icon: Mail,
      title: 'Support: email with enterprise SLAs',
      description: 'Dedicated support with enterprise SLA options.',
    },
  ]

  const useCases = [
    {
      icon: Building2,
      title: 'Insurance and claims',
      description: 'Verify beneficiary status and accelerate claims processing confidently.',
    },
    {
      icon: CreditCard,
      title: 'Banking and KYC',
      description: 'Keep records current and meet KYC refresh obligations.',
    },
    {
      icon: Heart,
      title: 'Healthcare',
      description: 'Responsibly update patient records while preserving HIPAA compliance.',
    },
    {
      icon: Scale,
      title: 'Public sector',
      description: 'Maintain citizen records and benefit program integrity.',
    },
    {
      icon: FileCheck,
      title: 'Legal and estates',
      description: 'Support estate administration and probate.',
    },
    {
      icon: DollarSign,
      title: 'Debt collections',
      description: 'Responsible collections anchored by proper verification.',
    },
  ]

  const faqItems = [
    {
      question: 'How accurate are your verifications?',
      answer: 'We cross-check public obituaries and memorials, legal notices, and permitted registries, then assign a confidence score based on evidence quality. Accuracy depends on region and source availability; each result includes detailed confidence metrics.',
    },
    {
      question: 'Which data sources power the service?',
      answer: 'Public obituaries and memorials, public probate and legal notices, and authorized registries where legally permitted. Availability varies by jurisdiction, and we disclose which sources contributed to each verification.',
    },
    {
      question: 'Is using this service legal and ethical?',
      answer: 'Yes—when used for legitimate business purposes. We access publicly available information and operate within legal frameworks. Customers must comply with applicable laws such as FCRA, HIPAA, and local privacy regulations.',
    },
    // Removed API-specific FAQ
    {
      question: 'Do you support batch processing and SLAs?',
      answer: 'CSV batch uploads handle up to 10,000 records per file with typical processing under 24 hours. Enterprise plans include guaranteed SLAs (99.9% uptime) and priority processing.',
    },
    {
      question: 'How do you approach privacy and data retention?',
      answer: 'We minimize PII, encrypt data in transit and at rest, and maintain transparent audit trails. Retention adheres to your policies with automatic purging options and full GDPR alignment.',
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

        {/* The Challenge */}
        <Section id="challenge" className="bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-3">The Challenge: Gaps and Fragmentation in Death Data</h2>
              <div className="max-w-3xl mx-auto space-y-3 text-muted-foreground text-lg">
                <p>
                  Pinpointing deceased individuals in your records supports operations, fraud controls, and respectful outreach — it is much more than a compliance checkbox.
                </p>
                <p>
                  Traditional sources fall short. The SSA Death Master File (DMF) is estimated to cover only about 16% of U.S. deaths (Berwyn Group), pushing teams to chase alternative signals amid fragmentation and costly manual review.
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">Source: Berwyn Group analysis of DMF coverage.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2">Major Coverage Gaps</h3>
                <p className="text-muted-foreground">Many inputs overlook most real deaths due to missing fields, unstructured text, and uneven national reach.</p>
              </div>
              <div className="border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2">Scattered, Inconsistent Data</h3>
                <p className="text-muted-foreground">Signals live across thousands of places, making normalization, consolidation, and cross-checking hard.</p>
              </div>
              <div className="border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2">Costly Manual Review</h3>
                <p className="text-muted-foreground">People-driven checks do not scale: they are slow, expensive, and error-prone.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Visuals (integrated with text) - moved directly under hero */}
        <Section>
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Row 1 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 items-center gap-6"
            >
              <div className="order-1 md:order-1">
                <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/10">
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
                    <img
                      src="/images/1.png"
                      alt="Shield / security visualization"
                      className="block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      width="1200"
                      height="675"
                      loading="eager"
                      style={{ display: 'block' }}
                    />
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              </div>
              <div className="order-2 md:order-2">
                <h3 className="text-xl font-semibold mb-2">Precision You Can Trust</h3>
                <p className="text-muted-foreground">
                  Each positive result is backed by evidence with transparent audit trails and confidence scoring.
                </p>
              </div>
            </motion.div>

            {/* Row 2 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="grid grid-cols-1 md:grid-cols-2 items-center gap-6"
            >
              <div className="order-2 md:order-1">
                <h3 className="text-xl font-semibold mb-2">Broad, Compliant Signal Intake</h3>
                <p className="text-muted-foreground">
                  Collect and correlate public signals — obituaries, legal notices, and registries — only where permitted.
                </p>
              </div>
              <div className="order-1 md:order-2">
                <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/10">
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
                    <img
                      src="/images/2.png?v=1"
                      alt="DNA / network visualization"
                      className="block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      width="1200"
                      height="675"
                      loading="lazy"
                      style={{ display: 'block' }}
                    />
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Row 3 */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 items-center gap-6"
            >
              <div className="order-1 md:order-1">
                <div className="group relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/10">
                  <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
                    <img
                      src="/images/3.png?v=1"
                      alt="Checklist / magnifier visualization"
                      className="block w-full h-auto transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                      width="1200"
                      height="675"
                      loading="lazy"
                      style={{ display: 'block' }}
                    />
                    <motion.div
                      aria-hidden
                      className="pointer-events-none absolute inset-0"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                </div>
              </div>
              <div className="order-2 md:order-2">
                <h3 className="text-xl font-semibold mb-2">Seamless Delivery and Sync</h3>
                <p className="text-muted-foreground">
                  Receive results in the dashboard or via CSV — kept current and simple to plug into your systems.
                </p>
              </div>
            </motion.div>
          </div>
        </Section>

        {/* Our Approach */}
        <Section id="approach">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-3">Our Solution: A Purpose-Built Protocol</h2>
              <div className="max-w-3xl mx-auto space-y-3 text-muted-foreground text-lg">
                <p>We combine AI with large-scale data intake to improve accuracy and completeness when confirming deceased status.</p>
                <p>Designed to complement your workflows across UI and batch CSV.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2">Wide Signal Coverage</h3>
                <p className="text-muted-foreground">Ingest diverse public sources where allowed and normalize unstructured signals for verification.</p>
              </div>
              <div className="border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2">Elastic Automation</h3>
                <p className="text-muted-foreground">Distributed automation plus AI assist provide high throughput efficiently.</p>
              </div>
              <div className="border border-border rounded-xl p-5">
                <h3 className="text-lg font-semibold mb-2">Flexible Integration</h3>
                <p className="text-muted-foreground">Deliver findings via dashboard or CSV batch — integrating seamlessly into client systems.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* How it works */}
        <Section id="product">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-4">How it works</h2>
            </div>
            <div className="flex flex-col lg:flex-row items-center justify-center space-y-6 lg:space-y-0 lg:gap-6">
              <StepCard
                icon={Upload}
                title="Provide"
                description="Enter name and DOB (plus optional last-4 where allowed) in the UI."
                step={1}
              />
              <StepCard
                icon={Search}
                title="Correlate"
                description="Cross-reference multiple public sources — obituaries, memorials, notices — and permitted registries."
                step={2}
              />
              <StepCard
                icon={FileOutput}
                title="Return"
                description="Confidence score, source links, and exports (PDF/CSV)."
                step={3}
                isLast
              />
            </div>
          </div>
        </Section>

        

        {/* Benefits */}
        <Section id="benefits">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-foreground mb-3">Why Teams Integrate</h2>
              <div className="max-w-3xl mx-auto text-muted-foreground text-lg">Boost data quality, reduce operating costs, and improve customer experience.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-xl border border-border p-5">
                <h3 className="text-base font-semibold mb-2">Reduce Costs</h3>
                <p className="text-muted-foreground text-sm">Cut waste, automate reviews, and filter deceased records before waterfall spend.</p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <h3 className="text-base font-semibold mb-2">Stronger Fraud Prevention</h3>
                <p className="text-muted-foreground text-sm">Flag likely deceased earlier to reduce fraud and stay compliant.</p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <h3 className="text-base font-semibold mb-2">Prevent Improper Payments</h3>
                <p className="text-muted-foreground text-sm">Timely detection reduces losses and regulatory exposure.</p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <h3 className="text-base font-semibold mb-2">Better Data Quality</h3>
                <p className="text-muted-foreground text-sm">Keep records current for accurate, respectful outreach.</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Removed API preview section */}

        {/* Data Sources */}
        <Section id="data-sources">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Data Sources
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-balance mb-8">
              Transparent use of public information with regional compliance in mind
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
              <h3 className="text-lg font-semibold mb-2">Public obituaries and memorials</h3>
              <p className="text-muted-foreground">Newspapers, funeral homes, and memorial platforms</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Scale className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Public probate and legal notices</h3>
              <p className="text-muted-foreground">Court filings and official legal publications</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <Building2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Authorized registries (where permitted)</h3>
              <p className="text-muted-foreground">Available only where legally allowed</p>
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
              Note: Source availability varies by region and permissions.
            </p>
          </motion.div>
        </Section>

        {/* Precision & Coverage */}
        <Section id="performance" className="bg-muted/30">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-foreground mb-3">Performance That Stands Out: Precision and Recall</h2>
            <div className="max-w-3xl mx-auto text-muted-foreground text-lg">
              Benchmarks show top-tier precision and meaningful recall gains — especially for recent deaths.
            </div>
          </div>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="rounded-xl border border-border p-5">
                <h3 className="text-lg font-semibold mb-2">Precision Near 100%</h3>
                <p className="text-muted-foreground">Each positive is evidence-backed to virtually eliminate false positives.</p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <h3 className="text-lg font-semibold mb-2">Meaningful Recall Lift</h3>
                <p className="text-muted-foreground">Augments existing workflows to broaden recall across fragmented sources.</p>
              </div>
              <div className="rounded-xl border border-border p-5">
                <h3 className="text-lg font-semibold mb-2">Better Detection of Recent Deaths</h3>
                <p className="text-muted-foreground">High freshness over the last 12–18 months via multi-source corroboration.</p>
              </div>
            </div>
            <div className="text-center mt-8">
              <Button size="lg" variant="outline" asChild>
                <a href="/request-account">Get Whitepaper</a>
              </Button>
            </div>
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
              <Button asChild className="w-full"><a href="#request-account">Request Account</a></Button>
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
              <Button asChild className="w-full"><a href="#request-account">Request Account</a></Button>
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

        {/* Request Account */}
        <Section id="request-account">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Get Started
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-balance mb-8">
              Request access to our professional death verification service. Enterprise plans available.
            </p>
            <Button size="lg" asChild>
              <Link href="/request-account">Request Account</Link>
            </Button>
          </div>
        </Section>

        {/* Testimonials */}
        <Section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-4">What teams are saying</h2>
            <p className="text-muted-foreground">Feedback from early enterprise users</p>
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
                  <Link href="/request-account">Request Account</Link>
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