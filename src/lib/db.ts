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

      CREATE TABLE IF NOT EXISTS settings (
                                            key TEXT PRIMARY KEY,
                                            value TEXT,
                                            updated_at TEXT,
                                            updated_by INTEGER,
                                            FOREIGN KEY (updated_by) REFERENCES users(id)
        );
    `)
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