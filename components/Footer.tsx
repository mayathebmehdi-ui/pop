import Link from 'next/link'

export function Footer() {
  const footerLinks = [
    { name: 'Docs', href: '/docs' },
    { name: 'Compliance', href: '/compliance' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Status', href: '#' },
    { name: 'Contact', href: 'mailto:contact@deceased-status.com' },
  ]

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold text-foreground">
              Deceased Status
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              We treat death-status lookups with care. PII minimization, encryption in transit & at rest, 
              and transparent audit trails.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Resources</h3>
            <ul className="space-y-2">
              {footerLinks.slice(0, 3).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              {footerLinks.slice(3).map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © 2024 Deceased Status. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
