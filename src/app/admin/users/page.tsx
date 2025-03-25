'use client'

import { useState, useEffect, useCallback } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Benutzerverwaltung</h1>

        <Card>
          <CardHeader>
            <CardTitle>Benutzer</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
                <div className="text-center py-4">Laden...</div>
            ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rolle</TableHead>
                      <TableHead>Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            {user.is_active ? (
                                <Badge className="bg-green-500">Aktiv</Badge>
                            ) : (
                                <Badge variant="outline" className="text-orange-500 border-orange-500">
                                  Warten auf Freischaltung
                                </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.is_admin ? (
                                <Badge className="bg-blue-500">Administrator</Badge>
                            ) : (
                                <Badge variant="outline">Mitglied</Badge>
                            )}
                          </TableCell>
                          <TableCell>
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
                          </TableCell>
                        </TableRow>
                    ))}

                    {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center">
                            Keine Benutzer gefunden.
                          </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
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