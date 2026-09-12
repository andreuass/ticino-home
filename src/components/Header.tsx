'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import type { Profile } from '@/types/database'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Immobili', href: '/immobili' },
  { name: 'Vendi Casa', href: '/vendi-casa' },
  { name: 'Contatti', href: '/contatti' },
]

export default function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data }) => {
      setUser(data.user)

      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        setProfile(profileData)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const isAdmin = profile?.role === 'admin'

  return (
    <header className="bg-cream/95 backdrop-blur-sm sticky top-0 z-50 border-b border-brown/10">
      <nav className="container-page">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-display font-semibold text-brown">
              Ticino<span className="text-terracotta">Home</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-terracotta'
                    : 'text-brown hover:text-terracotta'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="text-sm font-medium text-terracotta hover:text-terracotta/80 transition-colors"
                      >
                        Admin
                      </Link>
                    )}
                    <Link
                      href="/account"
                      className="text-sm font-medium text-brown hover:text-terracotta transition-colors"
                    >
                      Account
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="text-sm font-medium text-brown hover:text-terracotta transition-colors"
                    >
                      Esci
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/accedi"
                      className="text-sm font-medium text-brown hover:text-terracotta transition-colors"
                    >
                      Accedi
                    </Link>
                    <Link href="/registrati" className="btn-primary text-sm">
                      Registrati
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 text-brown"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Apri menu</span>
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-brown/10">
            <div className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-base font-medium ${
                    pathname === item.href ? 'text-terracotta' : 'text-brown'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-brown/10">
                {!loading && (
                  <>
                    {user ? (
                      <>
                        {isAdmin && (
                          <Link href="/admin" className="btn-secondary text-center" onClick={() => setMobileMenuOpen(false)}>
                            Pannello Admin
                          </Link>
                        )}
                        <Link href="/account" className="btn-secondary text-center" onClick={() => setMobileMenuOpen(false)}>
                          Account
                        </Link>
                        <button onClick={handleSignOut} className="btn-primary text-center">
                          Esci
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/accedi" className="btn-secondary text-center" onClick={() => setMobileMenuOpen(false)}>
                          Accedi
                        </Link>
                        <Link href="/registrati" className="btn-primary text-center" onClick={() => setMobileMenuOpen(false)}>
                          Registrati
                        </Link>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
