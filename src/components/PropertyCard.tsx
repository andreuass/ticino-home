'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { formatPrice, getPropertyTypeLabel } from '@/lib/utils/format'
import type { Property, PropertyImage } from '@/types/database'

interface PropertyCardProps {
  property: Property & {
    property_images?: PropertyImage[]
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkFavorite = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data } = await supabase
          .from('favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('property_id', property.id)
          .single()

        setIsFavorite(!!data)
      }
      setLoading(false)
    }

    checkFavorite()
  }, [property.id])

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      window.location.href = '/accedi'
      return
    }

    if (isFavorite) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', property.id)
      setIsFavorite(false)
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: user.id, property_id: property.id })
      setIsFavorite(true)
    }
  }

  const primaryImage = property.property_images?.find(img => img.is_primary) ?? property.property_images?.[0]
  const fallbackImage = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'

  return (
    <Link href={`/immobili/${property.slug}`} className="card group">
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={primaryImage?.url ?? fallbackImage}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-terracotta text-white text-xs font-medium rounded">
            {getPropertyTypeLabel(property.property_type)}
          </span>
        </div>
        {!loading && (
          <button
            onClick={toggleFavorite}
            className="absolute top-4 right-4 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
          >
            <svg
              className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              fill={isFavorite ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="font-display text-xl font-medium line-clamp-1">
            {property.title}
          </h3>
        </div>

        <p className="text-brown/60 text-sm mb-4">
          {property.city}{property.neighborhood ? `, ${property.neighborhood}` : ''}
        </p>

        <div className="flex items-center gap-4 text-sm text-brown/70 mb-4">
          {property.rooms && (
            <span>{property.rooms} locali</span>
          )}
          {property.bedrooms && (
            <span>{property.bedrooms} camere</span>
          )}
          {property.size_sqm && (
            <span>{property.size_sqm} m²</span>
          )}
        </div>

        <div className="text-2xl font-display text-terracotta">
          {formatPrice(property.price, property.currency)}
        </div>
      </div>
    </Link>
  )
}
