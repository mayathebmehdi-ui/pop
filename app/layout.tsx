import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Deceased Status - Enterprise Death Verification',
  description: 'Instant, reliable death-status checks for enterprises. Verify a deceased status in seconds across public sources with auditable confidence.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} dark bg-slate-950 text-slate-200`}>
        {children}
      </body>
    </html>
  )
}