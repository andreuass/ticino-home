'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { PropertyType, PropertyStatus } from '@/types/database'

const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Appartamento' },
  { value: 'house', label: 'Casa' },
  { value: 'villa', label: 'Villa' },
  { value: 'attic', label: 'Attico' },
  { value: 'rustic', label: 'Rustico' },
  { value: 'land', label: 'Terreno' },
  { value: 'office', label: 'Ufficio' },
  { value: 'commercial', label: 'Commerciale' },
  { value: 'other', label: 'Altro' },
]

const statuses: { value: PropertyStatus; label: string }[] = [
  { value: 'draft', label: 'Bozza' },
  { value: 'published', label: 'Pubblicato' },
  { value: 'reserved', label: 'Riservato' },
  { value: 'sold', label: 'Venduto' },
  { value: 'archived', label: 'Archiviato' },
]

export default function EditPropertyPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    price: '',
    currency: 'CHF',
    property_type: 'apartment' as PropertyType,
    status: 'draft' as PropertyStatus,
    city: '',
    neighborhood: '',
    address: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    size_sqm: '',
    video_url: '',
    virtual_tour_url: '',
  })

  useEffect(() => {
    if (!id) return

    const supabase = createClient()

    supabase
      .from('properties')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          setError('Immobile non trovato')
          return
        }
        if (data) {
          setFormData({
            title: data.title || '',
            slug: data.slug || '',
            description: data.description || '',
            price: data.price?.toString() || '',
            currency: data.currency || 'CHF',
            property_type: data.property_type || 'apartment',
            status: data.status || 'draft',
            city: data.city || '',
            neighborhood: data.neighborhood || '',
            address: data.address || '',
            rooms: data.rooms?.toString() || '',
            bedrooms: data.bedrooms?.toString() || '',
            bathrooms: data.bathrooms?.toString() || '',
            size_sqm: data.size_sqm?.toString() || '',
            video_url: data.video_url || '',
            virtual_tour_url: data.virtual_tour_url || '',
          })
        }
        setLoading(false)
      })
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()

    const { error } = await supabase
      .from('properties')
      .update({
        title: formData.title,
        slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, ''),
        description: formData.description,
        price: parseFloat(formData.price),
        currency: formData.currency,
        property_type: formData.property_type,
        status: formData.status,
        city: formData.city,
        neighborhood: formData.neighborhood || null,
        address: formData.address || null,
        rooms: formData.rooms ? parseInt(formData.rooms) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        size_sqm: formData.size_sqm ? parseFloat(formData.size_sqm) : null,
        video_url: formData.video_url || null,
        virtual_tour_url: formData.virtual_tour_url || null,
      })
      .eq('id', id)

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      router.push('/admin/immobili')
    }
  }

  const handleDelete = async () => {
    if (!confirm('Sei sicuro di voler eliminare questo immobile?')) return

    const supabase = createClient()
    await supabase.from('properties').delete().eq('id', id)
    router.push('/admin/immobili')
  }

  if (loading) {
    return <div className="text-center py-12">Caricamento...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl ">Modifica Immobile</h1>
        <Link href="/admin/immobili" className="text-brown/70 hover:text-brown">
          ← Torna alla lista
        </Link>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Titolo *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prezzo (CHF) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo Immobile *</label>
              <select
                name="property_type"
                value={formData.property_type}
                onChange={handleChange}
                className="input-field"
              >
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stato *</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
              >
                {statuses.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Città *</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Quartiere</label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Indirizzo</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Locali</label>
              <input
                type="number"
                name="rooms"
                value={formData.rooms}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Camere</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bagni</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Superficie (m²)</label>
              <input
                type="number"
                name="size_sqm"
                value={formData.size_sqm}
                onChange={handleChange}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">URL Video (YouTube/Vimeo)</label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">URL Virtual Tour (goThru)</label>
              <input
                type="url"
                name="virtual_tour_url"
                value={formData.virtual_tour_url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Descrizione</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t">
            <button
              type="button"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Elimina Immobile
            </button>
            <div className="flex gap-4">
              <Link href="/admin/immobili" className="btn-secondary">
                Annulla
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
              >
                {saving ? 'Salvataggio...' : 'Salva Modifiche'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
