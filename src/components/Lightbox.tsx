'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface LightboxProps {
  images: string[]
  currentIndex: number
  onClose: () => void
  onPrevious: () => void
  onNext: () => void
}

export default function Lightbox({ images, currentIndex, onClose, onPrevious, onNext }: LightboxProps) {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, onPrevious, onNext])

  const handlePrevious = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onPrevious()
      setIsAnimating(false)
    }, 150)
  }

  const handleNext = () => {
    setIsAnimating(true)
    setTimeout(() => {
      onNext()
      setIsAnimating(false)
    }, 150)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors"
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous button */}
      {images.length > 1 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 p-3 text-white/70 hover:text-white transition-colors disabled:opacity-30"
          disabled={currentIndex === 0}
        >
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Image */}
      <div className={`max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center p-8 transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={images[currentIndex]}
          alt={`Immagine ${currentIndex + 1}`}
          width={1200}
          height={800}
          className="max-w-full max-h-[85vh] object-contain"
          priority
        />
      </div>

      {/* Next button */}
      {images.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 p-3 text-white/70 hover:text-white transition-colors disabled:opacity-30"
          disabled={currentIndex === images.length - 1}
        >
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-full px-4 overflow-x-auto">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAnimating(true)
                setTimeout(() => {
                  onNext()
                  setIsAnimating(false)
                }, 0)
              }}
              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors ${
                index === currentIndex ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <Image
                src={img}
                alt={`Thumbnail ${index + 1}`}
                width={64}
                height={48}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
