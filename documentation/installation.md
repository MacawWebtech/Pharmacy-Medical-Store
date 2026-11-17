# Installation guide

## 1. Preview on your computer

Open `pages/index.html` by double-clicking it. Everything works from a local file except that fonts, Bootstrap and icons need an internet connection.

For a more realistic preview, run a tiny local server from the template folder:

```
python3 -m http.server 8000
```

Then open http://localhost:8000/pages/index.html.

## 2. Upload to a web host

Upload the whole `pharmacy-template` folder. Keep the folder layout the same, because pages refer to `../assets/`.

Tip: make `pages/index.html` your home page. Most hosts let you set a redirect from `/` to `/pages/index.html`. Alternatively, move the files in `pages/` up one level and change `../assets/` to `assets/` in each file.

On Netlify, add a `_redirects` file with:

```
/    /pages/index.html    200
/*   /pages/404.html      404
```

## 3. Replace placeholders

Search the project for `TODO`. The main ones are:

| What | Where |
| --- | --- |
| Store name and logo | Header of every page, `assets/images/logo.svg`, `favicon.svg` |
| Phone, WhatsApp, email, address | Header, footer, contact page, JSON-LD in `<head>` |
| Opening hours | Footer, contact page, JSON-LD |
| Licence numbers | Footer, About page |
| Domain name | Canonical and Open Graph tags, `sitemap.xml`, `robots.txt` |

## 4. Use local copies of Bootstrap, icons and fonts (optional)

1. Download Bootstrap 5.3 (CSS and JS), Bootstrap Icons 1.11 and your two Google Fonts.
2. Put them in `assets/` (fonts go in `assets/fonts/`).
3. Change the `<link>` and `<script>` tags in each page. For RTL, keep the `data-ltr` and `data-rtl` attributes on `#bootstrap-css` pointing at the normal and RTL Bootstrap files.

## 5. Check before launch

- Replace all sample text, prices, reviews and images.
- Set your form endpoint (see customization guide) and send a test enquiry.
- Test on a phone, in dark mode and in RTL mode.
- Run the pages through https://validator.w3.org/ and Google PageSpeed Insights.
