// /src/components/AuthButton.tsx
"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"

export function AuthButton() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()
    const { toast } = useToast()

    // Prüfe den Login-Status wenn die Komponente mounted
    useEffect(() => {
        checkAuthStatus()
    }, [])

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/auth/check', {
                credentials: 'include'
            })
            setIsLoggedIn(response.ok)
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
                toast({
                    title: "Logout erfolgreich",
                    description: "Du wurdest erfolgreich abgemeldet",
                })
                router.push('/')
            }
        } catch (error) {
            console.error('Logout failed:', error)
            toast({
                title: "Fehler",
                description: "Logout fehlgeschlagen. Bitte versuche es erneut.",
                variant: "destructive",
            })
        }
    }

    const handleLoginClick = () => {
        router.push('/auth')
    }

    // Event listener für erfolgreichen Login
    useEffect(() => {
        const handleStorageChange = () => {
            checkAuthStatus()
        }

        window.addEventListener('auth-state-changed', handleStorageChange)
        return () => {
            window.removeEventListener('auth-state-changed', handleStorageChange)
        }
    }, [])

    return (
        <button
            onClick={isLoggedIn ? handleLogout : handleLoginClick}
            className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            {isLoggedIn ? 'Logout' : 'Login'}
        </button>
    )
}

// Helper Funktion zum Dispatchen des Auth-Events
export const notifyAuthStateChange = () => {
    window.dispatchEvent(new Event('auth-state-changed'))
}