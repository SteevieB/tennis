# Tennis Buchungssystem

Eine moderne Web-Anwendung zur Verwaltung von Tennisplatz-Buchungen, entwickelt mit [Next.js](https://nextjs.org).

## Features

- **Benutzerfreundliche Buchungsplattform**
    - Intuitive Benutzeroberfläche für Desktop und mobile Geräte
    - Visuelle Platzauswahl und Kalendernavigation
    - Stündliche Zeitslots für flexible Platzbuchungen

- **Administrationsbereich**
    - Umfassende Einstellungsverwaltung
    - Benutzerverwaltung mit Aktivierungs-/Deaktivierungsoptionen
    - Platzsperren für Wartungsarbeiten oder Turniere

- **Technische Merkmale**
    - Responsive Design für alle Gerätetypen
    - Sichere Authentifizierung mit JWT
    - SQLite-Datenbank für einfache Installation und Wartung
  

## Erste Schritte

### Voraussetzungen

- Node.js 20.x oder höher
- npm, yarn, pnpm oder bun als Paketmanager

### Installation

1. Repository klonen:
   ```bash
   git clone https://github.com/dein-username/tennis_buchung.git
   cd tennis_buchung
   ```

2. Abhängigkeiten installieren:
   ```bash
   npm install
   # oder
   yarn
   # oder
   pnpm install
   # oder
   bun install
   ```

3. Konfigurationsdatei erstellen:
   Erstelle eine `.env`-Datei im Hauptverzeichnis mit folgendem Inhalt:
   ```
   JWT_SECRET=dein-geheimer-schlüssel
   ```

4. Entwicklungsserver starten:
   ```bash
   npm run dev
   # oder
   yarn dev
   # oder
   pnpm dev
   # oder
   bun dev
   ```

5. Öffne [http://localhost:3101](http://localhost:3101) im Browser, um die Anwendung zu sehen.

## Datenbank

Die Anwendung verwendet SQLite, das bei der ersten Ausführung automatisch eingerichtet wird. Die Datenbankdatei `tennis_court_booking.db` wird im Hauptverzeichnis erstellt.

### Datenbanktabellen

- `users`: Benutzerinformationen und Anmeldedaten
- `bookings`: Platzbuchungen mit Datum und Uhrzeiten
- `settings`: Systemeinstellungen wie Öffnungszeiten und Buchungsregeln
- `court_blocks`: Sperrzeiten für Plätze (Wartung, Turniere)

## Benutzerrollen

- **Administratoren**:
    - Können alle Buchungen verwalten
    - Haben Zugriff auf den Admin-Bereich
    - Können Benutzer aktivieren/deaktivieren
    - Können Systemeinstellungen ändern

- **Standardnutzer**:
    - Können Plätze innerhalb der konfigurierten Regeln buchen
    - Können nur ihre eigenen Buchungen stornieren

## Technologie-Stack

- **Frontend**:
    - Next.js 15
    - React 18
    - Tailwind CSS
    - shadcn/ui Komponenten

- **Backend**:
    - Next.js API Routes
    - SQLite Datenbank
    - JWT für Authentifizierung

## Entwicklung und Beitrag

### Codestruktur

- `/src/app`: Next.js App Router Struktur mit Komponenten und Seiten
- `/src/components`: Wiederverwendbare UI-Komponenten
- `/src/lib`: Hilfsfunktionen und Datenbankzugriff
- `/src/hooks`: React Hooks für gemeinsame Funktionalität

### Tests ausführen

```bash
npm run test
# oder
yarn test
```

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert. Weitere Informationen findest du in der [LICENSE](LICENSE) Datei.

## Kontakt

Bei Fragen oder Problemen erstelle bitte ein Issue im GitHub-Repository oder kontaktiere uns unter tennis.buchung@example.com.