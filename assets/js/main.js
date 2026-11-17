/* ==========================================================================
   PHARMACY TEMPLATE - MAIN JAVASCRIPT (ES6+)
   Modules (each is a small object with an init() method):
     Config      - one place for API keys and endpoints
     Storage     - safe localStorage helpers
     Theme       - light / dark mode with system preference detection
     Direction   - LTR / RTL toggle (also swaps the Bootstrap stylesheet)
     Header      - footer year and small header helpers
     SearchBar   - home page search that opens the Products page
     Products    - filtering, sorting, search, load more (cards are in products.html)
     ShoppingList- "Add to list" memory shared with the contact form
     Validation  - friendly client-side form validation
     Forms       - prescription enquiry form and newsletter form
     MapEmbed    - loads Google Maps when a URL is configured
     ComingSoon  - countdown timer
     Reveal      - gentle fade-in when sections scroll into view
   No console logging is used anywhere in this file.
   ========================================================================== */

/* ---------- CONFIG ---------- */
const Config = {
  // TODO: Contact form endpoint. Formspree: "https://formspree.io/f/YOUR_FORM_ID".
  // Netlify Forms: leave the form's action as the page URL and keep the data-netlify attribute.
  formEndpoint: "https://formspree.io/f/YOUR_FORM_ID",

  // TODO: Newsletter endpoint. Mailchimp "form action" URL or ConvertKit form URL.
  newsletterEndpoint: "https://YOUR-DOMAIN.us1.list-manage.com/subscribe/post?u=YOUR_U&id=YOUR_ID",

  // TODO: Google Maps "Embed a map" URL (the src value of the iframe). Leave empty to show the placeholder.
  mapEmbedUrl: "https://maps.google.com/maps?q=Chennai%2C%20Tamil%20Nadu&t=&z=14&ie=UTF8&iwloc=&output=embed",

  // Settings you normally do not need to change.
  productsPerPage: 8,
  skeletonDelayMs: 700,
  maxUploadMb: 5,
  allowedUploadTypes: ["image/jpeg", "image/png", "application/pdf"],
};

/* ---------- STORAGE ---------- */
/** Safe wrappers: private browsing modes can block localStorage. */
const Storage = {
  get(key, fallback = null) {
    try {
      const value = window.localStorage.getItem(key);
      return value === null ? fallback : value;
    } catch (error) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* storage unavailable: the site still works, the choice is just not remembered */
    }
  },
  getJson(key, fallback) {
    try {
      return JSON.parse(Storage.get(key)) ?? fallback;
    } catch (error) {
      return fallback;
    }
  },
  setJson(key, value) {
    Storage.set(key, JSON.stringify(value));
  },
};

/* ---------- THEME (light / dark) ---------- */
const Theme = {
  key: "pharmacy-theme",

  /** Returns "light" or "dark": saved choice first, then the system preference. */
  preferred() {
    const saved = Storage.get(Theme.key);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  },

  /** Applies the theme to the page and updates every toggle button. */
  apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      const isDark = theme === "dark";
      button.setAttribute("aria-pressed", String(isDark));
      button.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      const icon = button.querySelector("i");
      if (icon) icon.className = isDark ? "bi bi-sun-fill" : "bi bi-moon-stars-fill";
      const text = button.querySelector("[data-theme-label]");
      if (text) text.textContent = isDark ? "Light" : "Dark";
    });
  },

  init() {
    Theme.apply(Theme.preferred());
    document.querySelectorAll("[data-theme-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        Storage.set(Theme.key, next);
        Theme.apply(next);
      });
    });
    // Follow system changes only while the visitor has not chosen manually.
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (!Storage.get(Theme.key)) Theme.apply(Theme.preferred());
    });
  },
};

