import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PropertyCard from '@/components/PropertyCard'
import { createClient } from '@/lib/supabase/server'
import { getPropertyTypeLabel } from '@/lib/utils/format'

export default async function PropertiesPage() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  const propertyTypes = ['apartment', 'house', 'villa', 'attic', 'rustic', 'land', 'office', 'commercial', 'other']

  return (
    <>
      <Header />

      <section className="py-12">
        <div className="container-page">
          <h1 className="section-title">I Nostri Immobili</h1>

          {/* Filters */}
          <div className="card p-6 mb-8">
            <form className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Città</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Lugano, Paradiso..."
                  className="input-field"
                />
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Tipo</label>
                <select name="type" className="input-field">
                  <option value="">Tutti i tipi</option>
                  {propertyTypes.map(type => (
                    <option key={type} value={type}>
                      {getPropertyTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium mb-2">Prezzo Max</label>
                <select name="maxPrice" className="input-field">
                  <option value="">Qualsiasi</option>
                  <option value="500000">CHF 500'000</option>
                  <option value="1000000">CHF 1'000'000</option>
                  <option value="2000000">CHF 2'000'000</option>
                  <option value="5000000">CHF 5'000'000</option>
                </select>
              </div>

              <button type="submit" className="btn-primary">
                Filtra
              </button>
            </form>
          </div>

          {/* Results */}
          {properties && properties.length > 0 ? (
            <>
              <p className="text-brown/70 mb-6">
                {properties.length} {properties.length === 1 ? 'immobile trovato' : 'immobili trovati'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-brown/70 mb-4">Nessun immobile trovato.</p>
              <p className="text-brown/50">Prova a modificare i filtri di ricerca.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  )
}
