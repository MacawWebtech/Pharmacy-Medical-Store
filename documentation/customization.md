# Customization guide

## Colours

Open `assets/css/style.css` and edit the variables at the top (`:root`):

```
--color-primary, --color-secondary, --color-accent,
--color-success, --color-warning, --color-danger,
--color-text, --color-bg
```

Dark mode colours live in `assets/css/dark-mode.css` under `[data-theme="dark"]`. Keep text and background contrast at 4.5:1 or higher (WCAG AA). Free checker: https://webaim.org/resources/contrastchecker/

## Fonts

The template uses two Google Fonts: **Plus Jakarta Sans** (headings) and **Inter** (body).

1. Pick new fonts at https://fonts.google.com/ (maximum two).
2. Replace the Google Fonts `<link>` in the `<head>` of every page.
3. Change `--font-heading` and `--font-body` in `style.css`.

## Spacing

All spacing uses an 8px scale: `--space-1` (8px) to `--space-10` (80px). Use these variables for new styles.

## Content

- **Products:** edit the `Products.data` list near the top of the Products module in `assets/js/main.js`. Set `rx: true` for prescription medicines. Keep descriptions plain and make no cure claims.
- **Prices:** the placeholder `XX.XX` is in the card template in `main.js`. Replace it with `product.price`, and add a `price` value to each product.
- **Product images:** save `product-<id>.png` and `product-<id>.webp` in `assets/images/`.
- **Categories:** edit `Products.categories` in `main.js`.
- **Delivery details:** edit the table in `home-delivery.html` and the strip on the home page.
- **FAQs:** edit the accordion in `home-delivery.html`.
- **Testimonials:** replace with real reviews you have permission to use.

## Images

Placeholder images are simple illustrations. Replace them with your own photos.

- Keep the same file names, or update the HTML.
- Save a WebP copy next to each PNG or JPG. Pages use `<picture>` so browsers pick WebP automatically.
- Keep the `width` and `height` attributes. They prevent layout jumps (good for CLS).
- Always write meaningful `alt` text.

## Forms

**Formspree**
1. Create a form at https://formspree.io and copy its URL.
2. Set it in `assets/js/main.js` (`Config.formEndpoint`) and in the `action` of `#enquiry-form` in `contact.html`.
3. File uploads on Formspree need a paid plan. On a free plan, ask visitors to send prescriptions by WhatsApp or email.

**Netlify Forms**
1. Keep `data-netlify="true"` and the hidden `form-name` field.
2. Set the form `action` to the contact page path (for example `/pages/contact.html`).
3. Deploy to Netlify. The form appears in the Netlify dashboard.

Until a real endpoint is set, the form runs in demo mode and shows a success message without sending anything.

## Newsletter

Paste your Mailchimp or ConvertKit form URL into the `action` of the newsletter form (and `Config.newsletterEndpoint` in `main.js`).

## Google Maps

In Google Maps choose Share, then Embed a map, and copy the `src` link from the iframe code. Paste it into `Config.mapEmbedUrl` in `main.js`.

## Payments (Stripe / PayPal)

Add your Stripe Payment Link and PayPal.Me link in `assets/js/plugins/payments.js`. Until then, the buttons show a friendly note. Never put secret API keys in these files; only public links belong here.

## Booking link

Add a Calendly, Cal.com or Google Calendar link in `assets/js/plugins/booking.js`. With no link, the booking button stays hidden.

## Right-to-left (RTL)

The RTL button in the header switches `dir="rtl"`, swaps in Bootstrap's RTL stylesheet and applies `assets/css/rtl.css`. To publish a fully Arabic or Hebrew site, translate the text, set `lang="ar"` (or `he`) on `<html>`, and add a suitable font in `rtl.css`.

## Coming soon / maintenance page

Edit the launch date in `data-launch` on `coming-soon.html`. For maintenance, delete the countdown block and change the text.
