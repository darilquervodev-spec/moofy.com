/* ==========================================================================
   Nova — Universal App Website Template
   Vanilla JS only. Every block below is defensive (checks elements exist)
   so this single file can be shared unchanged across all five pages.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initActiveNavLink();
  initFaqAccordion();
  initScrollReveal();
  initContactForm();
  initDeleteAccountForm();
  initCopyButtons();
  initYear();
});

/* ---- Mobile nav toggle ---------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after tapping a link (mobile UX nicety)
  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---- Highlight the current page in the nav -------------------------------- */
function initActiveNavLink() {
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });
}

/* ---- FAQ accordion ---------------------------------------------------------- */
function initFaqAccordion() {
  const items = document.querySelectorAll(".faq-item");
  if (!items.length) return;

  items.forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    if (!question || !answer) return;

    question.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close every other item so only one is expanded at a time
      items.forEach((other) => {
        other.classList.remove("open");
        const otherAnswer = other.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = "";
        other.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });

      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
        question.setAttribute("aria-expanded", "true");
      }
    });
  });
}

/* ---- Reveal-on-scroll (progressive enhancement — content is visible without JS) */
function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  if (!("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ---- Support page contact form ---------------------------------------------
   No backend is wired up. This validates the fields client-side and shows a
   confirmation message. To actually receive messages, either:
     (a) point the <form action> at a form-backend service (Formspree,
         Getform, Basin, etc.) and remove preventDefault() below, or
     (b) swap the submit handler for a fetch() call to your own endpoint.
------------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector("#contact-form-el");
  const status = document.querySelector("#contact-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    // Placeholder "submission" — replace with a real backend call.
    status.textContent =
      "Thanks — your message has been prepared. Since this template has no backend wired up yet, " +
      "connect the form to an email service (see the comment in main.js) so messages actually arrive.";
    status.classList.add("visible");
    form.reset();
  });
}

/* ---- Delete-account request form -------------------------------------------- */
function initDeleteAccountForm() {
  const form = document.querySelector("#delete-form");
  const status = document.querySelector("#delete-status");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    status.textContent =
      "Your deletion request has been prepared. Connect this form to a real backend or email service " +
      "so requests are actually delivered and processed within your stated timeframe.";
    status.classList.add("visible");
    form.reset();
  });
}

/* ---- Copy-to-clipboard buttons (used by the email template on delete-account) */
function initCopyButtons() {
  document.querySelectorAll("[data-copy-target]").forEach((button) => {
    button.addEventListener("click", async () => {
      const target = document.querySelector(button.getAttribute("data-copy-target"));
      if (!target) return;

      const text = target.innerText;
      try {
        await navigator.clipboard.writeText(text);
      } catch (err) {
        // Clipboard API can fail (permissions, insecure context) — fall back silently.
        console.warn("Copy failed:", err);
        return;
      }

      const originalLabel = button.textContent;
      button.textContent = "Copied!";
      button.classList.add("copied");
      setTimeout(() => {
        button.textContent = originalLabel;
        button.classList.remove("copied");
      }, 2000);
    });
  });
}

/* ---- Footer year ------------------------------------------------------------- */
function initYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}
