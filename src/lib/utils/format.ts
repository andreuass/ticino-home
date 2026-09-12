export function formatPrice(price: number, currency: string = 'CHF'): string {
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('it-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateShort(date: string | Date): string {
  return new Intl.DateTimeFormat('it-CH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export function generateSlug(title: string): string {
  const baseSlug = slugify(title)
  const timestamp = Date.now().toString(36)
  return `${baseSlug}-${timestamp}`
}

export function getPropertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    apartment: 'Appartamento',
    house: 'Casa',
    villa: 'Villa',
    attic: 'Attico',
    rustic: 'Rustico',
    land: 'Terreno',
    office: 'Ufficio',
    commercial: 'Commerciale',
    other: 'Altro',
  }
  return labels[type] || type
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    draft: 'Bozza',
    published: 'Pubblicato',
    reserved: 'Riservato',
    sold: 'Venduto',
    archived: 'Archiviato',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-700',
    published: 'bg-green-100 text-green-700',
    reserved: 'bg-yellow-100 text-yellow-700',
    sold: 'bg-blue-100 text-blue-700',
    archived: 'bg-red-100 text-red-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}
