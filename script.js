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

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formSuccess.classList.add("is-visible");
  form.reset();
});
