const navbar = document.querySelector("#navbar");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");
const analyticsConsentKey = "clearPathAnalyticsConsent";
const analyticsConsent = document.querySelector("#analyticsConsent");
const analyticsPromptDeadlineKey = "clearPathAnalyticsPromptDeadline";
const analyticsPromptSuppressedKey = "clearPathAnalyticsPromptSuppressed";
const mobileAnalyticsConsentDelayMs = Number(analyticsConsent?.dataset.mobileDelayMs || 0);
const mobileAnalyticsConsentMaxWidth = Number(analyticsConsent?.dataset.mobileMaxWidth || 0);
const mobileAnalyticsConsentQuery = matchMedia(`(max-width: ${mobileAnalyticsConsentMaxWidth}px)`);
let analyticsPromptTimer;

const readAnalyticsConsent = () => {
  try {
    const choice = localStorage.getItem(analyticsConsentKey);
    return choice === "granted" || choice === "denied" ? choice : null;
  } catch (error) {
    return null;
  }
};

const writeAnalyticsConsent = (choice) => {
  try {
    localStorage.setItem(analyticsConsentKey, choice);
  } catch (error) {
    // Consent still applies for this page when browser storage is unavailable.
  }
};

const readSessionValue = (key) => {
  try {
    return sessionStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

const writeSessionValue = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    // The timer still works for this page when session storage is unavailable.
  }
};

const clearSessionValue = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    // No stored timer state needs clearing when session storage is unavailable.
  }
};

const cancelAnalyticsPromptTimer = () => {
  if (analyticsPromptTimer) clearTimeout(analyticsPromptTimer);
  analyticsPromptTimer = undefined;
};

const showAnalyticsConsent = ({ focus = false } = {}) => {
  cancelAnalyticsPromptTimer();
  analyticsConsent.hidden = false;
  if (focus) analyticsConsent.querySelector("[data-consent-choice]")?.focus();
};

const suppressPendingAnalyticsPrompt = () => {
  if (!analyticsPromptTimer || !analyticsConsent.hidden) return;
  cancelAnalyticsPromptTimer();
  writeSessionValue(analyticsPromptSuppressedKey, "true");
};

const scheduleInitialAnalyticsPrompt = () => {
  if (readAnalyticsConsent() !== null) {
    analyticsConsent.hidden = true;
    return;
  }

  if (!mobileAnalyticsConsentQuery.matches) {
    showAnalyticsConsent();
    return;
  }

  analyticsConsent.hidden = true;
  if (readSessionValue(analyticsPromptSuppressedKey) === "true") return;

  const storedDeadline = Number(readSessionValue(analyticsPromptDeadlineKey));
  const deadline = Number.isFinite(storedDeadline) && storedDeadline > 0
    ? storedDeadline
    : Date.now() + mobileAnalyticsConsentDelayMs;
  writeSessionValue(analyticsPromptDeadlineKey, String(deadline));
  const remainingDelay = Math.max(0, deadline - Date.now());
  if (remainingDelay === 0) {
    showAnalyticsConsent();
    return;
  }
  analyticsPromptTimer = setTimeout(showAnalyticsConsent, remainingDelay);
};

const applyAnalyticsConsent = (choice) => {
  const analyticsStorage = choice === "granted" ? "granted" : "denied";
  window.gtag?.("consent", "update", {
    analytics_storage: analyticsStorage,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
  window.clarity?.("consentv2", {
    ad_Storage: "denied",
    analytics_Storage: analyticsStorage,
  });
  window.clearPathAnalyticsConsent = choice;
  writeAnalyticsConsent(choice);
  cancelAnalyticsPromptTimer();
  clearSessionValue(analyticsPromptDeadlineKey);
  clearSessionValue(analyticsPromptSuppressedKey);
  analyticsConsent.hidden = true;
};

if (analyticsConsent) {
  scheduleInitialAnalyticsPrompt();
  analyticsConsent.querySelectorAll("[data-consent-choice]").forEach((button) => {
    button.addEventListener("click", () => applyAnalyticsConsent(button.dataset.consentChoice));
  });
  document.querySelectorAll("[data-open-consent]").forEach((button) => {
    button.addEventListener("click", () => {
      showAnalyticsConsent({ focus: true });
    });
  });
  mobileAnalyticsConsentQuery.addEventListener("change", (event) => {
    if (!event.matches && readAnalyticsConsent() === null && analyticsConsent.hidden) {
      showAnalyticsConsent();
    }
  });
  document.addEventListener("click", (event) => {
    if (event.target.closest('a[href^="sms:"], a[href^="tel:"], a[href$="#contact"], [data-open-estimate]')) {
      suppressPendingAnalyticsPrompt();
    }
  }, { capture: true });
}

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
const estimateDetails = document.querySelector("#estimate-options");
document.querySelector("[data-open-estimate]")?.addEventListener("click", () => {
  if (estimateDetails) estimateDetails.open = true;
  estimateDetails?.scrollIntoView({ behavior: "smooth", block: "start" });
  setTimeout(() => form?.querySelector("#name")?.focus(), 350);
});
form?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const success = form.querySelector("#formSuccess");
  const errorMessage = form.querySelector("#formError");
  const submit = form.querySelector(".form-submit");
  const submitLabel = submit?.textContent;
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
    submit.textContent = submitLabel;
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
