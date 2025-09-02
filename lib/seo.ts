import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  noIndex?: boolean
}

const defaultTitle = 'Deceased Status - Instant, reliable death-status checks for enterprises'
const defaultDescription = 'Verify a deceased status in seconds across public sources with auditable confidence—via API or dashboard. Enterprise-grade death verification service.'
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://deceased-status.com'

export function generateSEO({
  title,
  description = defaultDescription,
  image = `${siteUrl}/og-image.png`,
  noIndex = false,
}: SEOProps = {}): Metadata {
  const metaTitle = title ? `${title} | Deceased Status` : defaultTitle

  return {
    title: metaTitle,
    description,
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    openGraph: {
      title: metaTitle,
      description,
      url: siteUrl,
      siteName: 'Deceased Status',
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: 'Deceased Status - Enterprise death verification',
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description,
      images: [image],
    },
    alternates: {
      canonical: siteUrl,
    },
  }
}

export const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Deceased Status',
  description: defaultDescription,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  offers: {
    '@type': 'Offer',
    description: 'Professional death verification service with enterprise plans available',
  },
}

