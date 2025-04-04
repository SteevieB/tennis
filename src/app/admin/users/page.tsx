'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface User {
  id: number
  email: string
  name: string
  is_admin: boolean
  is_active: boolean
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [userToActivate, setUserToActivate] = useState<User | null>(null)
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        toast({
          title: "Fehler beim Laden der Benutzer",
          description: "Bitte versuche es später erneut.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Fehler beim Laden der Benutzer:', error)
      toast({
        title: "Fehler beim Laden der Benutzer",
        description: "Bitte versuche es später erneut.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleToggleUserStatus = async (user: User, activate: boolean) => {
    try {
      const response = await fetch(`/api/users`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          name: user.name,
          isAdmin: user.is_admin,
          isActive: activate
        }),
      })

      if (response.ok) {
        toast({
          title: activate ? "Benutzer aktiviert" : "Benutzer deaktiviert",
          description: `${user.name} wurde erfolgreich ${activate ? 'aktiviert' : 'deaktiviert'}.`,
        })
        await fetchUsers()
      } else {
        throw new Error('Status konnte nicht geändert werden')
      }
    } catch (error) {
      console.error('Fehler beim Ändern des Benutzerstatus:', error)
      toast({
        title: "Fehler",
        description: "Der Benutzerstatus konnte nicht geändert werden.",
        variant: "destructive"
      })
    } finally {
      setUserToActivate(null)
      setUserToDeactivate(null)
    }
  }

  return (
      <div className="space-y-6 pb-16 md:pb-0">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-3xl font-bold">Benutzerverwaltung</h1>
          <Button
              variant="outline"
              onClick={() => router.push('/admin/settings')}
          >
            Zurück zu Einstellungen
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Benutzer</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="text-center py-4">Laden...</div>
            ) : (
                <div className="space-y-4">
                  {users.map((user) => (
                      <div key={user.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg gap-3">
                        <div className="grid gap-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.name}</span>
                            {user.is_admin ? (
                                <Badge className="bg-blue-500">Admin</Badge>
                            ) : null}
                          </div>
                          <div className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {user.email}
                          </div>
                          <div className="mt-1">
                            {user.is_active ? (
                                <Badge className="bg-green-500">Aktiv</Badge>
                            ) : (
                                <Badge variant="outline" className="text-orange-500 border-orange-500">
                                  Warten auf Freischaltung
                                </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-end">
                          {user.is_active ? (
                              <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setUserToDeactivate(user)}
                              >
                                Deaktivieren
                              </Button>
                          ) : (
                              <Button
                                  className="bg-green-500 hover:bg-green-600"
                                  size="sm"
                                  onClick={() => setUserToActivate(user)}
                              >
                                Freischalten
                              </Button>
                          )}
                        </div>
                      </div>
                  ))}

                  {users.length === 0 && (
                      <div className="text-center p-4 border rounded-lg">
                        Keine Benutzer gefunden.
                      </div>
                  )}
                </div>
            )}
          </CardContent>
        </Card>

        {/* Bestätigungsdialog für Aktivierung */}
        <AlertDialog
            open={!!userToActivate}
            onOpenChange={(open) => !open && setUserToActivate(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Benutzer freischalten</AlertDialogTitle>
              <AlertDialogDescription>
                Möchtest du den Benutzer &ldquo;{userToActivate?.name}&rdquo; wirklich freischalten?
                Nach der Freischaltung kann sich der Benutzer anmelden und Plätze buchen.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => userToActivate && handleToggleUserStatus(userToActivate, true)}
              >
                Freischalten
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bestätigungsdialog für Deaktivierung */}
        <AlertDialog
            open={!!userToDeactivate}
            onOpenChange={(open) => !open && setUserToDeactivate(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Benutzer deaktivieren</AlertDialogTitle>
              <AlertDialogDescription>
                Möchtest du den Benutzer &ldquo;{userToDeactivate?.name}&rdquo; wirklich deaktivieren?
                Nach der Deaktivierung kann sich der Benutzer nicht mehr anmelden.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                  className="bg-destructive hover:bg-red-700"
                  onClick={() => userToDeactivate && handleToggleUserStatus(userToDeactivate, false)}
              >
                Deaktivieren
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}