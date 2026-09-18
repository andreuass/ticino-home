'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils/format'

const propertyTypes = [
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

const statusOptions = [
  { value: 'draft', label: 'Bozza' },
  { value: 'published', label: 'Pubblicato' },
  { value: 'reserved', label: 'Riservato' },
  { value: 'sold', label: 'Venduto' },
  { value: 'archived', label: 'Archiviato' },
]

export default function NewPropertyPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState<{ url: string; file: File | null }[]>([])

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    currency: 'CHF',
    property_type: 'apartment',
    status: 'draft',
    city: '',
    neighborhood: '',
    address: '',
    rooms: '',
    bedrooms: '',
    bathrooms: '',
    size_sqm: '',
    year_built: '',
    floor: '',
    total_floors: '',
    parking: '',
    garage: false,
    balcony: false,
    terrace: false,
    garden: false,
    elevator: false,
    cellar: false,
    lake_view: false,
    mountain_view: false,
    pool: false,
    energy_class: '',
    video_url: '',
    virtual_tour_url: '',
    floor_plan_url: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const supabase = createClient()

    for (const file of Array.from(files)) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, file)

      if (error) {
        console.error('Upload error:', error)
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)

      setImages(prev => [...prev, { url: publicUrl, file: null }])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const slug = generateSlug(formData.title)

      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert({
          title: formData.title,
          slug,
          description: formData.description || null,
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
          year_built: formData.year_built ? parseInt(formData.year_built) : null,
          floor: formData.floor ? parseInt(formData.floor) : null,
          total_floors: formData.total_floors ? parseInt(formData.total_floors) : null,
          parking: formData.parking ? parseInt(formData.parking) : null,
          garage: formData.garage,
          balcony: formData.balcony,
          terrace: formData.terrace,
          garden: formData.garden,
          elevator: formData.elevator,
          cellar: formData.cellar,
          lake_view: formData.lake_view,
          mountain_view: formData.mountain_view,
          pool: formData.pool,
          energy_class: formData.energy_class || null,
          video_url: formData.video_url || null,
          virtual_tour_url: formData.virtual_tour_url || null,
          floor_plan_url: formData.floor_plan_url || null,
          published_at: formData.status === 'published' ? new Date().toISOString() : null,
        })
        .select()
        .single()

      if (propertyError) {
        setError(propertyError.message)
        return
      }

      // Insert images
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        await supabase.from('property_images').insert({
          property_id: property.id,
          url: img.url,
          position: i,
          is_primary: i === 0,
        })
      }

      router.push('/admin/immobili')
    } catch (err) {
      setError('Si è verificato un errore. Riprova.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl ">Nuovo Immobile</h1>
        <Link href="/admin/immobili" className="text-brown/60 hover:text-brown">
          ← Indietro
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="card p-6">
          <h2 className=" text-lg mb-4">Informazioni Base</h2>
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Descrizione</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="input-field resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prezzo *</label>
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
              <label className="block text-sm font-medium mb-2">Valuta</label>
              <select name="currency" value={formData.currency} onChange={handleChange} className="input-field">
                <option value="CHF">CHF</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tipo Immobile *</label>
              <select name="property_type" value={formData.property_type} onChange={handleChange} className="input-field">
                {propertyTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Stato</label>
              <select name="status" value={formData.status} onChange={handleChange} className="input-field">
                {statusOptions.map(status => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6">
          <h2 className=" text-lg mb-4">Localizzazione</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </div>

        {/* Features */}
        <div className="card p-6">
          <h2 className=" text-lg mb-4">Caratteristiche</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
            <div>
              <label className="block text-sm font-medium mb-2">Anno Costruzione</label>
              <input
                type="number"
                name="year_built"
                value={formData.year_built}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Piano</label>
              <input
                type="number"
                name="floor"
                value={formData.floor}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Piani Totali</label>
              <input
                type="number"
                name="total_floors"
                value={formData.total_floors}
                onChange={handleChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Parcheggi</label>
              <input
                type="number"
                name="parking"
                value={formData.parking}
                onChange={handleChange}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="card p-6">
          <h2 className=" text-lg mb-4">Comfort</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'garage', label: 'Garage' },
              { name: 'balcony', label: 'Balcone' },
              { name: 'terrace', label: 'Terrazza' },
              { name: 'garden', label: 'Giardino' },
              { name: 'elevator', label: 'Ascensore' },
              { name: 'cellar', label: 'Cantina' },
              { name: 'lake_view', label: 'Vista Lago' },
              { name: 'mountain_view', label: 'Vista Montagna' },
              { name: 'pool', label: 'Piscina' },
            ].map(item => (
              <label key={item.name} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name={item.name}
                  checked={formData[item.name as keyof typeof formData] as boolean}
                  onChange={handleChange}
                  className="rounded border-brown/30 text-terracotta focus:ring-terracotta"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Media */}
        <div className="card p-6">
          <h2 className=" text-lg mb-4">Media</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Foto</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="input-field"
            />
            <p className="text-sm text-brown/50 mt-1">
              Puoi caricare più immagini. La prima sarà l&apos;immagine principale.
            </p>
            {images.length > 0 && (
              <div className="mt-4 flex gap-2 flex-wrap">
                {images.map((img, i) => (
                  <div key={i} className="relative w-20 h-20 rounded overflow-hidden bg-gray-100">
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute bottom-0 left-0 right-0 bg-terracotta text-white text-xs text-center py-0.5">
                        Principale
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Classe Energetica</label>
              <select name="energy_class" value={formData.energy_class} onChange={handleChange} className="input-field">
                <option value="">Seleziona...</option>
                {['A', 'B', 'C', 'D', 'E', 'F', 'G'].map(cls => (
                  <option key={cls} value={cls}>Classe {cls}</option>
                ))}
              </select>
            </div>
            <div>
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
            <div>
              <label className="block text-sm font-medium mb-2">URL Tour Virtuale 360°</label>
              <input
                type="url"
                name="virtual_tour_url"
                value={formData.virtual_tour_url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">URL Planimetria</label>
              <input
                type="url"
                name="floor_plan_url"
                value={formData.floor_plan_url}
                onChange={handleChange}
                className="input-field"
                placeholder="https://..."
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/immobili" className="btn-secondary">
            Annulla
          </Link>
          <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50">
            {loading ? 'Salvataggio...' : 'Salva Immobile'}
          </button>
        </div>
      </form>
    </div>
  )
}
