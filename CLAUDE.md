# DiscoverK - 2026 UCI MTB World Series Korea Round Website

## Project Overview
2026 UCI MTB World Series 한국 라운드(평창 용평리조트) 공식 웹사이트.
교통(Transportation) 서비스 안내 및 견적 요청을 위한 정적 웹사이트.

**Service Provider:** GroundK
**Live URL:** https://www.discoverk.com

## Tech Stack
- **Framework:** None (Vanilla HTML/CSS/JS - Static Site)
- **CSS:** Modular architecture with CSS imports
- **JS:** Vanilla JS with IIFE pattern, no build tools
- **External Libraries:** Swiper.js v12 (CDN)
- **Font:** Pretendard Variable (Korean-optimized)
- **No Node.js, no package.json, no bundler**

## Directory Structure
```
discoverk/
├── index.html                    # Root redirect → /en/main.html
├── en/                           # English pages
│   ├── main.html                 # Homepage
│   └── transportation.html       # Transportation services
├── ko/                           # Korean pages
│   ├── main.html
│   └── transportation.html
├── css/
│   ├── style.css                 # Main entry (imports all below)
│   ├── font.css                  # @font-face declarations
│   ├── variable.css              # CSS custom properties
│   ├── reset.css                 # CSS reset
│   ├── common.css                # Header, footer, modal, form styles
│   ├── keyframes.css             # Animations
│   ├── main.css                  # Homepage-specific styles
│   └── sub.css                   # Subpage-specific styles
├── js/
│   ├── i18n.js                   # Internationalization module
│   ├── app.js                    # App init, waitForI18n utility
│   └── pages/
│       ├── common.js             # Modal, nav, form handlers
│       ├── main.js               # Homepage scripts
│       └── transportation.js     # Transportation page scripts
├── data/
│   └── vehicle-service.json      # Vehicle specs & services data
├── lang/
│   ├── en.json                   # English translations
│   └── ko.json                   # Korean translations
├── images/
│   ├── favicon/
│   ├── main/                     # Homepage images
│   ├── sub/                      # Subpage images (hero bg, icons)
│   ├── vehicle/                  # Vehicle model images
│   └── common/                   # Shared icons (close, etc.)
└── docs/                         # Project documentation
```

## Routing Pattern
- Language-based URL routing: `/en/*.html`, `/ko/*.html`
- Root `/` redirects to `/en/main.html`
- Internal links use `data-href` attribute, auto-prefixed with language via `i18n.localePath()`
- Example: `<a data-href="/transportation.html">` → `/en/transportation.html`

## Page Template Pattern
Each page follows this structure:
```html
<div id="wrap" class="{page-name}">  <!-- e.g., "main", "transportation" -->
  <header>...</header>
  <main>
    <div class="main-inner">
      <section class="sct-hero-sub">...</section>  <!-- Subpage hero -->
      <section class="sct-{content}">...</section>  <!-- Page content -->
      <section class="sct-contact-us">...</section> <!-- CTA button -->
    </div>
  </main>
  <footer>...</footer>
  <div class="modal" id="contact-us">...</div>      <!-- Contact modal -->
</div>
```

**Script loading order:**
1. `/js/i18n.js`
2. `/js/app.js`
3. `/js/pages/common.js`
4. Swiper CDN
5. `/js/pages/{page-name}.js`

## Key Conventions

### CSS
- **Units:** `vw`-based sizing (desktop: based on ~1920px viewport)
- **Responsive breakpoint:** `@media (max-aspect-ratio: 10/9)` for mobile
- **Color variables:** `--color-primary: #005195`, `--color-secondary: #FE0056`
- **Layout:** `.inner` class for max-width container with `padding: 0 16.67vw` (mobile: `0 4.44vw`)
- **Naming:** BEM-like with section prefix (e.g., `.sct-transport .tab-button`)

### JavaScript
- **Pattern:** IIFE `(function() { 'use strict'; ... })();`
- **Init:** Use `DOMContentLoaded` event or `window.app.waitForI18n(callback)`
- **Global exports:** Attach to `window` object (e.g., `window.openModal`)
- **Form handling:** Validation → disable button → fetch POST `/api/contact` → reset form

### Navigation
- Header nav items: Home, Transportation, (+ future pages), Accommodation (external link)
- Active page indicated by `li.active` class
- Language switcher in header (currently hidden with `display: none`)
- Mobile: hamburger menu with overlay

## API Endpoints
- `POST /api/contact` - Send contact/inquiry email
  - Body: `{ name, email, message, lang }`
  - Response: `{ success: boolean, message: string }`

## External Links
- Accommodation booking: `https://2026uciteam.mice.link/booking/PHBERZF`
- Gangwon tourism: `https://www.gangwon.to/en`
- UCI official: `https://www.ucimtbworldseries.com`
