import { redirect } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils/format'

export default async function AccountPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/accedi?redirect=/account')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: favorites } = await supabase
    .from('favorites')
    .select('*, properties(*, property_images(*))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*, properties(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <>
      <Header />

      <section className="py-12">
        <div className="container-page">
          <h1 className="section-title">Il Mio Account</h1>

          {/* Profile Info */}
          <div className="card p-6 mb-8">
            <h2 className="font-display text-xl mb-4">Profilo</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-brown/50">Nome</p>
                <p className="font-medium">{profile?.name || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-brown/50">Cognome</p>
                <p className="font-medium">{profile?.surname || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-brown/50">Email</p>
                <p className="font-medium">{profile?.email}</p>
              </div>
              <div>
                <p className="text-sm text-brown/50">Telefono</p>
                <p className="font-medium">{profile?.phone || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-brown/50">Ruolo</p>
                <p className="font-medium capitalize">{profile?.role || 'user'}</p>
              </div>
              <div>
                <p className="text-sm text-brown/50">Membro dal</p>
                <p className="font-medium">{profile?.created_at ? formatDate(profile.created_at) : '-'}</p>
              </div>
            </div>
          </div>

          {/* Favorites */}
          <div className="card p-6 mb-8">
            <h2 className="font-display text-xl mb-4">Immobili Preferiti</h2>
            {favorites && favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.map((fav) => (
                  <div key={fav.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    {fav.properties?.property_images?.[0] && (
                      <img
                        src={fav.properties.property_images[0].url}
                        alt={fav.properties.title}
                        className="w-20 h-20 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <Link href={`/immobili/${fav.properties?.slug}`} className="font-medium hover:text-terracotta">
                        {fav.properties?.title}
                      </Link>
                      <p className="text-sm text-brown/60">{fav.properties?.city}</p>
                    </div>
                    <Link href={`/immobili/${fav.properties?.slug}`} className="text-sm text-terracotta hover:underline">
                      Vedi →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-brown/50">Nessun immobile nei preferiti.</p>
            )}
          </div>

          {/* Inquiries */}
          <div className="card p-6">
            <h2 className="font-display text-xl mb-4">Le Mie Richieste</h2>
            {inquiries && inquiries.length > 0 ? (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{inquiry.properties?.title || 'Richiesta generale'}</p>
                        <p className="text-sm text-brown/60">
                          {inquiry.type === 'info' ? 'Informazioni' : 'Richiesta visita'}
                        </p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${
                        inquiry.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        inquiry.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                        inquiry.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {inquiry.status === 'new' ? 'Nuova' :
                         inquiry.status === 'contacted' ? 'Contattato' :
                         inquiry.status === 'in_progress' ? 'In corso' : 'Chiusa'}
                      </span>
                    </div>
                    <p className="text-sm text-brown/80">{inquiry.message}</p>
                    <p className="text-xs text-brown/50 mt-2">
                      Inviata il {formatDate(inquiry.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-brown/50">Nessuna richiesta.</p>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
