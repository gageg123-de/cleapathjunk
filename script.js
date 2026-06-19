const navbar = document.querySelector("#navbar");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobileMenu");
const range = document.querySelector("#baRange");
const baAfter = document.querySelector("#baAfter");
const baDivider = document.querySelector("#baDivider");
const baHandle = document.querySelector("#baHandle");
const form = document.querySelector("#estimateForm");
const formSuccess = document.querySelector("#formSuccess");

const setScrolled = () => navbar.classList.toggle("is-scrolled", window.scrollY > 12);

setScrolled();
window.addEventListener("scroll", setScrolled, { passive: true });

menuToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "Close" : "Menu";
});

mobileMenu.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    mobileMenu.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "Menu";
  }
});

const updateBeforeAfter = (value) => {
  baAfter.style.clipPath = `inset(0 0 0 ${value}%)`;
  baDivider.style.left = `${value}%`;
  baHandle.style.left = `${value}%`;
};

range.addEventListener("input", (event) => updateBeforeAfter(event.target.value));
updateBeforeAfter(range.value);

const scrollToHash = () => {
  const hash = location.hash || (window.location.href.includes("#") ? `#${window.location.href.split("#").pop()}` : "");
  if (!hash) return;

  const target = document.getElementById(decodeURIComponent(hash.slice(1)));
  if (target) {
    window.clearTimeout(window.clearPathHashScrollTimer);
    window.clearPathHashScrollTimer = window.setTimeout(() => {
      target.scrollIntoView({ block: "start" });
    }, 80);
  }
};

window.addEventListener("load", scrollToHash);
window.addEventListener("hashchange", scrollToHash);
scrollToHash();
window.setTimeout(scrollToHash, 250);

let hashScrollAttempts = 0;
const hashScrollInterval = window.setInterval(() => {
  hashScrollAttempts += 1;
  scrollToHash();
  if (hashScrollAttempts >= 12 || window.clearPathHashScrollTimer) {
    window.clearInterval(hashScrollInterval);
  }
}, 250);

const revealElements = [...document.querySelectorAll(".reveal")];
const revealElement = (el) => {
  el.classList.add("is-visible");
  el.style.opacity = "1";
  el.style.transform = "translateY(0)";
  if (observer) observer.unobserve(el);
};
const revealVisibleElements = () => {
  const trigger = window.innerHeight * 0.9;

  revealElements.forEach((el) => {
    if (!el.classList.contains("is-visible") && el.getBoundingClientRect().top < trigger) {
      revealElement(el);
    }
  });
};
const observer =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) revealElement(entry.target);
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
      )
    : null;

if (observer) revealElements.forEach((el) => observer.observe(el));
revealVisibleElements();
window.addEventListener("load", revealVisibleElements);
window.addEventListener("scroll", revealVisibleElements, { passive: true });
window.addEventListener("resize", revealVisibleElements);

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formSuccess.classList.add("is-visible");
  form.reset();
});
