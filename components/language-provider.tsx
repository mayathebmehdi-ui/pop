'use client'

import * as React from 'react'

type Language = 'en' | 'fr'

type LanguageProviderState = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    'nav.product': 'Product',
    'nav.dataSources': 'Data Sources',
    'nav.pricing': 'Pricing',
    'nav.compliance': 'Compliance',
    'nav.docs': 'Docs',
    'nav.login': 'Login',
    'nav.requestAccount': 'Request Account',
    
    // Hero
    'hero.title': 'Instant, reliable death-status checks for enterprises.',
    'hero.subtitle': 'Verify a deceased status in seconds across public sources with auditable confidence.',
    'hero.primaryCta': 'Request Account',
    'hero.secondaryCta': 'Login',
    'hero.reassurance': 'Batch CSV • Audit Logs • 99.9% SLA',
    
    // Sensitivity
    'sensitivity.text': 'We handle sensitive lookups with care. PII minimization, encryption in transit & at rest, and transparent audit trails. SOC 2-aligned controls.',
    
    // How it works
    'howItWorks.title': 'How it works',
    'howItWorks.step1.title': 'Submit',
    'howItWorks.step1.desc': 'Name + DOB (+ optional last-4 where permitted) via batch CSV or UI.',
    'howItWorks.step2.title': 'Match',
    'howItWorks.step2.desc': 'Multi-source correlation across public obituaries, memorials, public notices & permitted registries.',
    'howItWorks.step3.title': 'Deliver',
    'howItWorks.step3.desc': 'Confidence score, evidence links, exportable PDF/CSV.',
    
    // Features
    'features.title': 'Key Features',
    'features.coverage': 'Coverage & confidence scoring',
    'features.api': 'Dashboard',
    'features.batch': 'Batch uploads (CSV) & rate-limited queues',
    'features.webhooks': 'Change detection (watchlists)',
    'features.audit': 'Audit logs & exports (CSV/PDF)',
    'features.access': 'Role-based access & SSO-ready (SAML/OIDC)',
    'features.monitoring': 'Monitoring & uptime (status page)',
    'features.support': 'Support: email + enterprise SLAs',
    
    // Get Started
    'pricing.title': 'Get Started',
    'pricing.text': 'Request access to our professional death verification service. Enterprise plans available.',
    
    // CTA Band
    'ctaBand.text': 'Ready to verify responsibly?',
    'ctaBand.primary': 'Request Account',
    'ctaBand.secondary': 'Login',
    
    // Footer
    'footer.disclaimer': 'Deceased Status is a B2B verification platform for sensitive lookups. Use in compliance with applicable laws and authorized purposes.',
    'footer.copyright': '© 2024 Deceased Status. All rights reserved.',
    
    // Forms
    'form.email': 'Email',
    'form.password': 'Password',
    'form.company': 'Company',
    'form.useCase': 'Use Case',
    'form.volume': 'Expected Volume',
    'form.message': 'Message',
    'form.submit': 'Submit',
    'form.submitting': 'Submitting...',
    'form.success': 'Thank you! We\'ll be in touch soon.',
    'form.forgotPassword': 'Forgot password?',
    'form.demoOnly': 'Demo only - no real authentication',
  },
  fr: {
    // Navigation
    'nav.product': 'Produit',
    'nav.dataSources': 'Sources de données',
    'nav.pricing': 'Tarification',
    'nav.compliance': 'Conformité',
    'nav.docs': 'Documentation',
    'nav.login': 'Se connecter',
    'nav.requestAccount': 'Demander un accès',
    
    // Hero
    'hero.title': 'Vérifications de statut de décès, instantanées et fiables, pour les entreprises.',
    'hero.subtitle': 'Vérifiez un statut de décès en quelques secondes via des sources publiques, avec une confiance vérifiable.',
    'hero.primaryCta': 'Demander un accès',
    'hero.secondaryCta': 'Se connecter',
    'hero.reassurance': 'Import CSV • Journaux d\'audit • SLA 99,9 %',
    
    // Sensitivity
    'sensitivity.text': 'Nous traitons les recherches sensibles avec soin. Minimisation des DCP, chiffrement en transit et au repos, et pistes d\'audit transparentes. Contrôles alignés SOC 2.',
    
    // How it works
    'howItWorks.title': 'Comment ça marche',
    'howItWorks.step1.title': 'Soumettre',
    'howItWorks.step1.desc': 'Nom + date de naissance (+ 4 derniers chiffres optionnels si autorisé) via CSV par lot ou interface.',
    'howItWorks.step2.title': 'Corrélation',
    'howItWorks.step2.desc': 'Corrélation multi-sources à travers nécrologies publiques, mémoriaux, avis publics et registres autorisés.',
    'howItWorks.step3.title': 'Livrer',
    'howItWorks.step3.desc': 'Score de confiance, liens de preuves, PDF/CSV exportables.',
    
    // Features
    'features.title': 'Fonctionnalités clés',
    'features.coverage': 'Couverture et scoring de confiance',
    'features.api': 'Tableau de bord',
    'features.batch': 'Téléchargements par lot (CSV) et files d\'attente limitées',
    'features.webhooks': 'Détection de changements (listes de surveillance)',
    'features.audit': 'Journaux d\'audit et exports (CSV/PDF)',
    'features.access': 'Accès basé sur les rôles et compatible SSO (SAML/OIDC)',
    'features.monitoring': 'Surveillance et disponibilité (page de statut)',
    'features.support': 'Support : email + SLA entreprise',
    
    // Get Started
    'pricing.title': 'Commencer',
    'pricing.text': 'Demandez l\'accès à notre service professionnel de vérification de décès. Plans entreprise disponibles.',
    
    // CTA Band
    'ctaBand.text': 'Prêt·e à vérifier de manière responsable ?',
    'ctaBand.primary': 'Demander un accès',
    'ctaBand.secondary': 'Se connecter',
    
    // Footer
    'footer.disclaimer': 'Deceased Status est une plateforme B2B de vérification sensible. Utilisation conforme aux lois et finalités autorisées.',
    'footer.copyright': '© 2024 Deceased Status. Tous droits réservés.',
    
    // Forms
    'form.email': 'Email',
    'form.password': 'Mot de passe',
    'form.company': 'Entreprise',
    'form.useCase': 'Cas d\'usage',
    'form.volume': 'Volume attendu',
    'form.message': 'Message',
    'form.submit': 'Soumettre',
    'form.submitting': 'Envoi...',
    'form.success': 'Merci ! Nous vous contacterons bientôt.',
    'form.forgotPassword': 'Mot de passe oublié ?',
    'form.demoOnly': 'Démo uniquement - pas d\'authentification réelle',
  },
}

const initialState: LanguageProviderState = {
  language: 'en',
  setLanguage: () => null,
  t: () => '',
}

const LanguageProviderContext = React.createContext<LanguageProviderState>(initialState)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>('en')

  const t = React.useCallback((key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key
  }, [language])

  const value = {
    language,
    setLanguage,
    t,
  }

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  )
}

export const useLanguage = () => {
  const context = React.useContext(LanguageProviderContext)

  if (context === undefined)
    throw new Error('useLanguage must be used within a LanguageProvider')

  return context
}

