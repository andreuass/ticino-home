'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Lightbox from '@/components/Lightbox'
import { formatPrice, getPropertyTypeLabel } from '@/lib/utils/format'
import { createClient } from '@/lib/supabase/client'
import { Property, PropertyImage } from '@/types/database'

export default function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const [property, setProperty] = useState<(Property & { property_images?: PropertyImage[]; agents?: any }) | null>(null)
  const [loading, setLoading] = useState(true)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    params.then(async ({ slug }) => {
      const supabase = createClient()

      const { data } = await supabase
        .from('properties')
        .select('*, property_images(*), agents(*)')
        .eq('slug', slug)
        .single()

      setProperty(data)
      setLoading(false)

      if (data) {
        supabase
          .from('properties')
          .update({ views: (data.views || 0) + 1 })
          .eq('id', data.id)
      }
    })
  }, [params])

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-brown/50">Caricamento...</p>
        </div>
        <Footer />
      </>
    )
  }

  if (!property) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl mb-4">Immobile non trovato</h1>
            <Link href="/immobili" className="text-terracotta hover:underline">
              ← Torna agli immobili
            </Link>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  const images = property.property_images?.map(img => img.url) || []
  const fallbackImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'
  const displayImages = images.length > 0 ? images : [fallbackImage]

  const features = [
    { label: 'Locali', value: property.rooms },
    { label: 'Camere', value: property.bedrooms },
    { label: 'Bagni', value: property.bathrooms },
    { label: 'Superficie', value: property.size_sqm ? `${property.size_sqm} m²` : null },
    { label: 'Anno', value: property.year_built },
  ].filter(f => f.value)

  const amenities = [
    { label: 'Balcone', value: property.balcony },
    { label: 'Terrazza', value: property.terrace },
    { label: 'Giardino', value: property.garden },
    { label: 'Piscina', value: property.pool },
    { label: 'Vista Lago', value: property.lake_view },
    { label: 'Vista Montagna', value: property.mountain_view },
    { label: 'Garage', value: property.garage },
    { label: 'Cantina', value: property.cellar },
    { label: 'Ascensore', value: property.elevator },
    { label: 'Parcheggio', value: property.parking },
  ].filter(a => a.value)

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <>
      <Header />

      <main className="py-8">
        <div className="container-page">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/immobili"
              className="flex items-center gap-2 text-brown/70 hover:text-terracotta transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Tutti gli immobili
            </Link>
            <span className="text-sm text-brown/50">
              {getPropertyTypeLabel(property.property_type)}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Left Column */}
            <div className="lg:col-span-3 space-y-8">
              {/* Gallery */}
              <div
                className="cursor-pointer rounded-2xl overflow-hidden bg-gray-100 relative"
                onClick={() => handleImageClick(0)}
              >
                <div className="aspect-[4/3] relative">
                  <Image
                    src={displayImages[0]}
                    alt={property.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    priority
                  />
                </div>
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/70 text-white text-sm rounded-full backdrop-blur-sm">
                    {images.length} foto
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <h1 className="text-4xl font-light mb-3">{property.title}</h1>
                <p className="text-lg text-brown/60 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {property.city}{property.neighborhood ? `, ${property.neighborhood}` : ''}
                </p>
              </div>

              {/* Price */}
              <div className="text-4xl font-light text-terracotta">
                {formatPrice(property.price, property.currency)}
              </div>

              {/* Features */}
              {features.length > 0 && (
                <div className="grid grid-cols-5 gap-4">
                  {features.map((feature) => (
                    <div key={feature.label} className="text-center">
                      <div className="text-sm text-brown/40 mb-1">{feature.label}</div>
                      <div className="text-lg">{feature.value || '-'}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Description */}
              {property.description && (
                <div className="border-t border-brown/10 pt-8">
                  <h2 className="text-xl font-light mb-4">Descrizione</h2>
                  <p className="text-brown/70 leading-relaxed whitespace-pre-line">
                    {property.description}
                  </p>
                </div>
              )}

              {/* Amenities */}
              {amenities.length > 0 && (
                <div className="border-t border-brown/10 pt-8">
                  <h2 className="text-xl font-light mb-4">Caratteristiche</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenities.map((amenity) => (
                      <div key={amenity.label} className="flex items-center gap-2 text-brown/70">
                        <svg className="w-5 h-5 text-sage flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {amenity.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Virtual Tour */}
              {property.virtual_tour_url && (
                <div className="border-t border-brown/10 pt-8">
                  <h2 className="text-xl font-light mb-4">Tour Virtuale 360°</h2>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    <iframe
                      src={property.virtual_tour_url}
                      width="100%"
                      height="100%"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ border: 'none' }}
                    />
                  </div>
                </div>
              )}

              {/* Video */}
              {property.video_url && (
                <div className="border-t border-brown/10 pt-8">
                  <h2 className="text-xl font-light mb-4">Video</h2>
                  <div className="aspect-video rounded-2xl overflow-hidden bg-gray-100">
                    <iframe
                      src={property.video_url}
                      width="100%"
                      height="100%"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ border: 'none' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:col-span-2">
              <div className="sticky top-28">
                {/* Contact Card */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-brown/5">
                  <h3 className="text-lg font-light mb-6">Richiedi informazioni</h3>

                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Nome completo"
                      className="w-full px-4 py-3 border border-brown/10 rounded-lg bg-cream/50 focus:outline-none focus:border-terracotta transition-colors"
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 border border-brown/10 rounded-lg bg-cream/50 focus:outline-none focus:border-terracotta transition-colors"
                      required
                    />
                    <input
                      type="tel"
                      placeholder="Telefono"
                      className="w-full px-4 py-3 border border-brown/10 rounded-lg bg-cream/50 focus:outline-none focus:border-terracotta transition-colors"
                    />
                    <textarea
                      placeholder="Messaggio"
                      rows={4}
                      className="w-full px-4 py-3 border border-brown/10 rounded-lg bg-cream/50 focus:outline-none focus:border-terracotta transition-colors resize-none"
                      defaultValue={`Buongiorno, sono interessato/a all'immobile "${property.title}".`}
                    />
                    <button
                      type="submit"
                      className="w-full py-4 bg-terracotta text-white rounded-lg hover:bg-terracotta/90 transition-colors font-medium"
                    >
                      Invia richiesta
                    </button>
                  </form>

                  {/* Agent */}
                  {property.agents && (
                    <div className="mt-8 pt-6 border-t border-brown/10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-sage/20 flex items-center justify-center">
                          <svg className="w-6 h-6 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-sm">Contatto di riferimento</p>
                          <p className="text-brown/60 text-sm">{property.agents.email}</p>
                          {property.agents.phone && (
                            <p className="text-brown/60 text-sm">{property.agents.phone}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={displayImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
          onPrevious={() => setLightboxIndex(prev => Math.max(0, prev - 1))}
          onNext={() => setLightboxIndex(prev => Math.min(displayImages.length - 1, prev + 1))}
        />
      )}
    </>
  )
}