/* ---------- DIRECTION (LTR / RTL) ---------- */
const Direction = {
  key: "pharmacy-dir",

  /** Sets dir on <html> and swaps the Bootstrap stylesheet to its RTL build. */
  apply(dir) {
    document.documentElement.setAttribute("dir", dir);
    const bootstrapLink = document.getElementById("bootstrap-css");
    if (bootstrapLink) {
      const wanted = dir === "rtl" ? bootstrapLink.dataset.rtl : bootstrapLink.dataset.ltr;
      if (wanted && bootstrapLink.getAttribute("href") !== wanted) bootstrapLink.setAttribute("href", wanted);
    }
    document.querySelectorAll("[data-dir-toggle]").forEach((button) => {
      button.setAttribute("aria-pressed", String(dir === "rtl"));
      const text = button.querySelector("[data-dir-label]");
      if (text) text.textContent = dir === "rtl" ? "LTR" : "RTL";
    });
  },

  init() {
    Direction.apply(Storage.get(Direction.key, document.documentElement.getAttribute("dir") || "ltr"));
    document.querySelectorAll("[data-dir-toggle]").forEach((button) => {
      button.addEventListener("click", () => {
        const next = document.documentElement.getAttribute("dir") === "rtl" ? "ltr" : "rtl";
        Storage.set(Direction.key, next);
        Direction.apply(next);
      });
    });
  },
};

/* ---------- HEADER / FOOTER HELPERS ---------- */
const Header = {
  init() {
    document.querySelectorAll("[data-year]").forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  },
};

/* ---------- HOME SEARCH BAR ---------- */
const SearchBar = {
  /** Sends the visitor to the Products page with their search words. */
  init() {
    const form = document.getElementById("home-search");
    if (!form) return;
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const query = form.querySelector("input").value.trim();
      window.location.href = "products.html" + (query ? "?q=" + encodeURIComponent(query) : "");
    });
  },
};

/* ---------- SHOPPING LIST ("Add to list") ---------- */
const ShoppingList = {
  key: "pharmacy-list",
  items() {
    return Storage.getJson(ShoppingList.key, []);
  },
  has(id) {
    return ShoppingList.items().some((item) => item.id === id);
  },
  /** Adds or removes a product and refreshes the floating bar. */
  toggle(product) {
    const items = ShoppingList.items();
    const index = items.findIndex((item) => item.id === product.id);
    if (index >= 0) items.splice(index, 1);
    else items.push({ id: product.id, name: product.name });
    Storage.setJson(ShoppingList.key, items);
    ShoppingList.renderBar();
    return index < 0;
  },
  clear() {
    Storage.setJson(ShoppingList.key, []);
    ShoppingList.renderBar();
  },
  /** Updates the floating "Your list" bar on the Products page. */
  renderBar() {
    const bar = document.getElementById("list-bar");
    if (!bar) return;
    const count = ShoppingList.items().length;
    bar.classList.toggle("is-visible", count > 0);
    const label = bar.querySelector("[data-list-count]");
    if (label) label.textContent = count === 1 ? "1 item in your list" : count + " items in your list";
  },
  /** Fills the "Medicine name(s)" box on the contact form with the saved list. */
  prefillContact() {
    const field = document.getElementById("medicines");
    if (!field || field.value.trim()) return;
    const names = ShoppingList.items().map((item) => item.name);
    if (names.length) field.value = names.join(", ");
  },
  init() {
    ShoppingList.renderBar();
    ShoppingList.prefillContact();
  },
};

/* ---------- PRODUCTS ----------
   The product cards are written in pages/products.html.
   This module only filters, sorts, searches, shows "Load more" and handles "Add to list". */
