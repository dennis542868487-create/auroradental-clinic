# Source Extraction — Contact

- **Source URL:** https://auroradental.clinic/contact/
- **Target route:** /contact/index.html
- **Page title:** How to Contact Aurora Dental – Aurora Dental
- **H1:** How to Contact Aurora Dental
- **OG image:** office_front-1.jpg → office-front.jpg

**Intro (verbatim):**
> Dr. Liu and her team are passionate about community dentistry. We strive to help patients achieve optimal health through oral health education and preventative care. We have served the Richmond community for nearly four decades, and love watching families grow up in our care. We look forward to meeting you and your family.

## Location and Hours (H2)
- **Address:** Unit 220, 10151 No. 3 Rd, Richmond, BC V7A 4R6
- **Phone:** (604) 271-6733  → tel:6042716733
- **Email:** info@auroradental.clinic → mailto:info@auroradental.clinic

**Business hours (verbatim):**
| Day | Hours |
|-----|-------|
| Monday | Closed |
| Tuesday | 10 – 6 |
| Wednesday | 10 – 6 |
| Thursday | 10 – 6 |
| Friday | 10 – 6 |
| Saturday | 9 – 4 |
| Sunday | Closed |

## Map
- Google Maps embed (place: Aurora Dental Clinic), coords lat 49.1388608, lng -123.1402336
- Embed src: `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2610.368014169882!2d-123.14023362304837!3d49.13886088092738!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5485e0202371f5c5%3A0xd638c6519ed12907!2sAurora%20Dental%20Clinic!5e0!3m2!1sen!2sca!4v1727894938955!5m2!1sen!2sca`
- Directions link: https://g.co/kgs/xWzbcXG

## Booking / Contact form (anchor #booking_form)
Original: WordPress Contact Form 7 (`wpcf7-f91`), POST to WP backend (emails the clinic).
Fields:
| Field | Type | Required |
|-------|------|----------|
| Full name | text (your-name) | Yes |
| Phone number | tel (tel-598) | No |
| Email address | email (your-email) | Yes |
| Reason for Appointment | textarea (your-message) | No |
| Submit button | submit | — |

**Rebuild note:** Static host has no WP/PHP backend. Submission behavior (email to clinic) is preserved via a no-credential `mailto:` handoff that opens the user's mail client pre-addressed to info@auroradental.clinic with all field values filled. Client-side validation enforces the same required fields. A serverless upgrade path (Vercel function + email API) is documented in CLAUDE.md as optional; it requires an email-provider API key (not available → that AJAX variant is the only BLOCKED item).
