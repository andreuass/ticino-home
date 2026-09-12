import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'TicinoHome - Immobili di Prestigio in Ticino',
  description: 'Scopri i migliori immobili in vendita nel Canton Ticino: appartamenti, ville, rustici e terreni con vista lago e montagna.',
  keywords: 'immobili ticino, case ticino, appartamenti lugano, ville lago maggiore, rustici ticino',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <body className="min-h-screen bg-cream text-brown antialiased">
        {children}
      </body>
    </html>
  )
}
