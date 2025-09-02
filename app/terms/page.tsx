'use client'

import { motion } from 'framer-motion'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Section } from '@/components/Section'
export default function TermsPage() {
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
                Terms of Service
              </h1>
              <p className="text-lg text-muted-foreground">
                Last updated: December 2024
              </p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none">
              <div className="space-y-8">
                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Acceptance of Terms</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    By accessing and using Deceased Status services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Service Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Deceased Status provides death status verification services for legitimate business purposes. Our service accesses public records and databases to provide verification information with confidence scoring and audit trails.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Permitted Uses</h2>
                  <p className="text-muted-foreground mb-4">
                    You may use our services only for legitimate business purposes, including:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Insurance claims processing and verification</li>
                    <li>• Banking and financial KYC compliance</li>
                    <li>• Healthcare record management (with proper authorization)</li>
                    <li>• Estate administration and probate proceedings</li>
                    <li>• Government benefit program administration</li>
                    <li>• Other lawful purposes with proper authorization</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Prohibited Uses</h2>
                  <p className="text-muted-foreground mb-4">
                    You expressly agree not to use our services for:
                  </p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Identity theft, fraud, or any illegal activities</li>
                    <li>• Harassment, stalking, or intimidation</li>
                    <li>• Discriminatory practices based on protected characteristics</li>
                    <li>• Unauthorized background checks or investigations</li>
                    <li>• Any purpose that violates applicable privacy laws</li>
                    <li>• Reselling or redistributing our data without authorization</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Compliance Obligations</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Legal Compliance</h3>
                      <p className="text-muted-foreground">You must comply with all applicable laws, including but not limited to FCRA, HIPAA, GDPR, and state privacy regulations.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Data Protection</h3>
                      <p className="text-muted-foreground">You must implement appropriate security measures to protect any data obtained through our services.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Audit Requirements</h3>
                      <p className="text-muted-foreground">You must maintain proper records and audit trails for all use of our services.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Service Limitations</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Data Accuracy</h3>
                      <p className="text-muted-foreground">While we strive for accuracy, verification results are based on available public information and should not be considered definitive without additional verification.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Coverage Limitations</h3>
                      <p className="text-muted-foreground">Coverage varies by geographic region and may not include all jurisdictions or data sources.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-2">Service Availability</h3>
                      <p className="text-muted-foreground">We provide services on a best-effort basis with 99.9% uptime SLA for enterprise customers.</p>
                    </div>
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Limitation of Liability</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    Our liability is limited to the fees paid for the services. We are not liable for any indirect, incidental, special, or consequential damages arising from use of our services.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Information</h2>
                  <p className="text-muted-foreground">
                    For questions about these Terms of Service, please contact us at{' '}
                    <a href="mailto:legal@deceased-status.com" className="text-primary hover:text-primary/80 transition-colors">
                      legal@deceased-status.com
                    </a>
                  </p>
                </section>

                <section className="bg-muted/30 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-foreground mb-2">Important Notice</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a demonstration terms of service for the Deceased Status service concept. In a production environment, these terms would be prepared with legal counsel to ensure compliance with all applicable laws and proper risk management.
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
