/* ==========================================================================
   PAYMENT BUTTON PLACEHOLDERS (Stripe / PayPal)
   Until real keys are added, the buttons show a friendly "coming soon" note
   instead of starting a payment.
   ========================================================================== */
const PaymentConfig = {
  // TODO: Add your Stripe Payment Link (create one in the Stripe dashboard). Example: "https://buy.stripe.com/xxxx"
  stripePaymentLink: "",
  // TODO: Add your PayPal.Me link. Example: "https://www.paypal.me/yourstore"
  paypalLink: "",
};

/** Opens the real payment link, or shows the note when no link is set yet. */
function handlePayment(provider) {
  const link = provider === "stripe" ? PaymentConfig.stripePaymentLink : PaymentConfig.paypalLink;
  const note = document.getElementById("payment-note");
  if (link) {
    window.open(link, "_blank", "noopener");
    return;
  }
  if (note) {
    note.textContent = "Online payment is not switched on yet. Please choose Cash on Delivery, or call us to pay by phone.";
    note.hidden = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-pay]").forEach((button) => {
    button.addEventListener("click", () => handlePayment(button.dataset.pay));
  });
});
