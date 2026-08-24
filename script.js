const navToggle = document.getElementById("nav-toggle");
const navLinksEl = document.getElementById("nav-links");

function closeMobileNav() {
  navLinksEl.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("nav-locked");
}

if (navToggle && navLinksEl) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinksEl.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("nav-locked", isOpen);
  });

  navLinksEl.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navLinksEl.classList.contains("open")) {
      closeMobileNav();
      navToggle.focus();
    }
  });
}

// Photo lightbox — intercepts links to images and shows them in an overlay
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxClose = document.getElementById("lightbox-close");
const photoLinks = document.querySelectorAll("[data-lightbox]");

function openLightbox(src, alt) {
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.classList.add("lightbox-open");
}

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.classList.remove("lightbox-open");
  lightboxImg.src = "";
}

if (lightbox && lightboxImg && lightboxClose) {
  photoLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      openLightbox(link.getAttribute("href"), link.dataset.alt || "");
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

// Highlight the nav link for whichever section is currently in view
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const link = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      navLinks.forEach((navLink) => navLink.classList.remove("active"));

      if (link) {
        link.classList.add("active");
      }
    });
  },
  { threshold: 0.3, rootMargin: "-25% 0px -55% 0px" }
);

sections.forEach((section) => sectionObserver.observe(section));

// Staggered scroll-reveal: elements fade/blur in as they enter view,
// with each element delayed relative to its siblings under the same parent
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

if (prefersReducedMotion) {
  revealElements.forEach((el) => el.classList.add("in-view"));
} else {
  const siblingGroups = new Map();

  revealElements.forEach((el) => {
    const parent = el.parentElement;
    if (!siblingGroups.has(parent)) siblingGroups.set(parent, []);
    siblingGroups.get(parent).push(el);
  });

  siblingGroups.forEach((group) => {
    group.forEach((el, index) => {
      el.style.transitionDelay = `${index * 90}ms`;
    });
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}
