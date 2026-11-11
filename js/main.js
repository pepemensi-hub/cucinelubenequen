(function () {
  const C = window.LUBE_CONFIG;

  // ---- WhatsApp helper (global) ----
  window.waLink = function (msg) {
    return "https://wa.me/" + C.whatsapp + "?text=" + encodeURIComponent(msg + (C.firma || ""));
  };
  document.addEventListener("click", function (e) {
    const a = e.target.closest(".js-wa");
    if (!a) return;
    e.preventDefault();
    window.open(window.waLink(a.dataset.msg || "Hola! Quiero hacer una consulta."), "_blank", "noopener");
  });

  // ---- Header ----
  const header = document.getElementById("header");
  const onScroll = () => header.classList.toggle("is-solid", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const toggleMenu = (open) => {
    burger.setAttribute("aria-expanded", open);
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  };
  burger.addEventListener("click", () => toggleMenu(burger.getAttribute("aria-expanded") !== "true"));
  nav.addEventListener("click", (e) => { if (e.target.tagName === "A") toggleMenu(false); });

  // ---- Hero slider ----
  const slides = [...document.querySelectorAll(".hero__slide")];
  const dots = document.querySelector(".hero__dots");
  const model = document.getElementById("heroModel");
  let i = 0, timer;
  slides.forEach((s, n) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", "Ver " + s.dataset.name);
    b.addEventListener("click", () => { go(n); restart(); });
    dots.appendChild(b);
  });
  function go(n) {
    slides[i].classList.remove("is-active"); dots.children[i].classList.remove("is-active");
    i = n;
    slides[i].classList.add("is-active"); dots.children[i].classList.add("is-active");
    model.textContent = slides[i].dataset.name;
  }
  function restart() { clearInterval(timer); timer = setInterval(() => go((i + 1) % slides.length), 6000); }
  go(0); restart();

  // ---- Reveal on scroll ----
  const els = document.querySelectorAll(".section-head, .intro__title, .intro__stats, .kcard, .showroom__text, .steps li, .gitem, .contact__info, .form");
  els.forEach((el) => el.classList.add("reveal"));
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add("is-in"));

  // ---- Contact form -> WhatsApp ----
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const nombre = form.elements.nombre;
    if (!d.nombre.trim()) { nombre.classList.add("is-invalid"); nombre.focus(); return; }
    nombre.classList.remove("is-invalid");
    const msg = "Hola! Soy " + d.nombre.trim() +
      (d.localidad ? " (" + d.localidad.trim() + ")" : "") +
      ".\nEstoy buscando: " + d.interes +
      (d.mensaje.trim() ? "\n" + d.mensaje.trim() : "");
    window.open(window.waLink(msg), "_blank", "noopener");
  });

  document.getElementById("year").textContent = new Date().getFullYear();
})();
