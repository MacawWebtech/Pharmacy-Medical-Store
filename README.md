# Pharmacy & Medical Store Website Template

A clean, calm, easy-to-read website template for a neighbourhood pharmacy. Built with HTML5, CSS3, ES6+ JavaScript and Bootstrap 5. No build step and no dashboard.

## What is included

- 7 pages: Home, Products, Home Delivery, Contact, About Us, 404, Coming Soon
- Light and dark mode (follows the visitor's system, remembers their choice)
- Right-to-left (RTL) support with a toggle button
- Product list with search, category tabs, sorting, skeleton loaders and "Load more"
- "Add to list" memory that pre-fills the prescription enquiry form
- Prescription enquiry form with friendly validation (Formspree / Netlify ready)
- Placeholders for Mailchimp / ConvertKit, Google Maps, Stripe / PayPal and a booking link
- SEO: unique titles and descriptions, Open Graph tags, JSON-LD, sitemap.xml, robots.txt
- Accessibility: skip link, visible focus, ARIA labels, keyboard-friendly tabs and menus

## Quick start

1. Unzip the folder.
2. Open `pages/index.html` in a browser, or upload the whole folder to any web host.
3. Follow `documentation/installation.md` and `documentation/customization.md`.

Search the whole project for `TODO` to find every place you need to edit (logo, colours, phone, address, API keys).

## Folder structure

```
pharmacy-template/
├── assets/
│   ├── css/            style.css, dark-mode.css, rtl.css
│   ├── js/             main.js, plugins/ (payments.js, booking.js)
│   ├── images/         placeholder images (PNG + WebP)
│   └── fonts/          (empty: fonts load from Google Fonts)
├── pages/              the 7 HTML pages
├── documentation/      guides, credits, changelog, support
├── sitemap.xml
├── robots.txt
└── README.md
```

## Important notes

- **Internet needed for libraries.** Bootstrap, Bootstrap Icons and Google Fonts load from CDNs. For offline or stricter privacy setups, download them and point the `<link>` and `<script>` tags at local copies (see `documentation/installation.md`).
- **Placeholders are not real.** Names, phone numbers, prices, licence numbers, testimonials and photos are examples. Replace them all before launch. Using a real licence number is a legal matter in most countries.
- **Medical content.** The sample product text is general and makes no cure claims. Keep it that way. Have your pharmacist review any text you add.
- **Forms are in demo mode** until you add real endpoints (see the customization guide). In demo mode the form shows a success message but sends nothing.

## Browser support

Current versions of Chrome, Firefox, Safari and Edge.

## Licence

Template code: use it for your own pharmacy or for client projects. See `documentation/credits.md` for third-party licences.
