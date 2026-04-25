const sphere = document.querySelector(".sphere");
const identity = document.querySelector("#identity-1");

const update = () => {
  const triggered = window.scrollY > window.innerHeight * 0.25;

  sphere.classList.toggle("sphere--peek", !triggered);
  sphere.classList.toggle("sphere--center", triggered);
  identity.classList.toggle("identity--in", triggered);
};

window.addEventListener("scroll", update, { passive: true });
update();
