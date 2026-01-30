# Biwak – Karneval Ablauf

Live-Ablauftafel für Karneval-Veranstaltungen: öffentliche Ansicht (Ablauf, aktuell auf der Bühne, Verzögerung, nächste Clubs) und Admin-Ansicht (nur Buttons: „Jetzt auf die Bühne“, optional Pause/Umbau).

## Tech

- **Next.js 16** (App Router), **React 19**, **Tailwind v4**, **shadcn/ui**
- **SQLite** (lokal: Datei) + **Turso** (Produktion) mit **Drizzle ORM** und **libsql**
- **Vercel** für Hosting

## Lokal starten

1. Abhängigkeiten installieren:

   ```bash
   bun install
   ```

2. Umgebungsvariablen anlegen (siehe `.env.example`):

   ```bash
   cp .env.example .env
   # TURSO_DATABASE_URL (z. B. file:./data/biwak.db) und ADMIN_PASSWORD eintragen
   ```

3. Für lokales SQLite: Verzeichnis anlegen und Schema anwenden:

   ```bash
   mkdir -p data
   bun run db:push
   ```

4. Seed ausführen (ein Event + Slots):

   ```bash
   bun run db:seed
   ```

5. Dev-Server starten:

   ```bash
   bun run dev
   ```

- **Öffentliche Ansicht:** [http://localhost:3000](http://localhost:3000)
- **Admin:** [http://localhost:3000/admin](http://localhost:3000/admin) (Passwort aus `ADMIN_PASSWORD`)

## Deploy auf Vercel

1. Repo mit Vercel verbinden.
2. **Turso**-Datenbank anlegen ([turso.tech](https://turso.tech)), URL und Auth Token holen.
3. Env-Variablen in Vercel setzen:
   - `TURSO_DATABASE_URL` (Turso-URL, z. B. `libsql://…`)
   - `TURSO_AUTH_TOKEN` (Turso Auth Token)
   - `ADMIN_PASSWORD` (gewünschtes Admin-Passwort)
4. Build: `next build` (Standard).
5. Nach dem ersten Deploy einmal Schema und Seed ausführen:
   - Schema: lokal `bun run db:push` mit Production-`TURSO_DATABASE_URL` und `TURSO_AUTH_TOKEN`.
   - Seed: einmal lokal mit denselben Turso-Env-Variablen `bun run db:seed`.

## Skripte

| Befehl        | Beschreibung                    |
|---------------|----------------------------------|
| `bun run dev` | Entwicklungsserver               |
| `bun run build` | Production-Build              |
| `bun run start` | Production-Server (nach build) |
| `bun run db:push` | Drizzle-Schema in DB anwenden |
| `bun run db:generate` | Drizzle-Migrationen erzeugen |
| `bun run db:seed` | Ein Event + Slots anlegen     |

## Datenmodell

- **Event:** `id`, `name`, `location`, `status` (`running` \| `pause_umbau`), `current_slot_id`
- **ScheduleSlot:** `id`, `event_id`, `club_name`, `planned_start`, `order_index`, `actual_start` (wird beim Klick „Jetzt auf die Bühne“ gesetzt)
