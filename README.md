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
| `/privacy`, `/terms`, `/cookies` | Policy pages (Privacy Policy, Terms of Use, Cookies and Storage), linked from the footer; text in `src/components/pages/legal/` |
| `/resumes` | Your saved resumes |
| `/resumes/:id/edit/:panel` | Editor, `panel` is `templates`, `design`, `content`, `sections` or `check` |
| `/resumes/:id/templates` | Template gallery for changing an existing resume |
| `/resumes/:id/other-templates` | One resume shown in every template |
| `/resumes/:id/review` | Review and download |

A static host needs a fallback to `index.html` for unknown paths (Vite's dev and preview servers already do this).

## Design language

Modern, simple and green on white: soft rounded cards, a friendly sans-serif (Plus Jakarta Sans for headings, Figtree for text), generous spacing and one accent colour. Colour tokens, radii and shadows are in `src/index.css`.

## Features

- **Home banners**: the hero is a carousel of every image in `public/banners/` (named `1.webp`, `2.webp`, … and shown in that order; PNG, JPG, AVIF and SVG also work). Use WebP: a 1983×793 banner is about 100 KB as WebP against 1.5 MB as PNG. It changes every 10 seconds, pauses on hover or touch, and also moves by swipe, arrows, dots or keyboard. Add, remove or replace a file in the folder and the hero follows — nothing else to edit. Wide pictures of about 2.5:1 (e.g. 1983×793) fit best, with the text kept in the left half because phones show the left part larger; with no pictures the original hero shows.
- **100 templates**, each previewed with a different Indian sample resume (`src/personas/`).
- **Design before data**: palettes, accent/tone colours, 30 fonts + pairings, 7 icon sets, 16 heading styles, entry/skill/bullet styles, photo shape, A4/Letter — live on the right.
- **Try other templates**: in My resumes, the three-dot menu of a resume with your own content has "Try other templates". It opens a page (`/resumes/:id/other-templates`) where every design is filled with that resume's text and photo. Opening one saves a new resume there (the original stays untouched). Only the words and the photo move: each template keeps its own colours, fonts, layout and section order. The normal template gallery and the editor panel always show each template's sample person.
- **Text colours**: colour any kind of text (name, title, headings, body, dates, companies) from Design, or click a block in the preview and use its colour button to recolour just that part.
- **Links everywhere** (optional): LinkedIn, GitHub, portfolio, projects, companies, certificates — all clickable in the PDF.
- **Drag to adjust spacing/order** directly on the preview; stored per block and kept in the PDF.
- **Custom sections** (Declaration, Achievements, Internships, Publications…), rename/hide/reorder, column choice.
- **Phone preview**: the page fills almost the full screen width; pinch to zoom (up to 300%, sharp when you let go) or double-tap to zoom in and back to fit. The zoom bar is compact on phones.
- **Check panel**: strength score, ATS note, job-description keyword match, fit-to-one-page.
- Multiple resumes, undo/redo, autosave, JSON export/import, light/dark, mobile layout.
- Indic scripts and ₹ render via Noto/Anek fallback fonts.

## SEO

Everything search-related comes from one file, `src/seo/site.ts` (site address, each page's title and description, the FAQ, the JSON-LD). Change the address or any text there and everything below follows.

- **Per-page head**: `<title>`, description, robots, canonical address, Open Graph and Twitter tags and JSON-LD (`Organization`, `WebSite`, the page, `BreadcrumbList`; the home page adds `WebApplication` and `FAQPage`). The build writes them into the HTML of every page, and `useSeo` keeps them right when you move between pages in the app.
- **Pre-rendered pages**: `npm run build` writes `dist/templates/index.html`, `dist/made-for-india/index.html` and so on, each with its own head and a plain-HTML fallback (heading, text, links, the FAQ on the home page), so crawlers and link previews that do not run JavaScript still read the right content. It also writes `dist/404.html` (noindex).
- **Generated files**: `sitemap.xml` (pages plus the banner images found in `public/banners/`), `robots.txt` (blocks `/resumes`, which is private) and `llms.txt` (a plain-text guide for AI tools). The dev server serves the same three files.
- **FAQ**: `src/components/home/Faq.tsx` shows the questions from `FAQS` at the foot of the home page; the same list feeds the FAQPage JSON-LD and `llms.txt`.
- **Not indexed**: `/resumes`, the editor and unknown addresses (noindex, left out of the sitemap).
- **Images**: banners and the footer wordmark are WebP; every `<img>` has descriptive `alt`, `width` and `height`, and everything below the first screen is `loading="lazy"`. The social image is `public/og-image.jpg` (1200×630).
- **Hosting**: serve a path such as `/templates` from `templates/index.html` (most static hosts do this by default), and use `404.html` for unknown paths.

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
