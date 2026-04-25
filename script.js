const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const shortestAngleDiff = (from, to) => ((to - from + 540) % 360) - 180;

const heroPastOffset = () => window.innerHeight * 0.8;

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

const initFooterReveal = () => {
  const revealElements = document.querySelectorAll(".footer [data-reveal]");

  if (revealElements.length === 0) {
    return;
  }

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

const initSpineMotion = () => {
  const track = document.querySelector(".spine__track");
  const scene = document.querySelector(".spine__scene");
  const nodes = Array.from(document.querySelectorAll(".node"));

  if (!track || !scene || nodes.length === 0) {
    return;
  }

  const updatePastHero = () => {
    document.body.classList.toggle("is-past-hero", window.scrollY > heroPastOffset());
  };

  if (prefersReducedMotion.matches) {
    updatePastHero();
    return;
  }

  const totalRotation = 270;
  let ticking = false;

  const updateScene = () => {
    const vh = window.innerHeight;
    const trackTop = track.offsetTop;
    const trackHeight = track.offsetHeight;
    const scrollY = window.scrollY;
    const p = clamp((scrollY - trackTop) / (trackHeight - vh), 0, 1);
    const rotation = p * totalRotation;

    scene.style.transform = `translateY(${(p - 0.5) * 60}px) rotateY(${rotation}deg)`;

    nodes.forEach((node) => {
      const nodeAngle = Number(node.dataset.angle) || 0;
      const delta = shortestAngleDiff(nodeAngle, -rotation);
      const opacity = Math.max(0, 1 - Math.abs(delta) / 100);

      node.style.setProperty("--node-angle", `${nodeAngle}deg`);
      node.style.setProperty("--node-fade", opacity.toFixed(3));
    });

    updatePastHero();
    ticking = false;
  };

  const requestTick = () => {
    if (ticking) {
      return;
    }

    ticking = true;
    window.requestAnimationFrame(updateScene);
  };

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);
  requestTick();
};

const initMotion = () => {
  initHeroReveal();

  if (prefersReducedMotion.matches) {
    document.querySelectorAll(".footer [data-reveal]").forEach((element) => {
      element.classList.add("is-visible");
    });
    initSpineMotion();
    return;
  }

  initFooterReveal();
  initSpineMotion();
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMotion, { once: true });
} else {
  initMotion();
}
