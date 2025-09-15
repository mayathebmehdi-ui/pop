'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Menu, X, Search, Users, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { NavbarProps, User as UserType } from '@/types'
import logoWhite from '@/logoswhite.png'

export function Navbar({ user }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const [sessionUser, setSessionUser] = useState<Pick<UserType, 'id' | 'email' | 'firstName' | 'lastName' | 'role' | 'isActive' | 'mustReset'> | null>(null)

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch('/api/validate-session', { credentials: 'include' })
        if (!res.ok) {
          if (!cancelled) setSessionUser(null)
          return
        }
        const u = await res.json()
        if (!cancelled) {
          setSessionUser({
            id: u.id,
            email: u.email,
            firstName: u.firstName,
            lastName: u.lastName,
            role: u.role,
            isActive: u.isActive,
            mustReset: u.mustReset,
          })
        }
      } catch {
        if (!cancelled) setSessionUser(null)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [])
  
  const isLanding = pathname === '/'
  const isApp = pathname.startsWith('/app')
  const isAdmin = pathname.startsWith('/admin')
  const currentUser = sessionUser ?? user ?? null

  const navigation = isLanding 
    ? [
        { name: 'Product', href: '#product' },
        { name: 'Data Sources', href: '#data-sources' },
        { name: 'Compliance', href: '#compliance' },
      ]
    : currentUser?.role === 'ADMIN'
    ? [
        { name: 'Search', href: '/app/search', icon: Search },
        { name: 'Bulk Upload', href: '/app/bulk', icon: Users },
        { name: 'Admin', href: '/admin', icon: Users },
      ]
    : [
        { name: 'Search', href: '/app/search', icon: Search },
        { name: 'Bulk Upload', href: '/app/bulk', icon: Users },
      ]

  return (
    <>
      <style jsx>{`
        @keyframes slideInLeft {
          0% { transform: translateX(-100px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideInRight {
          0% { transform: translateX(50px); opacity: 0; }
          100% { transform: translateX(0); opacity: 1; }
        }
      `}</style>
      <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href={currentUser ? '/app/search' : '/'} className="group flex items-center gap-1.5 py-1 px-2 -ml-2 rounded-lg transition-all duration-300 hover:bg-white/5 hover:backdrop-blur-sm">
              <div className="relative animate-[slideInLeft_0.8s_ease-out_forwards]">
                <Image 
                  src={logoWhite} 
                  alt="Deceased Status logo" 
                  width={42} 
                  height={42} 
                  className="transition-transform duration-300 group-hover:scale-105 drop-shadow-sm group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.35)]"
                />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300"></div>
              </div>
              <div className="flex flex-col items-start">
                <span className="relative text-[21px] font-semibold tracking-[-0.02em] leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent antialiased transition-all duration-300 group-hover:from-white group-hover:via-white group-hover:to-slate-200 drop-shadow-[0_0_4px_rgba(255,255,255,0.15)] group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] after:content-[''] after:absolute after:inset-0 after:rounded-md after:blur-sm after:bg-white/0 group-hover:after:bg-white/5 after:transition-colors after:duration-300 animate-[slideInRight_0.8s_ease-out_0.2s_forwards] opacity-0">
                  Deceased Status
                </span>
                <span className="relative text-[12px] font-medium tracking-wide text-slate-400 mt-[-2px] transition-all duration-300 group-hover:text-slate-300 animate-[slideInRight_0.8s_ease-out_0.4s_forwards] opacity-0">
                  Services
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href.startsWith('#') && pathname === '/')
              const Icon = 'icon' in item ? item.icon : null
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 text-sm font-medium transition-colors px-2 py-1 rounded-md',
                    isActive 
                      ? 'text-primary bg-primary/10' 
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <div className="font-medium text-foreground">
                      {currentUser.firstName && currentUser.lastName 
                        ? `${currentUser.firstName} ${currentUser.lastName}`
                        : currentUser.email
                      }
                    </div>
                    {currentUser.role === 'ADMIN' && (
                      <div className="text-xs text-primary">Admin</div>
                    )}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-medium text-primary">
                      {currentUser.firstName?.charAt(0) || currentUser.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/api/auth/logout">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/request-account">Request Account</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href.startsWith('#') && pathname === '/')
                const Icon = 'icon' in item ? item.icon : null
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-3 py-2 text-base font-medium rounded-md transition-colors',
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              {currentUser ? (
                <div className="pt-4 border-t border-border">
                  <div className="px-3 py-2">
                    <div className="text-sm font-medium text-foreground">
                      {currentUser.firstName && currentUser.lastName 
                        ? `${currentUser.firstName} ${currentUser.lastName}`
                        : currentUser.email
                      }
                    </div>
                    {currentUser.role === 'ADMIN' && (
                      <div className="text-xs text-primary">Admin</div>
                    )}
                  </div>
                  <Link
                    href="/api/auth/logout"
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </Link>
                </div>
              ) : (
                <div className="pt-4 space-y-2 border-t border-border">
                  <Button variant="ghost" className="w-full justify-start" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/request-account" onClick={() => setIsOpen(false)}>
                      Request Account
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
    </>
  )
}
