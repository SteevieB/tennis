# Tennis Buchungssystem

Eine moderne Web-Anwendung zur Verwaltung von Tennisplatz-Buchungen, entwickelt mit [Next.js](https://nextjs.org).

## Features

- Benutzerfreundliche Buchungsoberfläche
- Stündliche Zeitslots für Platzbuchungen
- Admin-Bereich für Einstellungsverwaltung
- Platzsperren für Wartung oder Turniere
- Responsive Design für mobile und Desktop-Nutzung
- Authentifizierung mit JWT
- SQLite-Datenbank zur einfachen Installation

## Erste Schritte

1. Klone das Repository
2. Installiere die Abhängigkeiten:

```bash
npm install
# oder
yarn
# oder
pnpm install
# oder
bun install
```

3. Starte den Entwicklungsserver:

```bash
npm run dev
# oder
yarn dev
# oder
pnpm dev
# oder
bun dev
```

4. Öffne [http://localhost:3001](http://localhost:3001) im Browser, um die Anwendung zu sehen.

## Systemanforderungen

- Node.js 20.x oder höher
- SQLite (wird automatisch eingerichtet)

## Konfiguration

Die Anwendung verwendet eine SQLite-Datenbank, die automatisch bei erstem Start erstellt wird. Du solltest eine `.env`-Datei mit folgendem Inhalt erstellen:

```
JWT_SECRET=dein-geheimer-schlüssel
```

## Administrationsbereich

Der Administrationsbereich ist unter `/admin` erreichbar und erlaubt:
- Verwalten der Systemeinstellungen
- Hinzufügen von Platzsperren
- Benutzerverwaltung

## Technologie-Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Datenbank**: SQLite
- **Authentifizierung**: JWT (JSON Web Tokens)