import Link from 'next/link'
import Image from 'next/image'
import { formatPrice, getPropertyTypeLabel } from '@/lib/utils/format'
import type { Property, PropertyImage } from '@/types/database'

interface PropertyCardProps {
  property: Property & {
    property_images?: PropertyImage[]
  }
}

export default function PropertyCard({ property }: PropertyCardProps) {
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
