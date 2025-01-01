// src/lib/db.ts
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

let dbConnection: any = null

async function openDb() {
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

export const db = {
  async get(sql: string, params: any[] = []) {
    const dbInstance = await openDb()
    return dbInstance.get(sql, params)
  },

  async all(sql: string, params: any[] = []) {
    const dbInstance = await openDb()
    return dbInstance.all(sql, params)
  },

  async run(sql: string, params: any[] = []) {
    const dbInstance = await openDb()
    return dbInstance.run(sql, params)
  },

  async exec(sql: string) {
    const dbInstance = await openDb()
    return dbInstance.exec(sql)
  }
}