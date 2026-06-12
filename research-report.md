# Research Report — Aurora Dental Clinic Rebuild

**Source site:** https://auroradental.clinic (WordPress)
**Business:** Aurora Dental Clinic — family dental practice, Richmond, BC, Canada
**Rebuild target:** Static HTML/CSS/JS, deployable on Vercel
**Date:** 2026-06-12

---

## 1. Source-site summary
Aurora Dental Clinic is a long-established (35–40 year) family dental practice in Richmond, BC, led by Dr. Lucy Liu. The practice emphasizes a non-invasive, preventative, education-first philosophy. The original site is a small 5-page WordPress site using Contact Form 7, Google Tag Manager, and a Google Maps embed. Brand identity centers on the **aurora borealis** (northern lights): the logo is a white serif "AURORA Dental Clinic" wordmark over a deep navy→purple→teal night sky with a silhouetted pine treeline and starfield.

## 2. Discovery methods used
- WordPress sitemap: `https://auroradental.clinic/wp-sitemap.xml` (the Yoast-style `/sitemap.xml` 404s; the WP-core `wp-sitemap.xml` is authoritative).
- `robots.txt` (confirmed WordPress; references `/sitemap.xml`).
- Main navigation + footer crawl.
- Per-page link & image extraction via raw HTML (Python `urllib`).
- DNS check (192.99.199.128) confirmed live.

## 3. Complete discovered URL inventory
| URL | Status | Classification | Target route |
|-----|--------|----------------|--------------|
| `/` | 200 | BUILD | `/index.html` |
| `/staff/` | 200 | BUILD | `/staff/index.html` |
| `/services/` | 200 | BUILD | `/services/index.html` |
| `/faq/` | 200 | BUILD | `/faq/index.html` |
| `/contact/` | 200 | BUILD | `/contact/index.html` |
| `/sitemap.xml` | 404 | TECHNICAL_NONCONTENT | — |
| `/wp-sitemap.xml` | 200 | TECHNICAL_NONCONTENT (discovery only) | — |
| `/wp-admin/` | — | TECHNICAL_NONCONTENT | — |
| Facebook, LinkedIn, Google Maps short-link | 200 | EXTERNAL | preserved in link manifest |

**Classification totals:** BUILD = 5 · REDIRECT_ALIAS = 0 · TECHNICAL_NONCONTENT = 3 · EXTERNAL = 3 (+ tel/mailto). No blog, archive, pagination, or hidden content pages exist — the site is genuinely 5 pages.

## 4. Classification explanation
Every content-bearing public page is BUILD. There are no duplicate/alias URLs (REDIRECT_ALIAS = 0). The WP sitemap and admin are non-content endpoints. Social/maps/phone/email are external destinations preserved verbatim.

## 5. Old-route → new-route table
URLs are preserved 1:1. No redirects are required (paths unchanged).
| Old | New |
|-----|-----|
| `/` | `/` |
| `/staff/` | `/staff/` |
| `/services/` | `/services/` |
| `/faq/` | `/faq/` |
| `/contact/` | `/contact/` |

`cleanUrls: true` in `vercel.json` makes `/staff` resolve to `/staff/index.html` (and `/staff/` continues to work).

## 6. Page-by-page content summary & migration status
- **Home** — H1 "Welcome to Aurora", 3 brand captions (40+ years; experienced dentists & denturists; implants & orthodontics), intro paragraph, BOOK NOW CTA, 4 images. ✅ Migrated verbatim.
- **Staff** — "Meet the Team": full verbatim bios for Dr. Lucy Liu (DMD, RD), Dr. James Hsia (BSc., DMD), Kyla Imbat (RDH), Avneet Kang (RDH), each with photo. ✅ Migrated verbatim.
- **Services** — "A Full Spectrum of Dental Services": 10 categories (Restorative incl. no-amalgam note, Endodontics incl. CBCT/root-canal steps, Periodontics + 4 sub-treatments, Oral Surgery, Implants, Dentures, Prosthodontics, Orthodontics/ClearCorrect, Cosmetic: Injections + Whitening), plus no-sedation note and front-desk CTA. ✅ Migrated verbatim.
- **FAQ** — 10 Q&A (direct billing, first visit, new patient form, accessibility, on-site surgery, sedation, payment plans, cost, finding office, treatment plan). ✅ Migrated verbatim; accordion preserved.
- **Contact** — intro, address/phone/email, full hours, Google Maps embed, Contact Form 7 (4 fields). ✅ Migrated verbatim.

