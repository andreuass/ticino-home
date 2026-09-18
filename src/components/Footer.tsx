import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-brown text-cream py-12 mt-auto">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl  font-semibold">
              Ticino<span className="text-terracotta">Home</span>
            </Link>
            <p className="mt-4 text-cream/70 text-sm max-w-md">
              La tua agenzia immobiliare di fiducia nel Canton Ticino.
              Esperienza ventennale nella compravendita di immobili di prestigio.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className=" text-lg mb-4">Link Rapidi</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/immobili" className="text-cream/70 hover:text-terracotta transition-colors">
                  Immobili
                </Link>
              </li>
              <li>
                <Link href="/vendi-casa" className="text-cream/70 hover:text-terracotta transition-colors">
                  Vendi Casa
                </Link>
              </li>
              <li>
                <Link href="/contatti" className="text-cream/70 hover:text-terracotta transition-colors">
                  Contatti
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className=" text-lg mb-4">Contatti</h4>
            <ul className="space-y-2 text-sm text-cream/70">
              <li>Via principal 123</li>
              <li>6900 Lugano, Ticino</li>
              <li>+41 91 123 45 67</li>
              <li>info@ticinohome.ch</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/20 text-center text-sm text-cream/50">
          <p>&copy; {new Date().getFullYear()} TicinoHome. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  )
}
