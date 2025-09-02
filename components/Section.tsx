import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  id?: string
}

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn('py-10 lg:py-16', className)}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {children}
      </div>
    </section>
  )
}
