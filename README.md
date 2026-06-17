# Autopark Langen

Moderne Vite, React und TypeScript Webseite für Autopark Langen.

## Stack

React, TypeScript, Vite, CSS, lucide-react, Vitest.

## Lokale Installation

```bash
npm install
npm run dev
```

Build und Checks:

```bash
npm run lint
npm run test
npm run build
npm run preview
```

## Inhalte

Übernommen wurden die bekannten Pflichtdaten von der alten Webseite:

Name, Claim, Adresse, Telefon, E-Mail, Öffnungszeiten, Leistungen, Impressumsdaten, USt-ID und rechtliche Basisinhalte. Die Datenschutzseite wurde an die neue technische Umsetzung angepasst. Es werden keine Analytics Tools und keine unnötigen Tracking Skripte eingebaut.

## Fahrzeugbestand

Die Webseite nutzt `src/data/inventory.json` als lokale Datenquelle. Dadurch lädt die Website nicht clientseitig per Scraping von mobile.de.

Update Versuch:

```bash
npm run inventory:update
```

Das Script `scripts/updateInventory.ts` versucht, den öffentlichen Händlerbestand von `https://home.mobile.de/AUTOPARKLANGEN` zu lesen und in `src/data/inventory.json` zu schreiben.

Wichtig: mobile.de kann serverseitige Zugriffe blockieren. Wenn das passiert, überschreibt das Script die vorhandene JSON Datei nicht und gibt eine klare Fehlermeldung aus. Dann muss der Bestand per Export oder manuell gepflegter JSON aktualisiert werden. Im UI wird deshalb keine harte Gesamtzahl behauptet, sondern „Aktuelle Auswahl aus unserem Fahrzeugbestand“ plus ein prominenter Link zum vollständigen mobile.de Bestand angezeigt.

## Assets

Das Logo liegt unter `public/logo.png`. Standort und Galerie Bilder liegen unter `public/images`.

Fahrzeugbilder in `src/data/inventory.json` können über die mobile.de Bildinfrastruktur geladen werden. Das ist in der Datenschutzseite erwähnt.

## Vercel Deployment

Projektname: `autoparklangen`

Es sind keine Environment Variablen nötig.

Empfohlene Schritte:

```bash
npm run lint
npm run test
npm run build
vercel --prod
```

`vercel.json` enthält ein SPA Rewrite, damit `/kontakt`, `/impressum` und `/datenschutz` direkt erreichbar sind.

## SEO

Enthalten sind Meta Title, Meta Description, OpenGraph Daten, Canonical URL, `robots.txt`, `sitemap.xml` und JSON-LD für `AutoDealer` mit Adresse, Kontakt und Öffnungszeiten. Es werden keine erfundenen Bewertungen oder Sterne angezeigt.
