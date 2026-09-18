import { createClient } from '@/lib/supabase/server'

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-2xl  mb-8">Utenti</h1>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Nome</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Email</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Telefono</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Ruolo</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Data Registrazione</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">
                    {[user.name, user.surname].filter(Boolean).join(' ') || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{user.email}</td>
                <td className="px-6 py-4 text-sm">{user.phone || '-'}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${
                    user.role === 'admin' ? 'bg-red-100 text-red-700' :
                    user.role === 'agent' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role === 'admin' ? 'Admin' : user.role === 'agent' ? 'Agente' : 'Utente'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  {new Date(user.created_at).toLocaleDateString('it-CH')}
                </td>
              </tr>
            ))}
            {(!users || users.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-brown/50">
                  Nessun utente
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
