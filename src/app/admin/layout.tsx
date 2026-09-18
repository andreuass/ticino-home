import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/accedi?redirect=/admin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-brown text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin" className=" text-xl">
              Ticino<span className="text-terracotta">Home</span> Admin
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/" className="text-sm text-cream/70 hover:text-cream">
                Vedi Sito
              </Link>
              <form action="/api/auth/signout" method="post">
                <button type="submit" className="text-sm text-cream/70 hover:text-cream">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <nav className="lg:col-span-1">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/admin"
                  className="block px-4 py-2 rounded hover:bg-brown/10"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/immobili"
                  className="block px-4 py-2 rounded hover:bg-brown/10"
                >
                  Immobili
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/richieste"
                  className="block px-4 py-2 rounded hover:bg-brown/10"
                >
                  Richieste
                </Link>
              </li>
              <li>
                <Link
                  href="/admin/utenti"
                  className="block px-4 py-2 rounded hover:bg-brown/10"
                >
                  Utenti
                </Link>
              </li>
            </ul>
          </nav>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
