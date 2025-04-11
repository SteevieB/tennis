// src/lib/db.ts
import sqlite3 from 'sqlite3'
import { open, Database } from 'sqlite'

let dbConnection: Database | null = null

async function openDb(): Promise<Database> {
  if (!dbConnection) {
    dbConnection = await open({
      filename: './tennis_court_booking.db',
      driver: sqlite3.Database,
    })

    await dbConnection.exec(`
      CREATE TABLE IF NOT EXISTS users (
                                         id INTEGER PRIMARY KEY AUTOINCREMENT,
                                         email TEXT UNIQUE,
                                         name TEXT,
                                         password_hash TEXT,
                                         is_admin BOOLEAN,
                                         is_active BOOLEAN
      );

      CREATE TABLE IF NOT EXISTS bookings (
                                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                                            court_id INTEGER,
                                            user_id INTEGER,
                                            date TEXT,
                                            start_time TEXT,
                                            end_time TEXT,
                                            type TEXT CHECK(type IN ('regular', 'tournament', 'maintenance')) DEFAULT 'regular',
        FOREIGN KEY (user_id) REFERENCES users(id)
        );

      CREATE TABLE IF NOT EXISTS court_blocks (
                                                id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                court_id INTEGER NOT NULL,
                                                start_date TEXT NOT NULL,
                                                end_date TEXT NOT NULL,
                                                reason TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS settings (
                                            maxBookingDuration INTEGER DEFAULT 60,
                                            advanceBookingPeriod INTEGER DEFAULT 14,
                                            maxSimultaneousBookings INTEGER DEFAULT 3,
                                            openingTime TEXT DEFAULT '08:00',
                                            closingTime TEXT DEFAULT '22:00',
                                            maintenanceDay TEXT DEFAULT 'monday',
                                            maintenanceTime TEXT DEFAULT '06:00',
                                            autoCleanupDays INTEGER DEFAULT 7
      );
    `)

    // Überprüfe, ob Einstellungen vorhanden sind, falls nicht, füge Standardeinstellungen ein
    const settingsExist = await dbConnection.get('SELECT 1 FROM settings LIMIT 1')
    if (!settingsExist) {
      await dbConnection.run(`
        INSERT INTO settings (
          maxBookingDuration,
          advanceBookingPeriod,
          maxSimultaneousBookings,
          openingTime,
          closingTime,
          maintenanceDay,
          maintenanceTime,
          autoCleanupDays
        ) VALUES (60, 14, 3, '08:00', '22:00', 'monday', '06:00', 7)
      `)
    }
  }
  return dbConnection
}

// Flexibler Typ für die Parameter
type SqlParams = Record<string, unknown> | unknown[]

export const db = {
  async get<T = unknown>(sql: string, params: SqlParams = []): Promise<T | undefined> {
    const dbInstance = await openDb()
    return dbInstance.get<T>(sql, params)
  },

  async all<T = unknown>(sql: string, params: SqlParams = []): Promise<T[]> {
    const dbInstance = await openDb()
    return dbInstance.all<T[]>(sql, params) as Promise<T[]>
  },

  async run(sql: string, params: SqlParams = []): Promise<sqlite3.RunResult> {
    const dbInstance = await openDb()
    return dbInstance.run(sql, params) as unknown as sqlite3.RunResult
  },

  async exec(sql: string): Promise<void> {
    const dbInstance = await openDb()
    return dbInstance.exec(sql)
  }
}