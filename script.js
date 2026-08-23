const cards = document.querySelectorAll(".project-card, .timeline-item, .athletics-card");

cards.forEach((card) => {
  card.addEventListener("mouseenter", () => {
    card.style.boxShadow = "0 20px 40px rgba(88, 28, 135, 0.45)";
  });

  card.addEventListener("mouseleave", () => {
    card.style.boxShadow = "none";
  });
});

const slides = document.querySelectorAll(".hero, .content-section");

const slideObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      } else {
        entry.target.classList.remove("active");
      }
    });
  },
  {
    threshold: 0.55
  }
);

slides.forEach((slide) => {
  slideObserver.observe(slide);
});

const pageSlides = [...document.querySelectorAll(".hero, .content-section")];

let currentSlide = 0;
let isScrolling = false;

function scrollToSlide(index) {
  if (index < 0 || index >= pageSlides.length) {
    return;
  }

  isScrolling = true;
  currentSlide = index;

  pageSlides[currentSlide].scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

  window.setTimeout(() => {
    isScrolling = false;
  }, 900);
}

window.addEventListener(
  "wheel",
  (event) => {
    if (isScrolling) {
      event.preventDefault();
      return;
    }

    if (Math.abs(event.deltaY) < 20) {
      return;
    }

    event.preventDefault();

    if (event.deltaY > 0) {
      scrollToSlide(currentSlide + 1);
    } else {
      scrollToSlide(currentSlide - 1);
    }
  },
  { passive: false }
);