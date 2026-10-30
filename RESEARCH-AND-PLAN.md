# Wayne's Plant Hire World: research findings and rebuild plan

30 October 2026

## 1. What the research says

**Award-level industrial sites (Awwwards SOTD and nominees: Akson, CRYOX, Rogers-O'Brien, Mammoet)**
- They are restrained. They use one or two grounds (often light), one strong accent and very large type. The material carries the page: the ground, the machine, the work.
- They have a single idea, not a stack of sections. Akson's is one sentence ("infrastructure starts below ground level") carried by vertical transitions. Mammoet's is the challenge, shown in heavy-lift photos with one red accent.
- Their numbers are woven into sentences, not dropped into "10+ / 50+ / 24/7" stat tiles.

**Best-in-class plant hire UX (Charles Wilson / CW Plant Hire, TCS Plant Hire, Martello)**
- The fleet is the product, so they browse it like a catalogue: filter by type, sort, and compare specs at a glance.
- Every machine has a clear quote path. The visitor is a contractor on a phone between sites, so phone and WhatsApp are always one thumb away.
- Real machine and yard photos beat stock. What they do differently is present those photos consistently: one grade, fixed crops, generous size.

**Sources:** [Awwwards: Akson](https://awwwards.com/sites/akson) · [Awwwards: CRYOX](https://www.awwwards.com/sites/cryox) · [Awwwards architecture SOTD](https://www.awwwards.com/websites/architecture/?award=sites_of_the_day) · [r-o.com](https://r-o.com) · [mammoet.com](https://www.mammoet.com) · [Atomic Media: Charles Wilson](https://atomicmedia.co.uk/work/charles-wilson-elevated-design) · [Majestic Media: TCS Plant Hire](https://www.majesticmedia.co.uk/?p=4097) · [Barkweb: Martello](https://barkweb.co.uk/portfolio/martello)

## 2. Why the current build falls short

| Problem | Effect |
|---|---|
| Every section on the same dark navy | No rhythm. It reads as a dark SaaS template, and the yellow machines look muddy under a navy scrim |
| Boxed navy cards with full-width blue buttons | Generic. Uneven card heights leave holes in the featured grid |
| "10+ / 50+ / 24/7" stat slab in amber | The most common cliché in the category |
| Photos framed as stock tiles | Wayne's phone photos look amateur when shown small and inconsistent |
| No idea of its own | Swap the logo and it could be any hire company |
| Seven headline sizes, all equally loud | Nothing leads |

## 3. The idea

**The site is Wayne's fleet register.** Plant hire yards run on a register: every machine has a fleet number stencilled on it, plus a spec plate. On this site:

- Every machine gets a fleet number (WPH-01 to WPH-19) and a spec-sheet page.
- The equipment page is the register itself: one big numbered list. Hovering a row on desktop brings up the machine's photo. On mobile it shows as a photo list, and a grid view is available.
- The hire list (the quote cart) is the "job card" you hand to the yard.
- **Live thing:** "Yard status" works out in South African time whether the yard is open now and when it closes or opens next. A delivery distance picker shows how far your town is from 46 Steyr Street.

Competitor test: another hire company could copy the format, but not the content. The numbers, operators (Dawid, Tsebo, Norman…), yard address and towns belong to Wayne's.

## 4. Art direction

- **Grounds:** Frost (#EEF3FB) leads, so the yellow machines and blue skies sit on light. Deep Navy (#020817) is used in full-width bands for rhythm (statement, how it works, footer). Never more than two dark sections in a row.
- **Ink and accents:** Navy ink on Frost. Brand Blue (#3083E8) is used only for actions. Amber (#F59E0B) appears only on navy, for fleet numbers and live status. This follows the brand guide.
- **Type:** Barlow Condensed 800 for display at three sizes only (display, section, item). DM Sans for body at 18/16/14. Tabular numerals for specs.
- **Photos:** One CSS grade for all of them (slight contrast lift, cooler shadows), fixed aspect crops, large. Each photo gets a stencil-style caption: fleet number, machine and place.
- **Components:** No boxed cards on the light ground. Photo plus text, separated by space. Square blue buttons with navy text, and arrow links for secondary actions.
- **Motion (GSAP + Lenis):** The hero photo opens from inset to full width on scroll. Headings rise word by word. Register rows reveal in sequence, and the photo follows the cursor. Spec numbers count up. There is a slow scale on the hero photo, plus a reduced-motion fallback.

## 5. Site map

| Page | Contents |
|---|---|
| Home | Hero (headline, lead, CTA, yard status, D85A-on-lowbed photo that opens on scroll) → statement band with the facts in a sentence → register preview (first 6 rows) → What we move (4 type panels) → How hire works (yard → lowbed → your site + distance picker) → Why Wayne's (5 numbered reasons + sticky photo) → From the yard (photo mosaic) → FAQ → CTA → footer |
| Equipment | Register: filter, search, sort, list/grid toggle, 19 machines |
| Machine ×19 | Spec sheet: big photo, fleet number, specs, operator, add to hire list, WhatsApp, next and previous machine, related |
| Quote | Job card: pick machines, date, site, details → WhatsApp or email |
| About | Story, figures in sentences, reasons, mosaic |
| Contact | Large phone numbers, hours with live status, address, map, form |
| Privacy, 404 | Plain |

## 6. To confirm with the client
- 50+ machines are claimed, but 19 are listed.
- Email domain: waynesplanthireworld.co.za or waynesplanthire.co.za.
- The fleet numbers are a design device. Wayne may want to use his real ones.
- Delivery distances are approximate road km and need checking.
- FAQ wording.
- Re-enable tracking (GTM, GA4, Ads, Meta Pixel, Clarity) at launch.
