# Kriti — resume studio

Design your resume first, watch a **real PDF** render live beside the form, then download it. No sign-up, no server — everything runs and is stored in your browser.

## Run it

Needs **Node 20.19+** (`.node-version` pins 22).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
npm run preview
npm run lint
```

## Flow

Home → **Templates** (100, filterable, preview modal) → **Editor** (Templates · Design · Content · Sections · Check) → **Review** (full preview, score, download).

## Routes

Every page has its own URL (react-router), so links can be bookmarked, shared and used with the browser's back button. Route paths live in `src/lib/routes.ts`.

| Path | Page |
| --- | --- |
| `/` | Home |
| `/templates` | Template gallery for a new resume (`?style=Classic&q=fresher`) |
| `/made-for-india` | Info page |
| `/resumes` | Your saved resumes |
| `/resumes/:id/edit/:panel` | Editor, `panel` is `templates`, `design`, `content`, `sections` or `check` |
| `/resumes/:id/templates` | Template gallery for changing an existing resume |
| `/resumes/:id/other-templates` | One resume shown in every template |
| `/resumes/:id/review` | Review and download |

A static host needs a fallback to `index.html` for unknown paths (Vite's dev and preview servers already do this).

## Design language

Modern, simple and green on white: soft rounded cards, a friendly sans-serif (Plus Jakarta Sans for headings, Figtree for text), generous spacing and one accent colour. Colour tokens, radii and shadows are in `src/index.css`.

## Features

- **100 templates**, each previewed with a different Indian sample resume (`src/personas/`).
- **Design before data**: palettes, accent/tone colours, 30 fonts + pairings, 7 icon sets, 16 heading styles, entry/skill/bullet styles, photo shape, A4/Letter — live on the right.
- **Try other templates**: in My resumes, the three-dot menu of a resume with your own content has "Try other templates". It opens a page (`/resumes/:id/other-templates`) where every design is filled with that resume's text and photo. Opening one saves a new resume there (the original stays untouched). Only the words and the photo move: each template keeps its own colours, fonts, layout and section order. The normal template gallery and the editor panel always show each template's sample person.
- **Text colours**: colour any kind of text (name, title, headings, body, dates, companies) from Design, or click a block in the preview and use its colour button to recolour just that part.
- **Links everywhere** (optional): LinkedIn, GitHub, portfolio, projects, companies, certificates — all clickable in the PDF.
- **Drag to adjust spacing/order** directly on the preview; stored per block and kept in the PDF.
- **Custom sections** (Declaration, Achievements, Internships, Publications…), rename/hide/reorder, column choice.
- **Check panel**: strength score, ATS note, job-description keyword match, fit-to-one-page.
- Multiple resumes, undo/redo, autosave, JSON export/import, light/dark, mobile layout.
- Indic scripts and ₹ render via Noto/Anek fallback fonts.

## Layout

```
src/pdf/        spec-driven template engine (specs.ts = templates 1-50, specsMore.ts = 51-100), worker render, pdf.js painting
src/personas/   100 Indian sample resumes
src/components/ home, templates, editor (panels/forms), review, stage (preview + drag overlay), ui
src/store.ts    zustand (multi-document, persisted)
scripts/gen-fonts.mjs   regenerates font tables from @fontsource packages
scripts/gen-india-map.mjs   rebuilds the India map data (src/components/pages/indiaMapData.ts) from a states GeoJSON
```

Adding a template: add a `make({...})` spec in `src/pdf/specsMore.ts` and a persona in `src/personas/`.
