'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SmoothGalleryProps {
  images?: string[]
  intervalMs?: number
}

export function SmoothGallery({ images, intervalMs = 4500 }: SmoothGalleryProps) {
  const slides = useMemo(
    () => images ?? ['/images/1.png', '/images/2.png', '/images/3.png'],
    [images]
  )
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const id = setInterval(() => {
      setCurrent((idx) => (idx + 1) % slides.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [slides.length, intervalMs, isPaused])

  function goNext() {
    setCurrent((idx) => (idx + 1) % slides.length)
  }

  function goPrev() {
    setCurrent((idx) => (idx - 1 + slides.length) % slides.length)
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-border shadow-glow-lg"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-roledescription="carousel"
    >
      {/* Visual frame and aspect ratio */}
      <div className="relative aspect-[16/9] w-full">
        {/* Soft gradient overlays */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/60 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/60 to-transparent" />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={slides[current]}
            src={slides[current]}
            alt={`Gallery slide ${current + 1}`}
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0, scale: 1.01 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.995 }}
            transition={{ duration: 0.7, ease: 'easeInOut' }}
            draggable={false}
          />
        </AnimatePresence>

        {/* Prev/Next Controls */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between p-3">
          <button
            type="button"
            aria-label="Previous slide"
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur-md transition hover:text-white hover:bg-black/40"
            onClick={goPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white/80 backdrop-blur-md transition hover:text-white hover:bg-black/40"
            onClick={goNext}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              className={`pointer-events-auto h-2.5 w-2.5 rounded-full transition ${
                i === current ? 'bg-white/90' : 'bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => setCurrent(i)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


