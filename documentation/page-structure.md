# Page structure

Every page uses the same skeleton: skip link, emergency note, header and menu, `<main id="main">`, footer with medical disclaimer, sticky Call/WhatsApp bar (phones only), scripts.

| Page | File | Main sections |
| --- | --- | --- |
| Home | `pages/index.html` | Hero with two buttons and search bar, Health Essentials, How it works, Why choose us, Delivery strip, Testimonials, Newsletter, Final call to action |
| Products | `pages/products.html` | Prescription notice, search, sort, category tabs, product grid with skeleton loaders, Load more, "Your list" bar |
| Home Delivery | `pages/home-delivery.html` | Delivery details, helpline with tap-to-call, step-by-step ordering, payment options, FAQ accordion |
| Contact | `pages/contact.html` | Prescription enquiry form, store details, opening hours, social links, booking hook, map |
| About Us | `pages/about.html` | Store story, mission, pharmacist team, licence and registration |
| 404 | `pages/404.html` | Friendly message with links to Home, Products, Contact |
| Coming Soon | `pages/coming-soon.html` | Countdown, call and WhatsApp buttons |

## Files

- `assets/css/style.css`: tokens, components, layout, responsive rules (breakpoints at 640px, 1024px and 1280px)
- `assets/css/dark-mode.css`: dark theme colours
- `assets/css/rtl.css`: right-to-left fixes
- `assets/js/main.js`: Config, Storage, Theme, Direction, SearchBar, ShoppingList, Products, Validation, Forms, MapEmbed, ComingSoon
- `assets/js/plugins/`: payments.js, booking.js

## Reusable components

Buttons (`.btn`, `.btn-outline`, `.btn-light`), badges (`.badge-rx`, `.badge-otc`), cards (`.card-box`), alerts (`.alert-note` with `alert-info-note`, `alert-warn-note`, `alert-danger-note`, `alert-success-note`), forms (Bootstrap form classes with the template styling) and accordions (Bootstrap accordion with the template styling). All buttons share one style.