const Products = {
  state: { cat: "all", query: "", sort: "featured", visible: Config.productsPerPage },
  cards: [],

  /** Shows or hides the cards that match the category and search words, in the chosen order. */
  render() {
    const { cat, query, sort } = Products.state;
    const grid = document.getElementById("product-grid");
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    let list = Products.cards.filter((card) => {
      if (cat !== "all" && card.dataset.cat !== cat) return false;
      const text = (card.dataset.name + " " + card.dataset.use).toLowerCase();
      return words.every((word) => text.includes(word));
    });
    const byOrder = (a, b) => Number(a.dataset.order) - Number(b.dataset.order);
    if (sort === "name-asc") list = [...list].sort((a, b) => a.dataset.name.localeCompare(b.dataset.name));
    else if (sort === "name-desc") list = [...list].sort((a, b) => b.dataset.name.localeCompare(a.dataset.name));
    else if (sort === "otc-first") list = [...list].sort((a, b) => (Number(a.dataset.rx === "true") - Number(b.dataset.rx === "true")) || byOrder(a, b));
    else list = [...list].sort(byOrder);

    // Re-order the cards that are already in the page, then hide the ones that do not match.
    Products.cards.forEach((card) => { card.hidden = true; });
    list.forEach((card, index) => {
      grid.appendChild(card);
      card.hidden = index >= Products.state.visible;
    });

    const shown = Math.min(list.length, Products.state.visible);
    const status = document.getElementById("result-status");
    if (status) status.textContent = list.length === 1 ? "Showing 1 product" : `Showing ${shown} of ${list.length} products`;
    const empty = document.getElementById("empty-state");
    if (empty) empty.hidden = list.length > 0;
    const more = document.getElementById("load-more");
    if (more) more.hidden = shown >= list.length;
    Products.syncButtons();
  },

  /** Updates each card button to match the saved list. */
  syncButtons() {
    Products.cards.forEach((card) => {
      const button = card.querySelector("[data-product-btn]");
      if (!button || card.dataset.rx === "true") return;
      const inList = ShoppingList.has(card.dataset.id);
      button.classList.toggle("btn-outline", inList);
      button.setAttribute("aria-pressed", String(inList));
      button.querySelector("[data-btn-label]").textContent = inList ? "Remove from list" : "Add to list";
      const icon = button.querySelector("i");
      if (icon) icon.className = "bi " + (inList ? "bi-check2" : "bi-plus-lg");
    });
  },

  /** Updates the selected tab and re-renders. */
  setCategory(cat) {
    Products.state.cat = cat;
    Products.state.visible = Config.productsPerPage;
    document.querySelectorAll(".filter-tab").forEach((tab) => {
      const selected = tab.dataset.cat === cat;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    Products.render();
  },

  initTabs() {
    const tabs = document.getElementById("filter-tabs");
    tabs.addEventListener("click", (event) => {
      const tab = event.target.closest(".filter-tab");
      if (tab) Products.setCategory(tab.dataset.cat);
    });
    // Arrow keys move between tabs (standard tab keyboard pattern).
    tabs.addEventListener("keydown", (event) => {
      const all = [...tabs.querySelectorAll(".filter-tab")];
      const current = all.indexOf(document.activeElement);
      if (current < 0) return;
      const rtl = document.documentElement.dir === "rtl";
      const forward = rtl ? "ArrowLeft" : "ArrowRight";
      const backward = rtl ? "ArrowRight" : "ArrowLeft";
      let next = null;
      if (event.key === forward) next = all[(current + 1) % all.length];
      if (event.key === backward) next = all[(current - 1 + all.length) % all.length];
      if (event.key === "Home") next = all[0];
      if (event.key === "End") next = all[all.length - 1];
      if (next) { event.preventDefault(); next.focus(); Products.setCategory(next.dataset.cat); }
    });
  },

  init() {
    const grid = document.getElementById("product-grid");
    if (!grid) return;
    Products.cards = [...grid.querySelectorAll("[data-product-card]")];
    const params = new URLSearchParams(window.location.search);
    const startCat = params.get("cat");
    const validCats = [...document.querySelectorAll(".filter-tab")].map((tab) => tab.dataset.cat);
    if (validCats.includes(startCat)) Products.state.cat = startCat;
    Products.state.query = params.get("q") || "";
    const searchBox = document.getElementById("product-search");
    searchBox.value = Products.state.query;

    Products.initTabs();
    Products.setCategory(Products.state.cat);

    searchBox.addEventListener("input", () => {
      Products.state.query = searchBox.value;
      Products.state.visible = Config.productsPerPage;
      Products.render();
    });
    document.getElementById("product-sort").addEventListener("change", (event) => {
      Products.state.sort = event.target.value;
      Products.render();
    });
    document.getElementById("load-more").addEventListener("click", () => {
      Products.state.visible += Config.productsPerPage;
      Products.render();
    });
    grid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-product-btn]");
      if (!button) return;
      const card = button.closest("[data-product-card]");
      const product = { id: card.dataset.id, name: card.dataset.name };
      if (card.dataset.rx === "true") {
        // Prescription medicines go to the enquiry form with the name filled in.
        if (!ShoppingList.has(product.id)) ShoppingList.toggle(product);
        window.location.href = "contact.html#enquiry";
        return;
      }
      ShoppingList.toggle(product);
      Products.syncButtons();
    });
    const clear = document.getElementById("list-clear");
    if (clear) clear.addEventListener("click", () => { ShoppingList.clear(); Products.syncButtons(); });
  },
};

