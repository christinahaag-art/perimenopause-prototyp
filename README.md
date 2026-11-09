# Perino · Hi-Fi-Prototyp (Code)

Klickbarer Prototyp der Perino-App (React + Vite + TypeScript), Stand Hi Fi vom 9. November 2026.
Er bildet den Figma-Testflow „Perino Testflow 1“ nach: vom Eintrag zur Fachpraxis.
Der frühere Mid-Fi-Stand (Graustufen, mit Terminanfrage) liegt im Ordner `_alt-mid-fi/`.

## Starten

```bash
npm install
npm run dev
```

Dann <http://localhost:5173> öffnen. Auf dem Desktop erscheint die App im Handy-Rahmen mit einer Screen-Liste daneben, auf dem Handy im Vollbild.

## Veröffentlichen (Vercel)

```bash
npx vercel --prod
```

Beim ersten Mal fragt Vercel nach dem Login und ob das Projekt mit dem bestehenden Vercel-Projekt verknüpft werden soll.

## Routen

| Route | Screen |
| --- | --- |
| `/` | 00 Splash (springt nach 2 s weiter) |
| `/start` | 01 Start (leer bzw. „Heute eingetragen“) |
| `/eintragen` | 02 Symptom eintragen, mit Stärke-Sheet und Periode-Sheet |
| `/gespeichert` | 02c Gespeichert |
| `/muster` | 06 Dein Muster (Filter Alle, Schlafprobleme …) |
| `/fachpraxen` | 07 Fachpraxen-Liste |
| `/fachpraxis/:id` | 08 Profil mit Symptomtagebuch (z. B. `/fachpraxis/berger`) |

## Bilder

Fotos und das Startbild liegen in `public/img/`. Fehlt eine Datei, zeigt die App einen Ersatz (Initialen bzw. Illustration).

- `start.jpg` – Startbild (Figma: 01 Start)
- `arzt-berger.jpg`, `arzt-kaya.jpg`, `arzt-hoffmann.jpg`, `arzt-neumann.jpg` – Fotos der Ärztinnen
- `logo.svg`, `gespeichert.svg` – aus der Figma-Page „Design System“

## Struktur

- `src/styles.css` – Designsystem als CSS-Variablen (Farben, Typografie, Abstände, Radien) und Komponenten-Klassen
- `src/data.ts` – Beispieldaten: 30 Tage Einträge, Fachpraxen
- `src/state/AppState.tsx` – Eintrag, gespeicherter Eintrag, Periode, Overlays
- `src/components` – Icon, Tab Bar, Foto, Symptomtagebuch (A4), Bottom Sheets und Hinweis-Dialoge
- `src/screens` – die Screens
