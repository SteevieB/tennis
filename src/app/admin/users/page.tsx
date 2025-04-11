'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [userToActivate, setUserToActivate] = useState<User | null>(null)
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const { toast } = useToast()
  const router = useRouter()

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
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

  // Filtere Benutzer basierend auf Suchbegriff und aktivem Filter
  useEffect(() => {
    let result = users

    // Filtere nach Suchbegriff
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(user =>
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term)
      )
    }

    // Wende den Statusfilter an
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'admin':
          result = result.filter(user => user.is_admin)
          break
        case 'active':
          result = result.filter(user => user.is_active && !user.is_admin)
          break
        case 'pending':
          result = result.filter(user => !user.is_active)
          break
      }
    }

    setFilteredUsers(result)
  }, [users, searchTerm, activeFilter])

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleFilterChange = (value: string) => {
    setActiveFilter(value)
  }

  const clearSearch = () => {
    setSearchTerm('')
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
            <div className="space-y-4">
              {/* Filteroptionen und Suchleiste */}
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Input
                        placeholder="Nach Name oder E-Mail suchen..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="pr-10"
                    />
                    {searchTerm && (
                        <button
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            onClick={clearSearch}
                        >
                          ✕
                        </button>
                    )}
                  </div>
                </div>
                <Tabs defaultValue="all" value={activeFilter} onValueChange={handleFilterChange} className="w-full md:w-auto">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="all">Alle</TabsTrigger>
                    <TabsTrigger value="admin">Admins</TabsTrigger>
                    <TabsTrigger value="active">Aktive</TabsTrigger>
                    <TabsTrigger value="pending">Wartend</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {loading ? (
                  <div className="text-center py-4">Laden...</div>
              ) : (
                  <div className="space-y-4">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
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
                        ))
                    ) : (
                        <div className="text-center p-4 border rounded-lg">
                          {searchTerm ? 'Keine Benutzer gefunden, die dem Suchbegriff entsprechen.' : 'Keine Benutzer gefunden.'}
                        </div>
                    )}
                  </div>
              )}
            </div>
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