/* ---------- VALIDATION ---------- */
const Validation = {
  /** Each rule returns an error message, or an empty string when the field is fine. */
  rules: {
    name: (value) => (value.trim().length < 2 ? "Please enter your full name." : ""),
    phone: (value) => (/^\d{10}$/.test(value.replace(/[\s-]/g, "")) ? "" : "Please enter a 10-digit phone number."),
    email: (value) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) ? "" : "Please enter a valid email, like name@example.com."),
    address: (value) => (value.trim().length < 10 ? "Please enter your full delivery address, including area and PIN code." : ""),
    consent: (checked) => (checked ? "" : "Please tick this box so we can contact you about your order."),
  },

  /** Checks the chosen file type and size. Returns a friendly message or "". */
  file(input) {
    const file = input.files && input.files[0];
    if (!file) return "";
    if (!Config.allowedUploadTypes.includes(file.type)) return "Please upload a JPG, PNG or PDF file.";
    if (file.size > Config.maxUploadMb * 1024 * 1024) return `This file is too large. Please choose one under ${Config.maxUploadMb} MB.`;
    return "";
  },

  /** Shows or clears the message under a field. */
  show(field, message) {
    const feedback = document.getElementById(field.id + "-error");
    field.classList.toggle("is-invalid", Boolean(message));
    field.classList.toggle("is-valid", !message && field.value !== "");
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (feedback) feedback.textContent = message;
  },

  /** Validates one field by its data-rule. Returns true when valid. */
  field(field) {
    const rule = field.dataset.rule;
    let message = "";
    if (rule === "consent") message = Validation.rules.consent(field.checked);
    else if (rule === "file") message = Validation.file(field);
    else if (rule === "medicine-or-file") {
      const upload = document.getElementById("prescription");
      const hasFile = upload && upload.files && upload.files.length > 0;
      message = field.value.trim() || hasFile ? "" : "Please type the medicine name(s) or upload your prescription.";
    } else if (Validation.rules[rule]) message = Validation.rules[rule](field.value);
    Validation.show(field, message);
    return !message;
  },

  /** Validates every field in a form, focuses the first error. */
  form(form) {
    const fields = [...form.querySelectorAll("[data-rule]")];
    const results = fields.map((field) => ({ field, valid: Validation.field(field) }));
    const firstBad = results.find((r) => !r.valid);
    if (firstBad) firstBad.field.focus();
    return !firstBad;
  },

  /** Live feedback: check a field when the visitor leaves it, and recheck while fixing it. */
  attach(form) {
    form.querySelectorAll("[data-rule]").forEach((field) => {
      field.addEventListener("blur", () => Validation.field(field));
      field.addEventListener("input", () => { if (field.classList.contains("is-invalid")) Validation.field(field); });
      field.addEventListener("change", () => Validation.field(field));
    });
  },
};

