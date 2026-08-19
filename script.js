const navbar = document.querySelector("#navbar");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");

const setScrolled = () => navbar?.classList.toggle("is-scrolled", window.scrollY > 12);
setScrolled();
window.addEventListener("scroll", setScrolled, { passive: true });

menuToggle?.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "Close" : "Menu";
});

mobileMenu?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    mobileMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu";
  }
});

const range = document.querySelector("#baRange");
const baAfter = document.querySelector("#baAfter");
const baDivider = document.querySelector("#baDivider");
const baHandle = document.querySelector("#baHandle");
const updateBeforeAfter = (value) => {
  if (!baAfter || !baDivider || !baHandle) return;
  baAfter.style.clipPath = `inset(0 0 0 ${value}%)`;
  baDivider.style.left = `${value}%`;
  baHandle.style.left = `${value}%`;
};
if (range) {
  range.addEventListener("input", (event) => updateBeforeAfter(event.target.value));
  updateBeforeAfter(range.value);
}

const revealElements = [...document.querySelectorAll(".reveal")];
let observer;
const revealElement = (element) => {
  element.classList.add("is-visible");
  observer?.unobserve(element);
};
if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.isIntersecting && revealElement(entry.target));
  }, { rootMargin: "0px 0px -6%", threshold: 0.08 });
  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach(revealElement);
}

const form = document.querySelector("#estimateForm");
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const success = form.querySelector("#formSuccess");
  const errorMessage = form.querySelector("#formError");
  const submit = form.querySelector(".form-submit");
  success?.classList.remove("is-visible");
  errorMessage?.classList.remove("is-visible");
  submit.disabled = true;
  submit.textContent = "Sending...";
  try {
    const response = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Formspree submission failed");
    form.reset();
    success?.classList.add("is-visible");
  } catch (error) {
    errorMessage?.classList.add("is-visible");
  } finally {
    submit.disabled = false;
    submit.textContent = "Submit Estimate Request";
  }
});

// Add the verified Google Business Profile review URL here when available.
const GOOGLE_REVIEWS_URL = "";
document.querySelectorAll("[data-google-reviews]").forEach((link) => {
  if (GOOGLE_REVIEWS_URL) {
    link.href = GOOGLE_REVIEWS_URL;
    link.hidden = false;
  }
});

const stickyTextCta = document.querySelector(".mobile-text-cta");
const stickyObstructions = document.querySelectorAll(".home-hero, .page-hero, #contact, .footer");
if (stickyTextCta && stickyObstructions.length && "IntersectionObserver" in window) {
  const visibleObstructions = new Set();
  const stickyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) visibleObstructions.add(entry.target);
      else visibleObstructions.delete(entry.target);
    });
    stickyTextCta.classList.toggle("is-hidden", visibleObstructions.size > 0);
  }, { threshold: 0.05 });
  stickyObstructions.forEach((element) => stickyObserver.observe(element));
}
