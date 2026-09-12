# TicinoHome - Piattaforma Immobiliare Full-Stack

Progetto full-stack Next.js 16 + Supabase + Tailwind CSS per la gestione di immobili.

**Directory:** `c:\Users\andre\Desktop\ticino-home`

## Stack Tecnologico

- **Frontend:** Next.js 16 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Hosting:** Vercel (deploy da GitHub)
- **Database:** PostgreSQL tramite Supabase

## Configurazione Iniziale

### 1. Creare account Supabase

1. Vai su https://supabase.com e crea un nuovo progetto
2. Aspetta che il database sia pronto (2-3 minuti)
3. Recupera le credenziali da Settings > API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`

### 2. Configurare il Database

1. Vai su SQL Editor in Supabase Dashboard
2. Copia e incolla il contenuto di `supabase/schema.sql`
3. Esegui lo script

### 3. Configurare Storage

1. Vai su Storage > New Bucket
2. Crea un bucket chiamato `property-images` (pubblico)
3. Crea un bucket chiamato `avatars` (pubblico)

### 4. Configurare Environment Variables

Copia `.env.local.example` a `.env.local` e riempi con le tue credenziali Supabase:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 5. Deploy su Vercel

1. Push del codice su GitHub
2. Collega il repo a Vercel
3. Aggiungi le environment variables in Vercel Dashboard
4. Deploy!

## Struttura del Progetto

```
src/
├── app/                    # App Router pages
│   ├── page.tsx           # Home page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles + Tailwind
│   ├── accedi/            # Login page
│   ├── registrati/        # Register page
│   ├── account/           # User account (protected)
│   ├── immobili/          # Properties listing
│   │   └── [slug]/        # Property detail
│   ├── vendi-casa/        # Sell property form
│   ├── admin/             # Admin dashboard (protected)
│   │   ├── page.tsx       # Dashboard overview
│   │   ├── immobili/      # Property management
│   │   ├── richieste/     # Inquiries management
│   │   └── utenti/        # Users management
│   └── api/auth/          # Auth API routes
├── components/            # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── PropertyCard.tsx
├── lib/
│   ├── supabase/          # Supabase clients
│   │   ├── client.ts      # Browser client
│   │   ├── server.ts      # Server client
│   │   └── middleware.ts  # Auth middleware
│   └── utils/
│       └── format.ts      # Formatting utilities
├── types/
│   └── database.ts        # TypeScript types
└── middleware.ts          # Next.js middleware
```

## Utenti e Ruoli

Il sistema ha 3 ruoli:

- **admin:** Accesso completo a tutti i dati, gestione utenti, può pubblicare/modificare/eliminare immobili
- **agent:** Può gestire i propri immobili e visualizzare le richieste
- **user:** Può registrarsi, salvare preferiti, inviare richieste

### Creare il primo admin

1. Registrati normalmente sul sito
2. Vai su Supabase Dashboard > Table Editor > profiles
3. Modifica il tuo profilo e cambia `role` da `user` a `admin`

## Funzionalità

### Pubbliche
- Visualizzazione immobili pubblicati
- Ricerca con filtri (città, tipo, prezzo)
- Dettaglio immobile con gallery e virtual tour
- Pagina "Vendi Casa" per richieste

### Utenti Registrati
- Login/Registrazione
- Salvataggio immobili nei preferiti
- Invio richieste di informazioni o visite
- Visualizzazione storico richieste

### Admin
- Dashboard con statistiche
- CRUD completo immobili
- Upload immagini con drag & drop
- Gestione richieste (cambia stato)
- Gestione utenti (cambia ruoli)

## API Routes

- `POST /api/auth/signout` - Logout

## TypeScript Types

Tutti i tipi sono definiti in `src/types/database.ts` basati sullo schema del database.

## Design System

- **Palette:** crema `#fdf6ec`, terracotta `#e07b4c`, marrone `#3d2c1e`
- **Font:** Cormorant Garamond (display), DM Mono (body)
- **Componenti:** Classes Tailwind custom in `globals.css`

## Comandi

```bash
npm run dev      # Development server (localhost:3000)
npm run build    # Build produzione
npm run start    # Start produzione
```
