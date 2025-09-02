'use client'

import { useEffect, useState } from 'react'

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const height = document.documentElement.scrollHeight - window.innerHeight
      const p = height > 0 ? (scrolled / height) * 100 : 0
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent">
      <div className="h-full bg-primary transition-[width] duration-200" style={{ width: `${progress}%` }} />
    </div>
  )
}


