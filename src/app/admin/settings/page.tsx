'use client'

import { useState, useEffect } from 'react'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    maxBookingDuration: '',
    advanceBookingPeriod: '',
    maxSimultaneousBookings: '',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    const response = await fetch('/api/settings')
    if (response.ok) {
      const data = await response.json()
      setSettings(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })

    if (response.ok) {
      alert('Settings updated successfully!')
    } else {
      alert('Failed to update settings. Please try again.')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Settings</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="maxBookingDuration" className="block mb-2">
            Maximum Booking Duration (minutes)
          </label>
          <input
            type="number"
            id="maxBookingDuration"
            value={settings.maxBookingDuration}
            onChange={(e) => setSettings({ ...settings, maxBookingDuration: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="advanceBookingPeriod" className="block mb-2">
            Advance Booking Period (days)
          </label>
          <input
            type="number"
            id="advanceBookingPeriod"
            value={settings.advanceBookingPeriod}
            onChange={(e) => setSettings({ ...settings, advanceBookingPeriod: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="maxSimultaneousBookings" className="block mb-2">
            Maximum Simultaneous Bookings per User
          </label>
          <input
            type="number"
            id="maxSimultaneousBookings"
            value={settings.maxSimultaneousBookings}
            onChange={(e) => setSettings({ ...settings, maxSimultaneousBookings: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Save Settings
        </button>
      </form>
    </div>
  )
}

