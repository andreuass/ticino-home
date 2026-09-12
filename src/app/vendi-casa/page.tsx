'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function VendiCasaPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    city: '',
    address: '',
    rooms: '',
    size: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <>
        <Header />
        <section className="py-20">
          <div className="container-page max-w-2xl text-center">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="section-title">Richiesta Inviata!</h1>
            <p className="text-brown/70 mb-8">
              Grazie per averci contattato. Ti ricontatteremo entro 24 ore per discutere della valutazione del tuo immobile.
            </p>
            <a href="/" className="btn-primary">
              Torna alla Home
            </a>
          </div>
        </section>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <section className="py-12">
        <div className="container-page">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="section-title">Vendi la Tua Casa</h1>
              <p className="text-brown/70 max-w-2xl mx-auto">
                Vuoi vendere il tuo immobile? Compila il form e ti contatteremo per una valutazione gratuita e senza impegno.
              </p>
            </div>

            <div className="card p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Telefono</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Tipo Immobile *</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="input-field"
                      required
                    >
                      <option value="">Seleziona...</option>
                      <option value="apartment">Appartamento</option>
                      <option value="house">Casa</option>
                      <option value="villa">Villa</option>
                      <option value="attic">Attico</option>
                      <option value="rustic">Rustico</option>
                      <option value="land">Terreno</option>
                      <option value="other">Altro</option>
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
                    <label className="block text-sm font-medium mb-2">Numero Locali</label>
                    <input
                      type="text"
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Superficie (m²)</label>
                    <input
                      type="text"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Messaggio</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="input-field resize-none"
                    placeholder="Descrivi il tuo immobile o eventuali domande..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? 'Invio in corso...' : 'Invia Richiesta'}
                </button>

                <p className="text-center text-sm text-brown/50">
                  I tuoi dati saranno trattati secondo la normativa sulla privacy.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
