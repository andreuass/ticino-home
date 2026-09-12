import { createClient } from '@/lib/supabase/server'

export default async function AdminInquiriesPage() {
  const supabase = await createClient()

  const { data: inquiries } = await supabase
    .from('inquiries')
    .select('*, properties(title)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl font-display mb-8">Richieste</h1>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Data</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Nome</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Email</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Tipo</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Immobile</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Stato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {inquiries?.map((inquiry) => (
              <tr key={inquiry.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm">
                  {new Date(inquiry.created_at).toLocaleDateString('it-CH')}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{inquiry.name}</div>
                  <div className="text-sm text-brown/50">{inquiry.phone || '-'}</div>
                </td>
                <td className="px-6 py-4 text-sm">{inquiry.email}</td>
                <td className="px-6 py-4 text-sm capitalize">{inquiry.type === 'info' ? 'Info' : 'Visita'}</td>
                <td className="px-6 py-4 text-sm">
                  {inquiry.properties?.title || '-'}
                </td>
                <td className="px-6 py-4">
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
                </td>
              </tr>
            ))}
            {(!inquiries || inquiries.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brown/50">
                  Nessuna richiesta
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
