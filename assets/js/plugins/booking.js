/* ==========================================================================
   CALENDAR / BOOKING HOOK (placeholder)
   Use this for pharmacist consultation slots or a call-back request.
   ========================================================================== */
const BookingConfig = {
  // TODO: Paste your Calendly, Cal.com or Google Calendar appointment link.
  bookingUrl: "",
};

/** Points the "Book a call-back" button at the booking link, or hides it if none is set. */
function setupBooking() {
  const button = document.getElementById("booking-link");
  if (!button) return;
  if (BookingConfig.bookingUrl) {
    button.href = BookingConfig.bookingUrl;
    button.target = "_blank";
    button.rel = "noopener";
  } else {
    button.closest("[data-booking]").hidden = true;
  }
}

document.addEventListener("DOMContentLoaded", setupBooking);
