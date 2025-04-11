// /src/app/admin/settings/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useToast } from "@/hooks/use-toast"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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

interface CourtBlock {
  id: number
  court_id: number
  start_date: string
  end_date: string
  reason: string
}

export default function AdminSettingsPage() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    maxBookingDuration: '60',
    advanceBookingPeriod: '14',
    maxSimultaneousBookings: '3',
    openingTime: '08:00',
    closingTime: '22:00',
    maintenanceDay: 'monday',
    maintenanceTime: '06:00',
    autoCleanupDays: '7'
  })

  const [courtBlocks, setCourtBlocks] = useState<CourtBlock[]>([])
  const [blockToDelete, setBlockToDelete] = useState<CourtBlock | null>(null)
  const [newBlock, setNewBlock] = useState({
    courtId: 1,
    startDate: new Date(),
    endDate: new Date(),
    reason: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    fetchSettings()
    fetchCourtBlocks()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        toast({
          title: "Fehler beim Laden der Einstellungen",
          description: "Die Einstellungen konnten nicht geladen werden.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Fehler beim Laden der Einstellungen:', error)
      toast({
        title: "Fehler beim Laden der Einstellungen",
        description: "Bitte versuche es später erneut.",
        variant: "destructive"
      })
    }
  }

  const fetchCourtBlocks = async () => {
    try {
      const response = await fetch('/api/court-blocks')
      if (response.ok) {
        const data = await response.json()
        setCourtBlocks(data)
      } else {
        toast({
          title: "Fehler beim Laden der Platzsperren",
          description: "Die Platzsperren konnten nicht geladen werden.",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Fehler beim Laden der Platzsperren:', error)
      toast({
        title: "Fehler beim Laden der Platzsperren",
        description: "Bitte versuche es später erneut.",
        variant: "destructive"
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maxBookingDuration: parseInt(settings.maxBookingDuration),
          advanceBookingPeriod: parseInt(settings.advanceBookingPeriod),
          maxSimultaneousBookings: parseInt(settings.maxSimultaneousBookings),
          openingTime: settings.openingTime,
          closingTime: settings.closingTime,
          maintenanceDay: settings.maintenanceDay,
          maintenanceTime: settings.maintenanceTime,
          autoCleanupDays: parseInt(settings.autoCleanupDays)
        }),
      })

      if (response.ok) {
        toast({
          title: "Einstellungen gespeichert",
          description: "Die Änderungen wurden erfolgreich übernommen."
        })
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Unbekannter Fehler')
      }
    } catch (error) {
      console.error('Fehler beim Speichern der Einstellungen:', error)
      toast({
        title: "Fehler beim Speichern",
        description: "Bitte versuchen Sie es erneut.",
        variant: "destructive"
      })
    }
  }

  const handleAddBlock = async () => {
    try {
      if (!newBlock.reason.trim()) {
        toast({
          title: "Fehler",
          description: "Bitte geben Sie einen Grund für die Sperrung an.",
          variant: "destructive"
        })
        return
      }

      setIsSubmitting(true)

      // Formatiere Datum zu ISO String (YYYY-MM-DD)
      const startDateStr = newBlock.startDate.toISOString().split('T')[0]
      const endDateStr = newBlock.endDate.toISOString().split('T')[0]

      const response = await fetch('/api/court-blocks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courtId: newBlock.courtId,
          startDate: startDateStr,
          endDate: endDateStr,
          reason: newBlock.reason
        }),
      })

      if (response.ok) {
        toast({
          title: "Sperrzeit hinzugefügt",
          description: "Der Platz wurde für den angegebenen Zeitraum gesperrt."
        })

        // Setze Formular zurück
        setNewBlock({
          courtId: 1,
          startDate: new Date(),
          endDate: new Date(),
          reason: ''
        })

        // Aktualisiere die Liste der Sperrzeiten
        await fetchCourtBlocks()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Unbekannter Fehler')
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Sperrzeit:', error)
      toast({
        title: "Fehler beim Sperren",
        description: "Bitte versuchen Sie es erneut.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    try {
      if (!blockToDelete) return

      const response = await fetch(`/api/court-blocks?id=${blockToDelete.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: "Sperrzeit entfernt",
          description: "Die Sperrzeit wurde erfolgreich entfernt."
        })
        setBlockToDelete(null)
        await fetchCourtBlocks()
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Unbekannter Fehler')
      }
    } catch (error) {
      console.error('Fehler beim Löschen der Sperrzeit:', error)
      toast({
        title: "Fehler beim Löschen",
        description: "Die Sperrzeit konnte nicht gelöscht werden.",
        variant: "destructive"
      })
      setBlockToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }
    return new Date(dateString).toLocaleDateString('de-DE', options)
  }

  return (
      <div className="space-y-6 pb-16 md:pb-0">
        <h1 className="text-3xl font-bold">Admin-Einstellungen</h1>

        <Tabs defaultValue="general">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <TabsList className="mb-2">
              <TabsTrigger value="general">Allgemeine Einstellungen</TabsTrigger>
              <TabsTrigger value="blocks">Platzsperrungen</TabsTrigger>
            </TabsList>
            <Button variant="outline" onClick={() => window.location.href = '/admin/users'}>
              Benutzerverwaltung
            </Button>
          </div>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Allgemeine Einstellungen</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maxBookingDuration">Maximale Buchungsdauer (Minuten)</Label>
                      <Input
                          type="number"
                          id="maxBookingDuration"
                          value={settings.maxBookingDuration}
                          onChange={(e) => setSettings({ ...settings, maxBookingDuration: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="advanceBookingPeriod">Vorausbuchungszeitraum (Tage)</Label>
                      <Input
                          type="number"
                          id="advanceBookingPeriod"
                          value={settings.advanceBookingPeriod}
                          onChange={(e) => setSettings({ ...settings, advanceBookingPeriod: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxSimultaneousBookings">Maximale gleichzeitige Buchungen pro Nutzer</Label>
                      <Input
                          type="number"
                          id="maxSimultaneousBookings"
                          value={settings.maxSimultaneousBookings}
                          onChange={(e) => setSettings({ ...settings, maxSimultaneousBookings: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="autoCleanupDays">Automatische Löschung nach (Tage)</Label>
                      <Input
                          type="number"
                          id="autoCleanupDays"
                          value={settings.autoCleanupDays}
                          onChange={(e) => setSettings({ ...settings, autoCleanupDays: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="openingTime">Öffnungszeit</Label>
                      <Input
                          type="time"
                          id="openingTime"
                          value={settings.openingTime}
                          onChange={(e) => setSettings({ ...settings, openingTime: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="closingTime">Schließzeit</Label>
                      <Input
                          type="time"
                          id="closingTime"
                          value={settings.closingTime}
                          onChange={(e) => setSettings({ ...settings, closingTime: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maintenanceDay">Wartungstag</Label>
                      <Select
                          value={settings.maintenanceDay}
                          onValueChange={(value) => setSettings({ ...settings, maintenanceDay: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Wähle einen Tag" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Montag</SelectItem>
                          <SelectItem value="tuesday">Dienstag</SelectItem>
                          <SelectItem value="wednesday">Mittwoch</SelectItem>
                          <SelectItem value="thursday">Donnerstag</SelectItem>
                          <SelectItem value="friday">Freitag</SelectItem>
                          <SelectItem value="saturday">Samstag</SelectItem>
                          <SelectItem value="sunday">Sonntag</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maintenanceTime">Wartungszeit</Label>
                      <Input
                          type="time"
                          id="maintenanceTime"
                          value={settings.maintenanceTime}
                          onChange={(e) => setSettings({ ...settings, maintenanceTime: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit">Einstellungen speichern</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blocks">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Neue Platzsperrung</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Platz</Label>
                        <Select
                            value={newBlock.courtId.toString()}
                            onValueChange={(value) => setNewBlock({ ...newBlock, courtId: parseInt(value) })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Wähle einen Platz" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Platz 1</SelectItem>
                            <SelectItem value="2">Platz 2</SelectItem>
                            <SelectItem value="3">Platz 3</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Grund</Label>
                        <Input
                            value={newBlock.reason}
                            onChange={(e) => setNewBlock({ ...newBlock, reason: e.target.value })}
                            placeholder="z.B. Wartung, Turnier, etc."
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Von</Label>
                        <Calendar
                            mode="single"
                            selected={newBlock.startDate}
                            onSelect={(date) => date && setNewBlock({ ...newBlock, startDate: date })}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Bis</Label>
                        <Calendar
                            mode="single"
                            selected={newBlock.endDate}
                            onSelect={(date) => date && setNewBlock({ ...newBlock, endDate: date })}
                            disabled={(date) => date < newBlock.startDate}
                        />
                      </div>
                    </div>

                    <Button
                        onClick={handleAddBlock}
                        disabled={isSubmitting || !newBlock.reason.trim()}
                    >
                      {isSubmitting ? 'Wird hinzugefügt...' : 'Sperrzeit hinzufügen'}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Aktive Platzsperrungen</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courtBlocks.length > 0 ? (
                        courtBlocks.map((block) => (
                            <div key={block.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div>
                                <p className="font-medium">Platz {block.court_id}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(block.start_date)} bis {formatDate(block.end_date)}
                                </p>
                                <p className="text-sm text-muted-foreground">Grund: {block.reason}</p>
                              </div>
                              <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => setBlockToDelete(block)}
                              >
                                Löschen
                              </Button>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-4 border rounded-lg text-muted-foreground">
                          Keine aktiven Platzsperrungen vorhanden.
                        </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bestätigungsdialog für das Löschen einer Platzsperre */}
        <AlertDialog
            open={!!blockToDelete}
            onOpenChange={(open) => !open && setBlockToDelete(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Sperrzeit löschen</AlertDialogTitle>
              <AlertDialogDescription>
                Möchtest du die Sperrzeit für Platz {blockToDelete?.court_id} vom {blockToDelete ? formatDate(blockToDelete.start_date) : ''} bis {blockToDelete ? formatDate(blockToDelete.end_date) : ''} wirklich löschen?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Abbrechen</AlertDialogCancel>
              <AlertDialogAction
                  onClick={handleConfirmDelete}
                  className="bg-destructive hover:bg-destructive/90"
              >
                Löschen
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
  )
}