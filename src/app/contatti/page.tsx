import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ContattiPage() {
  return (
    <>
      <Header />

      <section className="py-12">
        <div className="container-page">
          <h1 className="section-title">Contatti</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className=" text-2xl mb-6">Informazioni</h2>

              <div className="space-y-6">
                <div className="card p-6">
                  <h3 className=" text-lg mb-2">Indirizzo</h3>
                  <p className="text-brown/70">
                    Via principale 123<br />
                    6900 Lugano, Ticino<br />
                    Svizzera
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className=" text-lg mb-2">Telefono</h3>
                  <p className="text-brown/70">
                    <a href="tel:+41911234567" className="hover:text-terracotta">
                      +41 91 123 45 67
                    </a>
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className=" text-lg mb-2">Email</h3>
                  <p className="text-brown/70">
                    <a href="mailto:info@ticinohome.ch" className="hover:text-terracotta">
                      info@ticinohome.ch
                    </a>
                  </p>
                </div>

                <div className="card p-6">
                  <h3 className=" text-lg mb-2">Orari</h3>
                  <p className="text-brown/70">
                    Lunedì - Venerdì: 09:00 - 18:00<br />
                    Sabato: 09:00 - 12:00<br />
                    Domenica: Chiuso
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className=" text-2xl mb-6">Inviaci un Messaggio</h2>

              <div className="card p-6">
                <form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome *</label>
                    <input
                      type="text"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      className="input-field"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Telefono</label>
                    <input
                      type="tel"
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Messaggio *</label>
                    <textarea
                      rows={5}
                      className="input-field resize-none"
                      required
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full">
                    Invia Messaggio
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
