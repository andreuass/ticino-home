import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import PropertyCard from '@/components/PropertyCard'

export default async function HomePage() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_images(*)')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6)

  const featuredProperties = properties?.filter(p => (p as any).featured) ?? []

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-brown to-brown-light">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1920')] bg-cover bg-center opacity-30" />

        <div className="relative container-page text-center text-cream py-20">
          <h1 className="text-5xl md:text-7xl font-display font-semibold mb-6">
            La Tua Casa nel <span className="text-terracotta">Ticino</span>
          </h1>
          <p className="text-xl md:text-2xl text-cream/80 max-w-2xl mx-auto mb-10 font-light">
            Immobili di prestigio con vista lago e montagna.
            La tua agenzia immobiliare di fiducia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/immobili" className="btn-primary text-lg px-8 py-4">
              Scopri gli Immobili
            </Link>
            <Link href="/vendi-casa" className="btn-secondary border-cream text-cream hover:bg-cream hover:text-brown">
              Vendi la Tua Casa
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="section-title">Immobili in Evidenza</h2>
            <p className="text-brown/70 max-w-2xl mx-auto">
              Scopri la nostra selezione di immobili premium nel Canton Ticino
            </p>
          </div>

          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-brown/50">
              <p>Nessun immobile in evidenza al momento.</p>
              <Link href="/admin/immobili/nuovo" className="text-terracotta hover:underline mt-2 inline-block">
                Aggiungi il primo immobile
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/immobili" className="btn-secondary">
              Vedi Tutti gli Immobili
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-sage/10">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="section-title">I Nostri Servizi</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-terracotta/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="font-display text-2xl mb-3">Acquisto</h3>
              <p className="text-brown/70 text-sm">
                Ti guidiamo nell&apos;acquisto della casa dei tuoi sogni, dalla ricerca alla stipula.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-terracotta/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl mb-3">Vendita</h3>
              <p className="text-brown/70 text-sm">
                Valorizziamo il tuo immobile con fotografie professionali e virtual tour.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-terracotta/10 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-display text-2xl mb-3">Virtual Tour</h3>
              <p className="text-brown/70 text-sm">
                Tour virtuali a 360° per presentare il tuo immobile ai potenziali acquirenti.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-terracotta text-cream">
        <div className="container-page text-center">
          <h2 className="text-4xl md:text-5xl font-display mb-6">
            Hai un Immobile da Vendere?
          </h2>
          <p className="text-xl text-cream/80 max-w-2xl mx-auto mb-10">
            Contattaci oggi per una valutazione gratuita. Esperienza ventennale nel mercato ticinese.
          </p>
          <Link href="/vendi-casa" className="inline-block bg-cream text-brown font-medium px-8 py-4 rounded transition-colors hover:bg-cream/90">
            Richiedi Valutazione
          </Link>
        </div>
      </section>

      <Footer />
    </>
  )
}
