import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, getStatusLabel, getStatusColor } from '@/lib/utils/format'

export default async function AdminPropertiesPage() {
  const supabase = await createClient()

  const { data: properties } = await supabase
    .from('properties')
    .select('*, property_images(count)')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-display">Immobili</h1>
        <Link href="/admin/immobili/nuovo" className="btn-primary">
          Nuovo Immobile
        </Link>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Titolo</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Tipo</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Prezzo</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Stato</th>
              <th className="text-left px-6 py-3 text-sm font-medium text-brown/60">Visualizzazioni</th>
              <th className="text-right px-6 py-3 text-sm font-medium text-brown/60">Azioni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties?.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium">{property.title}</div>
                  <div className="text-sm text-brown/50">{property.city}</div>
                </td>
                <td className="px-6 py-4 text-sm capitalize">{property.property_type}</td>
                <td className="px-6 py-4 font-display">{formatPrice(property.price, property.currency)}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(property.status)}`}>
                    {getStatusLabel(property.status)}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-brown/60">{property.views}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/admin/immobili/${property.id}`}
                    className="text-terracotta hover:underline text-sm"
                  >
                    Modifica
                  </Link>
                </td>
              </tr>
            ))}
            {(!properties || properties.length === 0) && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-brown/50">
                  Nessun immobile. <Link href="/admin/immobili/nuovo" className="text-terracotta hover:underline">Crea il primo</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
