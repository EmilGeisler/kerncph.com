const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const setDelay = (element) => {
  const delay = element.dataset.revealDelay;

  if (delay) {
    element.style.transitionDelay = `${delay}ms`;
  }
};

const showElement = (element) => {
  setDelay(element);
  element.classList.add("is-visible");
};

const initHeroReveal = () => {
  document.querySelectorAll("[data-hero-reveal]").forEach((element) => {
    showElement(element);
  });
};

const initScrollReveal = () => {
  const revealElements = document.querySelectorAll("[data-reveal]");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        showElement(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15
    }
  );

  revealElements.forEach((element) => {
    setDelay(element);
    observer.observe(element);
  });
};

const initMotion = () => {
  if (prefersReducedMotion.matches) {
    document
      .querySelectorAll("[data-reveal], [data-hero-reveal]")
      .forEach((element) => element.classList.add("is-visible"));
    return;
  }

  initHeroReveal();
  initScrollReveal();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMotion, { once: true });
} else {
  initMotion();
}
