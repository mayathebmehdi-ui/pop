'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Section } from '@/components/Section'
export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: December 2024
              </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Deceased Status ("we," "our," or "us") is committed to protecting your privacy and handling your personal information responsibly. This Privacy Policy explains how we collect, use, and protect information when you use our death status verification services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Information We Collect</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Account Information</h3>
                      <p className="text-muted-foreground">Name, email address, company information, and billing details for account setup and management.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Verification Data</h3>
                      <p className="text-muted-foreground">Personal identifiers (names, dates of birth) submitted for death status verification purposes only.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Usage Information</h3>
                      <p className="text-muted-foreground">API usage logs, search queries, and system performance data for service improvement and compliance.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">How We Use Information</h2>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Provide death status verification services</li>
                    <li>• Maintain audit trails for compliance purposes</li>
                    <li>• Improve service quality and accuracy</li>
                    <li>• Communicate about your account and services</li>
                    <li>• Comply with legal obligations</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Data Protection</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Security Measures</h3>
                      <p className="text-muted-foreground">We employ industry-standard security measures including encryption, access controls, and regular security audits.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Data Minimization</h3>
                      <p className="text-muted-foreground">We collect and process only the minimum data necessary for verification purposes.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Retention Policies</h3>
                      <p className="text-muted-foreground">Data is retained only as long as necessary for business purposes or as required by law.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Your Rights</h2>
                  <p className="text-muted-foreground mb-4">
                    Depending on your jurisdiction, you may have the following rights regarding your personal information:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Right to access your personal data</li>
                    <li>• Right to correct inaccurate information</li>
                    <li>• Right to delete your information</li>
                    <li>• Right to restrict processing</li>
                    <li>• Right to data portability</li>
                    <li>• Right to object to processing</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
                  <p className="text-muted-foreground">
                    If you have questions about this Privacy Policy or our data practices, please contact us at{' '}
                    <a href="mailto:privacy@deceased-status.com" className="text-primary hover:text-primary/80 transition-colors">
                      privacy@deceased-status.com
                    </a>
                  </p>
                </section>

                <section className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">Important Notice</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a demonstration privacy policy for the Deceased Status service concept. In a production environment, this would be prepared with legal counsel to ensure compliance with all applicable privacy laws and regulations.
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </Section>
      </main>

      <Footer />
    </div>
  )
}
