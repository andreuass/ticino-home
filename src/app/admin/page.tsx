import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [{ count: propertiesCount }, { count: inquiriesCount }, { count: usersCount }] = await Promise.all([
    supabase.from('properties').select('*', { count: 'exact', head: true }),
    supabase.from('inquiries').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentInquiries } = await supabase
    .from('inquiries')
    .select('*, properties(title)')
    .order('created_at', { ascending: false })
    .limit(5)

  const { data: recentProperties } = await supabase
    .from('properties')
    .select('title, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div>
      <h1 className="text-2xl font-display mb-8">Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <p className="text-sm text-brown/60 mb-1">Immobili</p>
          <p className="text-3xl font-display">{propertiesCount ?? 0}</p>
          <Link href="/admin/immobili" className="text-sm text-terracotta hover:underline mt-2 inline-block">
            Gestisci →
          </Link>
        </div>
        <div className="card p-6">
          <p className="text-sm text-brown/60 mb-1">Richieste</p>
          <p className="text-3xl font-display">{inquiriesCount ?? 0}</p>
          <Link href="/admin/richieste" className="text-sm text-terracotta hover:underline mt-2 inline-block">
            Vedi tutte →
          </Link>
        </div>
        <div className="card p-6">
          <p className="text-sm text-brown/60 mb-1">Utenti</p>
          <p className="text-3xl font-display">{usersCount ?? 0}</p>
          <Link href="/admin/utenti" className="text-sm text-terracotta hover:underline mt-2 inline-block">
            Gestisci →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Properties */}
        <div className="card p-6">
          <h2 className="font-display text-lg mb-4">Immobili Recenti</h2>
          {recentProperties && recentProperties.length > 0 ? (
            <ul className="space-y-3">
              {recentProperties.map((property) => (
                <li key={property.title} className="flex items-center justify-between">
                  <span className="truncate">{property.title}</span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    property.status === 'published' ? 'bg-green-100 text-green-700' :
                    property.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {property.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brown/50">Nessun immobile</p>
          )}
          <Link href="/admin/immobili" className="text-sm text-terracotta hover:underline mt-4 inline-block">
            Vedi tutti gli immobili →
          </Link>
        </div>

        {/* Recent Inquiries */}
        <div className="card p-6">
          <h2 className="font-display text-lg mb-4">Richieste Recenti</h2>
          {recentInquiries && recentInquiries.length > 0 ? (
            <ul className="space-y-3">
              {recentInquiries.map((inquiry) => (
                <li key={inquiry.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{inquiry.name}</p>
                    <p className="text-sm text-brown/60 truncate">{inquiry.message}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {inquiry.status}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brown/50">Nessuna richiesta</p>
          )}
          <Link href="/admin/richieste" className="text-sm text-terracotta hover:underline mt-4 inline-block">
            Vedi tutte le richieste →
          </Link>
        </div>
      </div>
    </div>
  )
}
