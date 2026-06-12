# CLAUDE.md — Aurora Dental Clinic (Rebuild)

## Project goal & audience
A complete, faithful rebuild of **auroradental.clinic** as a modern, fast, accessible static website. Audience: prospective and existing dental patients (families) in Richmond, BC. Goal: preserve 100% of the source content while improving design, performance, SEO, accessibility, and conversion (Book Now / Call).

## Final sitemap
```
/                 Home
/staff/           Meet the Team (4 bios)
/services/        A Full Spectrum of Dental Services (10 categories)
/faq/             Frequently Asked Questions (10 Q&A)
/contact/         Contact + booking form + map
```
Supporting files: `sitemap.xml`, `robots.txt`, `vercel.json`, `/css/style.css`, `/js/main.js`, `/assets/images/*`.

## Per-route requirements
- **/ (Home):** sticky transparent→solid header; aurora hero (image + gradient + starfield + treeline) with staged entrance; trust band (40+ / 4 / 10+); welcome split (verbatim intro); 6-card services preview → `/services/`; approach split (gallery + CBCT/no-sedation note); CTA band; footer. Unique title/desc/OG + Dentist JSON-LD.
- **/staff/:** dark page-hero; "Your dentists" (Liu, Hsia full-width cards) + "Your hygiene team" (Imbat, Kang). Verbatim bios, real photos, role labels. Profile OG.
- **/services/:** dark page-hero; sticky in-page jump-nav (9 anchors); 10 verbatim service sections with icons; amalgam note styled as a flag; sub-grids for Periodontics & Cosmetic; front-desk CTA. MedicalBusiness/availableService JSON-LD.
- **/faq/:** dark page-hero; `<details>/<summary>` accordion, all 10 Q&A verbatim (lists preserved); FAQPage JSON-LD.
- **/contact/:** dark page-hero (verbatim intro); info card (address/phone/email/hours table w/ "today" highlight); booking form (#booking_form) with validation + mailto; Google Maps embed (#map); Get Directions. Dentist JSON-LD w/ geo + hours.

## Source → target content plan
One finished route per source page; every heading/paragraph/list/FAQ/CTA/policy/bio preserved verbatim (see `content-mapping.csv`). Rewrites limited to non-substantive connective copy on the homepage preview cards (full detail lives on `/services/`). No invented facts, claims, or statistics.

## URL & redirect plan
Paths unchanged → no redirects needed. `cleanUrls: true` + `trailingSlash: false` in `vercel.json`. Directory-style routes (`/staff/index.html`) keep original slugs for SEO parity.

## Design system
- **Identity:** aurora borealis — deep navy/indigo → purple → teal night sky, silhouetted pine treeline, starfield (from the real logo).
- **Palette:** `--night-900 #0e1430`, `--night-700 #1f2750`, `--indigo #3a3f78`, `--purple #6c5fb0`, `--lavender #b9aedd`, teal accent `--teal #1f8d82` / `--aurora-teal #2fa39a` / `--teal-300 #7fd1c8`. Clinical body neutrals: `--cream #f7f6fb`, `--ink #1d2240`, `--slate #4a5168`.
- **Type:** Cormorant Garamond (display/headings, echoes the logo serif) + Inter (body/UI), via Google Fonts.
- **Components:** sticky header (transparent over dark hero, solid-white on scroll), pill buttons (primary teal / ghost / outline), cards w/ lift hover, dark aurora page-heroes with treeline, info/form/team/service modules, aurora-gradient CTA bands, dark footer with real logo + starfield glow.
- **Radius/shadow:** 16px cards, soft layered shadows. Container 1180px.

## Motion system (implemented in css/style.css + js/main.js)
- **Reveals:** `[data-reveal]` fade-up (opacity 0→1, translateY 20→0), `[data-reveal-img]` image-reveal (opacity 0→1, scale 1.04→1), `[data-stagger]` children staggered 0.08–0.12s. IntersectionObserver (threshold 0.12) adds `.in`.
- **Duration/easing:** 0.6–0.9s, `cubic-bezier(0.22,1,0.36,1)`. Only transform/opacity animated.
- **Hero entrance order:** nav (CSS) → eyebrow → H1 → subtitle → CTA (staged `[data-enter]` 0.05–0.5s) → hero image scale 1.04→1 → readability gradient fade-in. JS adds `.hero.ready`.
- **Reduced motion:** `prefers-reduced-motion: reduce` forces all content visible (opacity 1, no transform), disables smooth scroll. JS also short-circuits to add `.in`/`.ready` immediately. **Fail-open:** all reveal classes only *hide* via CSS that is overridden when JS adds `.in`; if JS fails the IntersectionObserver path still falls back to revealing everything.
- **Mobile:** stagger base reduced; parallax avoided.

## Asset plan
All assets local under `/assets/images/` (kebab-case), referenced with relative/root-absolute paths. Originals downloaded from WP uploads (see `asset-manifest.csv`). Logo = `aurora-icon.png` (footer); favicons = `favicon-32.png` + `aurora-icon-180.png`. No hotlinking, no third-party stock.

## Functionality / integration plan
- Nav, BOOK NOW, `tel:`, `mailto:`, social, Google Maps embed + directions: preserved verbatim (`link-functionality-manifest.csv`).
- **Booking form:** client-side validation (required name + valid email) → builds `mailto:info@auroradental.clinic` with all fields → opens user's mail client (no credentials, works on static host). Same fields/required as original Contact Form 7.
- **Optional upgrade (documented, not active):** to post the form to the clinic inbox via AJAX, add a Vercel Serverless Function (`/api/contact`) calling an email API (Resend/SendGrid). Requires an `EMAIL_API_KEY` env var → this is the single **BLOCKED** item (no key available). The mailto path is the working default until then.

## Page-level SEO plan
Unique `<title>`, meta description, canonical, single H1, semantic headings, descriptive `alt`, Open Graph per page. JSON-LD: Dentist (home/contact, with geo + hours), MedicalBusiness availableService (services), FAQPage (faq). `sitemap.xml` (5 URLs) + `robots.txt` (allow all + sitemap).

## Accessibility & responsive requirements
Skip link; semantic landmarks (`header/main/footer/nav`); `aria-current` on active nav; labelled form fields + `aria-required` + inline errors; keyboard-operable accordion (native `<details>`); visible focus; AA contrast (white-on-aurora, ink-on-cream); `alt` on meaningful images, `aria-hidden` on decorative SVG; reduced-motion honored. Responsive breakpoints at 940 (nav→drawer), 860 (grids→1col), 560 (type/scale). Mobile menu = slide-in drawer with backdrop, Esc/close, body scroll lock.

## Technical architecture
Pure static HTML/CSS/vanilla JS — no build step (Node is not required). One shared stylesheet + one shared script. Chosen because all source behavior (nav, accordion, form-as-mailto, map embed, motion) is reproducible statically and external integrations are preserved by URL.

## GitHub / Vercel plan
- **GitHub:** repo name `auroradental-clinic`, branch `main`, **private** by default. `gh` CLI not present in this environment → exact push commands provided in the final summary / `qa-report.md`. `.gitignore` excludes `.DS_Store`, `node_modules/`, `.vercel/`, `.env*`, `dist/`, `build/`, `.cache/`, `.raw/`.
- **Vercel:** preset **Other** (static), no build command, output = repo root. `vercel.json` sets `cleanUrls`, security headers, and long-cache for `/assets/*`. Deploy a **preview** first; production only on explicit confirmation.

## Implementation checklist
- [x] Discover all URLs (crawl-manifest.csv)
- [x] Extract every BUILD page (source-content/*)
- [x] content / asset / link-functionality manifests
- [x] Download all assets
- [x] Build all 5 routes
- [x] Global header/footer/design/motion system
- [x] SEO (titles, meta, OG, JSON-LD, sitemap, robots)
- [x] Accessibility + responsive
- [x] Full-site QA (qa-report.md)
- [ ] GitHub push (commands provided; `gh` unavailable)
- [ ] Vercel preview deploy

## Full-site QA checklist
Route completeness · content completeness · links/functions · assets · desktop+mobile browser review · accessibility · SEO · placeholder scan · console errors. See `qa-report.md` (all PASS except the documented optional serverless-email upgrade).

## Known genuine blockers
1. **Serverless email submission** (optional) — needs an email-provider API key. Working `mailto:` fallback in place.
2. **GitHub push** — `gh` CLI not installed here; local repo prepared + commands provided.