/* ---------- FORMS ---------- */
const Forms = {
  /** True while the endpoint is still the placeholder, so the demo does not send real requests. */
  isPlaceholder(url) {
    return !url || /YOUR_|YOUR-/.test(url);
  },

  /** Posts a form with fetch. Resolves true on success. */
  async send(form, url) {
    if (Forms.isPlaceholder(url)) {
      // TODO: remove this demo shortcut once a real endpoint is set in Config.
      await new Promise((resolve) => window.setTimeout(resolve, 600));
      return true;
    }
    const response = await fetch(url, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    return response.ok;
  },

  /** Prescription enquiry form on the contact page. */
  enquiry() {
    const form = document.getElementById("enquiry-form");
    if (!form) return;
    form.setAttribute("action", form.getAttribute("action") || Config.formEndpoint);
    Validation.attach(form);
    // Choosing a prescription file also clears the "medicine name or prescription" message.
    const upload = document.getElementById("prescription");
    const medicines = document.getElementById("medicines");
    upload.addEventListener("change", () => {
      if (medicines.classList.contains("is-invalid")) Validation.field(medicines);
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!Validation.form(form)) return;
      const button = form.querySelector("[type=submit]");
      const success = document.getElementById("form-success");
      const failure = document.getElementById("form-failure");
      button.disabled = true;
      button.querySelector("[data-btn-text]").textContent = "Sending...";
      failure.classList.remove("is-visible");
      try {
        const ok = await Forms.send(form, form.getAttribute("action"));
        if (!ok) throw new Error("send failed");
        form.reset();
        form.querySelectorAll(".is-valid, .is-invalid").forEach((f) => f.classList.remove("is-valid", "is-invalid"));
        ShoppingList.clear();
        success.classList.add("is-visible");
        success.focus();
      } catch (error) {
        failure.classList.add("is-visible");
        failure.focus();
      } finally {
        button.disabled = false;
        button.querySelector("[data-btn-text]").textContent = "Send enquiry";
      }
    });
  },

  /** Newsletter form(s) in the page footer and on the home page. */
  newsletter() {
    document.querySelectorAll("[data-newsletter]").forEach((form) => {
      const input = form.querySelector("input[type=email]");
      const note = form.parentElement.querySelector("[data-newsletter-note]");
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const message = Validation.rules.email(input.value);
        input.classList.toggle("is-invalid", Boolean(message));
        input.setAttribute("aria-invalid", message ? "true" : "false");
        if (message) { note.textContent = message; note.className = "form-text text-danger fw-bold"; input.focus(); return; }
        try {
          const ok = await Forms.send(form, form.getAttribute("action") || Config.newsletterEndpoint);
          if (!ok) throw new Error("send failed");
          note.textContent = "Thank you! You are signed up.";
          note.className = "form-text text-success fw-bold";
          form.reset();
        } catch (error) {
          note.textContent = "Sorry, we could not sign you up just now. Please try again later.";
          note.className = "form-text text-danger fw-bold";
        }
      });
    });
  },

  init() {
    Forms.enquiry();
    Forms.newsletter();
  },
};

/* ---------- MAP ---------- */
const MapEmbed = {
  /** Replaces the placeholder with a Google Map when Config.mapEmbedUrl is set. */
  init() {
    const box = document.getElementById("map");
    if (!box || !Config.mapEmbedUrl) return;
    box.innerHTML = `<iframe src="${Config.mapEmbedUrl}" title="Map showing our store location" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
  },
};

/* ---------- COMING SOON COUNTDOWN ---------- */
const ComingSoon = {
  /** Counts down to the date in data-launch (format YYYY-MM-DDTHH:MM:SS). */
  init() {
    const box = document.getElementById("countdown");
    if (!box) return;
    const target = new Date(box.dataset.launch).getTime();
    if (Number.isNaN(target)) { box.hidden = true; return; }
    const parts = { days: 86400000, hours: 3600000, minutes: 60000, seconds: 1000 };
    const tick = () => {
      let remaining = Math.max(0, target - Date.now());
      Object.entries(parts).forEach(([name, size]) => {
        const value = Math.floor(remaining / size);
        remaining -= value * size;
        const node = box.querySelector(`[data-unit="${name}"]`);
        if (node) node.textContent = String(value).padStart(2, "0");
      });
    };
    tick();
    window.setInterval(tick, 1000);
  },
};

/* ---------- SCROLL REVEAL ---------- */
const Reveal = {
  /** Fades in elements marked data-reveal. Skipped when the visitor prefers reduced motion. */
  init() {
    const items = document.querySelectorAll("[data-reveal]");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!items.length || reduce || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("js-reveal");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((item) => observer.observe(item));
  },
};

/* ---------- START ---------- */
Theme.init();
document.addEventListener("DOMContentLoaded", () => {
  Direction.init();
  Header.init();
  SearchBar.init();
  Products.init();
  ShoppingList.init();
  Forms.init();
  MapEmbed.init();
  ComingSoon.init();
  Reveal.init();
});
