// src/components/ClientLayout.tsx
'use client'

import { Toaster } from "@/components/ui/toaster"
import { AuthButton } from '@/components/AuthButton'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CLUB_INFO } from "@/lib/constants";

function Navigation() {
    return (
        <nav className="bg-primary text-primary-foreground shadow-lg">
            <div className="max-w-4xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <Image
                            src="/logo_tvu_1x1.png"
                            alt="Tennis Unterwössen Logo"
                            width={48}
                            height={48}
                            className="rounded-sm"
                        />
                        <Link href="/" className="text-xl font-bold">
                            {CLUB_INFO.name}
                        </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/bookings"
                            className="hover:bg-primary/80 px-3 py-2 rounded-md"
                        >
                            Platz buchen
                        </Link>
                        <Link
                            href="/pricing"
                            className="hover:bg-primary/80 px-3 py-2 rounded-md"
                        >
                            Preise
                        </Link>
                        <Link
                            href="/kontakt"
                            className="hover:bg-primary/80 px-3 py-2 rounded-md"
                        >
                            Kontakt
                        </Link>
                        <AuthButton />
                    </div>
                </div>
            </div>
        </nav>
    )
}

function MobileNavigation() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const router = useRouter()

    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const authResponse = await fetch('/api/auth/check', {
                credentials: 'include'
            })

            if (authResponse.ok) {
                setIsLoggedIn(true)
                // Check if user is admin
                const userResponse = await fetch('/api/auth/me')
                if (userResponse.ok) {
                    const userData = await userResponse.json()
                    setIsAdmin(userData.isAdmin)
                }
            } else {
                setIsLoggedIn(false)
                setIsAdmin(false)
            }
        } catch (error) {
            console.error('Auth check failed:', error)
            setIsLoggedIn(false)
        }
    }

    const handleLogout = async () => {
        try {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            })

            if (response.ok) {
                setIsLoggedIn(false)
                setIsAdmin(false)
                router.push('/')
            }
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-primary-foreground shadow-lg z-10">
            <div className="flex justify-around py-3">
                <Link
                    href="/bookings"
                    className="flex flex-col items-center space-y-1"
                >
                    <span className="text-sm">Platz buchen</span>
                </Link>
                <Link
                    href="/pricing"
                    className="flex flex-col items-center space-y-1"
                >
                    <span className="text-sm">Preise</span>
                </Link>
                <Link
                    href="/kontakt"
                    className="flex flex-col items-center space-y-1"
                >
                    <span className="text-sm">Kontakt</span>
                </Link>
                {isAdmin && (
                    <Link
                        href="/admin/settings"
                        className="flex flex-col items-center space-y-1"
                    >
                        <span className="text-sm">Admin</span>
                    </Link>
                )}
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="flex flex-col items-center space-y-1"
                    >
                        <span className="text-sm">Logout</span>
                    </button>
                ) : (
                    <Link
                        href="/auth"
                        className="flex flex-col items-center space-y-1"
                    >
                        <span className="text-sm">Login</span>
                    </Link>
                )}
            </div>
        </div>
    )
}

function Footer() {
    return (
        <footer className="bg-muted py-8">
            <div className="max-w-3xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold">{CLUB_INFO.name}</h3>
                        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                            <p>{CLUB_INFO.address.street}</p>
                            <p>{CLUB_INFO.address.zip} {CLUB_INFO.address.city}</p>
                            <p>Tel: {CLUB_INFO.contact.phone}</p>
                            <p>Email: {CLUB_INFO.contact.email}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold mb-4">Öffnungszeiten</h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Täglich von {CLUB_INFO.court.openingHours.open} - {CLUB_INFO.court.openingHours.close} Uhr</p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
                    <p className="mb-2">© {new Date().getFullYear()} {CLUB_INFO.name} <br/> Webdesign: Stefan Brandl</p>
                    <div className="space-x-4 md:pb-0 pb-16">
                        <Link href="/datenschutz" className="hover:text-primary">Datenschutz</Link>
                        <Link href="/impressum" className="hover:text-primary">Impressum</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default function ClientLayout({
                                         children,
                                     }: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1 bg-background">
                <div className="max-w-3xl mx-auto px-4 py-6">
                    {children}
                </div>
            </main>
            <Footer />
            <MobileNavigation />
            <Toaster />
        </div>
    )
}