## 7. Services / products / treatments
Restorative (composite, no amalgam); Endodontics (root canal, pulp capping, CBCT); Periodontics (periodontitis tx, periodontal surgery, gingivoplasty, bone grafting); Oral surgery (incl. wisdom teeth, local anesthetic only); Implants & implant-supported dentures; Dentures; Prosthodontics (crowns, implants, dentures, veneers); Orthodontics (ClearCorrect + braces); Cosmetic (therapeutic botulinum injections; in-office & take-home whitening). **No sedation dentistry.**

## 8. Team / providers
- **Dr. Lucy (Zhenzi) Liu, DMD, RD** — dentist & denturist; Shandong University (Bachelor's/Master's, Periodontics, 8 yrs); DMD Heidelberg 2006; UBC postdoc; CDI College instructor 2017–2022; Maxi Course Senior Continuum Alum since 2018; at Aurora since 2017.
- **Dr. James Hsia, BSc., DMD** — general dentistry since 1981; UBC BSc Biochemistry + DMD; TMJ, facial asymmetry, orthodontics; preventative focus.
- **Kyla Imbat, RDH** — Dental Hygiene Diploma, Vancouver Community College.
- **Avneet Kang, RDH** — Sport Science diploma (Douglas College 2018), Vancouver College of Dental Hygiene 2020, pursuing UBC Bachelor's of Dental Hygiene.

## 9. Policies, FAQs, instructions, locations, contact
- **Address:** Unit 220, 10151 No. 3 Rd, Richmond, BC V7A 4R6 (Richlea Square, above Tisol Pet Foods).
- **Phone:** (604) 271-6733 · **Patient email:** info@auroradental.clinic · **Tech support:** webmaster@auroradental.clinic
- **Hours:** Mon Closed · Tue–Fri 10am–6pm · Sat 9am–4pm · Sun Closed.
- **Policies:** no direct insurance billing; case-by-case payment plans; surgical consult + radiographs required before surgery; not wheelchair accessible (2nd floor, no elevator); no sedation dentistry.

## 10. Forms, widgets, downloads, external destinations
- **Booking/contact form** (Contact Form 7) → fields: Full name (req), Phone, Email (req), Reason for Appointment. Rebuilt with client-side validation + `mailto:` handoff to info@auroradental.clinic.
- **Google Maps embed** (place: Aurora Dental Clinic) — preserved.
- **External:** Facebook (`/AuroraDentalinRichmond`), LinkedIn (Dr. Liu), Google Maps short-link (`g.co/kgs/xWzbcXG`), `tel:6042716733`, `mailto:` (info + webmaster).
- No downloadable documents found on the source site (new patient form is sent privately by text/email — not publicly hosted).

## 11. Asset inventory & usage
13 assets downloaded (see `asset-manifest.csv`): 4 home images, 4 staff photos, 1 office exterior, full logo + 3 icon sizes. All meaningful images used; logo used in footer; icons as favicon/apple-touch. No stock imagery introduced. Decorative UI icons are clean inline SVG.

## 12. SEO observations
Original used per-page `<title>`, meta descriptions, Open Graph tags, and Yoast-style metadata. Rebuild reproduces unique titles/descriptions/canonicals/OG per page and **adds** JSON-LD structured data (Dentist, MedicalBusiness/availableService, FAQPage), a clean `sitemap.xml`, and `robots.txt`.

## 13. Blockers / source conflicts
- **Email conflict (resolved by context):** footer support email is `webmaster@auroradental.clinic`; patient-facing contact email is `info@auroradental.clinic`. Both preserved in their original roles — not a true conflict.
- **"35 years" vs "40+ years":** the source uses both ("over 35 years" in body copy; "40+ Years" / "nearly four decades" in headings/captions). Both preserved verbatim where they appear; no fabricated figure introduced.
- **Form backend:** the WP/Contact-Form-7 server email cannot run on a static host. Preserved via a no-credential `mailto:` handoff (working). An optional serverless+email-API upgrade is documented in CLAUDE.md and is the only BLOCKED item (needs an email-provider API key).
- **GitHub CLI** (`gh`) not installed in this environment → push prepared with exact commands rather than executed.
