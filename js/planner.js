// ============================================================
//  PLANO CENITAL INTERACTIVO — "Del plano a tu casa"
//  Dibuja una cocina en planta (escala 150px = 1 m) módulo por módulo
//  con modelos, terminaciones y equipamiento de Cucine LUBE.
//  Rota solo entre varias variantes hasta que la persona toca un control.
// ============================================================
(function () {
  const root = document.getElementById("planner");
  if (!root) return;

  // ---------- Catálogo ----------
  const MODELS = {
    BRERA: {
      note: "Frentes en enchapado de madera natural y líneas arquitectónicas.",
      handles: "tirador",
      fronts: [["Roble natural", "#b98b5e"], ["Nogal", "#6e4a32"], ["Roble ahumado", "#4a3a2e"]]
    },
    CLOVER: {
      note: "Diseño contemporáneo con infinitas combinaciones de color.",
      handles: "tirador",
      fronts: [["Blanco", "#f1efeb"], ["Gris arcilla", "#a39a90"], ["Verde salvia", "#9aa58f"], ["Azul noche", "#2f3a4a"]]
    },
    IMMAGINA: {
      note: "Sin tiradores: apertura con perfil gola integrado.",
      handles: "gola",
      fronts: [["Blanco seda", "#ecebe7"], ["Arena", "#cdbfa8"], ["Grafito", "#3d3d3f"]]
    },
    ROUND: {
      note: "Formas suaves: islas y penínsulas con extremos redondeados.",
      handles: "tirador",
      fronts: [["Crema", "#ebe3d3"], ["Arcilla", "#b47f62"], ["Verde oliva", "#6f7556"]]
    }
  };
  const TOPS = [["Laminado", "#d9d4cc"], ["HPL", "#bdb6ab"], ["FENIX", "#363636"], ["Cuarzo", "#eeebe6"]];
  const LAYOUTS = [["isla", "Isla"], ["peninsula", "Península"], ["L", "En L"], ["U", "En U"], ["paralela", "Doble línea"]];
  const layoutName = (v) => LAYOUTS.find((l) => l[0] === v)[1];

  // Variantes que se muestran solas, una tras otra
  const PRESETS = [
    { model: "BRERA", front: 0, top: 2, layout: "isla" },
    { model: "IMMAGINA", front: 2, top: 3, layout: "L" },
    { model: "CLOVER", front: 2, top: 1, layout: "U" },
    { model: "ROUND", front: 1, top: 0, layout: "peninsula" },
    { model: "IMMAGINA", front: 0, top: 2, layout: "paralela" },
    { model: "CLOVER", front: 3, top: 3, layout: "isla" },
    { model: "BRERA", front: 1, top: 1, layout: "L" },
    { model: "ROUND", front: 2, top: 3, layout: "U" }
  ];
  const HOLD = 3800; // ms que queda cada variante terminada

  const state = Object.assign({}, PRESETS[0]);

  // ---------- Piezas del plano ----------
  function pieces() {
    const round = state.model === "ROUND";
    const gola = MODELS[state.model].handles === "gola";
    const out = [];
    const add = (label, lx, ly, svg) => out.push({ label, lx, ly, svg });

    const hH = (x, y, w) => gola ? "" : `<line class="pl-handle" x1="${x + w / 2 - 14}" y1="${y}" x2="${x + w / 2 + 14}" y2="${y}"/>`;
    const hV = (x, y, h) => gola ? "" : `<line class="pl-handle" x1="${x}" y1="${y + h / 2 - 14}" x2="${x}" y2="${y + h / 2 + 14}"/>`;
    const golaH = (x, y, w) => gola ? `<line class="pl-gola" x1="${x + 4}" y1="${y}" x2="${x + w - 4}" y2="${y}"/>` : "";
    const golaV = (x, y, h) => gola ? `<line class="pl-gola" x1="${x}" y1="${y + 4}" x2="${x}" y2="${y + h - 4}"/>` : "";
    const base = (x, w, extra = "") =>
      `<rect class="pl-top" x="${x}" y="48" width="${w}" height="90"/>
       <rect class="pl-front" x="${x}" y="130" width="${w}" height="8"/>${hH(x, 134, w)}${golaH(x, 134, w)}${extra}`;
    const hob = (x, y, w, h) => {
      const r = Math.min(w, h) * 0.17;
      return `<rect class="pl-hob" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>
        <circle class="pl-ring" cx="${x + w * .28}" cy="${y + h * .3}" r="${r}"/><circle class="pl-ring" cx="${x + w * .72}" cy="${y + h * .3}" r="${r * .78}"/>
        <circle class="pl-ring" cx="${x + w * .28}" cy="${y + h * .7}" r="${r * .78}"/><circle class="pl-ring" cx="${x + w * .72}" cy="${y + h * .7}" r="${r}"/>`;
    };
    const seats = (pts) => pts.map(([x, y]) => `<circle class="pl-seat" cx="${x}" cy="${y}" r="19"/>`).join("");
    const lamps = (pts) => pts.map(([x, y]) => `<circle class="pl-lamp" cx="${x}" cy="${y}" r="20"/><path class="pl-lamp" d="M${x - 8} ${y} h16 M${x} ${y - 8} v16"/>`).join("");
    const table = (tx, ty) => `<circle class="pl-table" cx="${tx}" cy="${ty}" r="58"/>` +
      [0, 90, 180, 270].map((a) => {
        const rad = (a * Math.PI) / 180, cx = tx + Math.cos(rad) * 82, cy = ty + Math.sin(rad) * 82;
        return `<rect class="pl-chair" x="${cx - 18}" y="${cy - 18}" width="36" height="36" rx="6" transform="rotate(${a} ${cx} ${cy})"/>`;
      }).join("");
    // Lado izquierdo en L (bajo las columnas), con anafe y campana
    const leftRun = (withHob) => `<rect class="pl-top" x="48" y="318" width="90" height="270"/>
      <rect class="pl-front" x="130" y="318" width="8" height="270"/>
      ${[318, 408, 498].map((y) => hV(134, y, 90)).join("")}${golaV(134, 318, 270)}
      ${withHob ? hob(60, 412, 64, 84) + `<rect class="pl-upper" x="52" y="404" width="72" height="100"/>` : ""}`;
    const peninsula = (withHob) => `<rect class="pl-top" x="678" y="138" width="120" height="300" rx="${round ? 40 : 0}"/>
      <rect class="pl-front" x="678" y="138" width="8" height="${round ? 260 : 300}"/>
      ${hV(682, 160, 90)}${hV(682, 260, 90)}${golaV(682, 138, round ? 260 : 300)}
      ${withHob ? hob(700, 200, 74, 92) : ""}`;

    // --- Comunes: columnas + línea bajo ventana ---
    add("Columna heladera integrada", 93, 93,
      `<rect class="pl-col" x="48" y="48" width="90" height="90"/><path class="pl-fine" d="M56 56 L130 130 M130 56 L56 130"/>`);
    add("Columna hornos · horno + microondas Whirlpool", 93, 183,
      `<rect class="pl-col" x="48" y="138" width="90" height="90"/><rect class="pl-fine" x="62" y="152" width="62" height="62"/>`);
    add("Columna despensa con interiores extraíbles", 93, 273,
      `<rect class="pl-col" x="48" y="228" width="90" height="90"/><path class="pl-fine" d="M58 250 H128 M58 273 H128 M58 296 H128"/>`);
    add("Cajoneras de 60 cm · " + (gola ? "apertura gola" : "tirador LUBE") + " + alacenas", 273, 85,
      base(138, 90) + base(228, 90) + base(318, 90) + `<rect class="pl-upper" x="138" y="52" width="270" height="36"/>`);
    add("Bacha bajo mesada + grifería", 498, 110,
      base(408, 180, `<rect class="pl-sink" x="428" y="60" width="140" height="58" rx="8"/><circle class="pl-fine" cx="498" cy="89" r="5"/>`));
    add("Lavavajillas integrado Hotpoint MaxiSpace", 633, 93,
      base(588, 90, `<path class="pl-fine" d="M598 58 h70 v62 h-70 z M598 58 l70 62"/>`));
    add("Módulo esquinero con cestos extraíbles", 723, 93, base(678, 90));

    // --- Según distribución ---
    const r = round ? 60 : 0;
    switch (state.layout) {
      case "isla":
        add("Isla 2,40 m · anafe de inducción Whirlpool Clean Protect", 580, 345,
          `<rect class="pl-top" x="330" y="300" width="360" height="150" rx="${r}"/>
           <rect class="pl-front" x="${330 + r * .6}" y="300" width="${360 - r * 1.2}" height="8"/>
           ${[390, 510, 630].map((x) => hH(x - 45, 304, 90)).join("")}${golaH(330 + r * .6, 304, 360 - r * 1.2)}
           <path class="pl-dash" d="M${330 + r * .4} 420 H${690 - r * .4}"/>${hob(470, 322, 90, 70)}`);
        add("Barra desayunadora + 3 banquetas", 660, 486, seats([[410, 482], [510, 482], [610, 482]]));
        add("Iluminación colgante sobre la isla", 400, 336, lamps([[400, 370], [620, 370]]));
        add("Mesa y sillas LUBE", 922, 186, table(850, 250));
        break;
      case "peninsula":
        add("Península 1,80 m · anafe de inducción Whirlpool Clean Protect", 723, 420, peninsula(true));
        add("Barra lateral + 3 banquetas", 868, 160, seats([[830, 210], [830, 290], [830, 370]]));
        add("Iluminación colgante sobre la península", 640, 230, lamps([[738, 330]]));
        add("Mesa y sillas LUBE", 542, 356, table(470, 420));
        break;
      case "L":
        add("Lado en L · anafe Whirlpool Clean Protect + campana", 170, 455, leftRun(true));
        add("Mesa y sillas LUBE", 600, 300, table(530, 380));
        add("Iluminación colgante sobre la mesa", 470, 300, lamps([[530, 380]]));
        add("Rincón living / estar", 800, 560, `<rect class="pl-sofa" x="720" y="560" width="200" height="80" rx="10"/><path class="pl-fine" d="M735 575 h170"/>`);
        break;
      case "U":
        add("Lado en U · anafe Whirlpool Clean Protect + campana", 170, 455, leftRun(true));
        add("Península con barra desayunadora", 723, 420, peninsula(false));
        add("Banquetas para la barra", 868, 160, seats([[830, 210], [830, 290], [830, 370]]));
        add("Mesa y sillas LUBE", 492, 416, table(420, 480));
        break;
      case "paralela":
        add("Segunda línea 4,00 m · anafe Whirlpool Clean Protect", 320, 560,
          `<rect class="pl-top" x="300" y="582" width="600" height="90"/>
           <rect class="pl-front" x="300" y="582" width="600" height="8"/>
           ${[300, 400, 500, 600, 700, 800].map((x) => hH(x, 586, 100)).join("")}${golaH(300, 586, 600)}
           ${hob(552, 600, 96, 62)}<rect class="pl-upper" x="546" y="598" width="108" height="70"/>`);
        add("Columna vinoteca", 878, 560,
          `<rect class="pl-col" x="900" y="582" width="52" height="90"/><path class="pl-fine" d="M908 600 h36 M908 620 h36 M908 640 h36"/>`);
        add("Mesa y sillas LUBE", 912, 266, table(840, 330));
        add("Iluminación colgante sobre la mesa", 760, 266, lamps([[840, 330]]));
        break;
    }
    return out.map((p, i) => Object.assign(p, { n: i + 1 }));
  }

  // ---------- Arquitectura ----------
  const shell = `
    <defs>
      <pattern id="plGrid" width="15" height="15" patternUnits="userSpaceOnUse">
        <path d="M15 0H0V15" fill="none" stroke="var(--pl-grid)" stroke-width=".6"/>
      </pattern>
    </defs>
    <rect x="0" y="0" width="1000" height="720" fill="url(#plGrid)"/>
    <g class="pl-arch">
      <path class="pl-wall draw" d="M40 40 H960 V680 H40 Z"/>
      <rect x="400" y="30" width="200" height="20" fill="var(--pl-paper)"/>
      <path class="pl-fine draw" d="M400 36 H600 M400 44 H600 M400 30 V50 M600 30 V50"/>
      <rect x="90" y="670" width="96" height="20" fill="var(--pl-paper)"/>
      <path class="pl-fine draw" d="M90 680 V590 A90 90 0 0 1 180 680"/>
      <rect x="950" y="440" width="20" height="200" fill="var(--pl-paper)"/>
      <g class="pl-dim">
        <path d="M40 16 H960 M40 10 V22 M960 10 V22"/><text x="500" y="12">6,15 m</text>
        <path d="M16 40 V680 M10 40 H22 M10 680 H22"/><text x="12" y="360" transform="rotate(-90 12 360)">4,25 m</text>
      </g>
      <text class="pl-room" x="140" y="706">ACCESO</text>
      <text class="pl-room" x="985" y="545" transform="rotate(90 985 545)">LIVING →</text>
    </g>`;

  // ---------- Render ----------
  const svg = root.querySelector(".planner__svg");
  const legend = root.querySelector(".planner__legend");
  const summary = root.querySelector(".planner__summary");
  const badge = root.querySelector(".planner__variant");
  const autoBtn = root.querySelector(".planner__auto");
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  const auto = { on: true, i: 0, visible: false };

  function applyColors() {
    const m = MODELS[state.model];
    const front = m.fronts[state.front] || m.fronts[0];
    const top = TOPS[state.top];
    svg.style.setProperty("--pl-front", front[1]);
    svg.style.setProperty("--pl-topc", top[1]);
    summary.innerHTML =
      `<div><span>Modelo</span>${state.model}</div>` +
      `<div><span>Frentes</span>${front[0]}</div>` +
      `<div><span>Encimera</span>${top[0]}</div>` +
      `<div><span>Distribución</span>${layoutName(state.layout)}</div>`;
    root.querySelector(".planner__note").textContent = m.note;
    badge.textContent = auto.on
      ? `Variante ${String(auto.i + 1).padStart(2, "0")} / ${String(PRESETS.length).padStart(2, "0")} · ${layoutName(state.layout)}`
      : `Tu combinación · ${layoutName(state.layout)}`;
    autoBtn.textContent = auto.on ? "❚❚ Pausar variantes" : "▶ Ver variantes";
  }

  function render(animate, onDone) {
    clearTimers();
    const ps = pieces();
    svg.innerHTML = shell + ps.map((p, i) =>
      `<g class="pl-piece" data-n="${p.n}" style="--d:${i}">${p.svg}
         <g class="pl-tag"><circle cx="${p.lx}" cy="${p.ly}" r="11"/><text x="${p.lx}" y="${p.ly + 4}">${p.n}</text></g>
       </g>`).join("") +
      `<g class="pl-cursor"><path d="M0 0 L0 22 L6 16 L11 27 L15 25 L10 14 L18 14 Z"/></g>`;
    legend.innerHTML = ps.map((p) => `<li data-n="${p.n}"><b>${String(p.n).padStart(2, "0")}</b>${p.label}</li>`).join("");
    applyColors();

    const groups = [...svg.querySelectorAll(".pl-piece")];
    const items = [...legend.children];
    const cursor = svg.querySelector(".pl-cursor");
    const hl = (n, on) => {
      svg.querySelectorAll(`.pl-piece[data-n="${n}"]`).forEach((g) => g.classList.toggle("is-hl", on));
      legend.querySelectorAll(`li[data-n="${n}"]`).forEach((li) => li.classList.toggle("is-hl", on));
    };
    [...groups, ...items].forEach((el) => {
      el.addEventListener("mouseenter", () => hl(el.dataset.n, true));
      el.addEventListener("mouseleave", () => hl(el.dataset.n, false));
    });

    if (!animate) {
      root.classList.add("is-built");
      groups.forEach((g) => g.classList.add("is-on"));
      items.forEach((li) => li.classList.add("is-on"));
      if (onDone) onDone();
      return;
    }
    root.classList.remove("is-built");
    svg.classList.remove("is-drawn");
    void svg.getBoundingClientRect(); // reinicia la animación de paredes
    svg.classList.add("is-drawn");
    const STEP = 340, START = 1000;
    groups.forEach((g, i) => {
      later(() => {
        const bb = g.getBBox();
        cursor.setAttribute("transform", `translate(${bb.x + bb.width / 2} ${bb.y + bb.height / 2})`);
        cursor.classList.add("is-on");
        g.classList.add("is-on");
        items[i].classList.add("is-on");
      }, START + i * STEP);
    });
    later(() => {
      cursor.classList.remove("is-on");
      root.classList.add("is-built");
      if (onDone) onDone();
    }, START + groups.length * STEP + 400);
  }

  // ---------- Rotación automática de variantes ----------
  function playCurrent() {
    render(true, () => later(nextVariant, HOLD));
  }
  function nextVariant() {
    if (!auto.on || !auto.visible) return;
    auto.i = (auto.i + 1) % PRESETS.length;
    Object.assign(state, PRESETS[auto.i]);
    buildControls();
    playCurrent();
  }
  function stopAuto() {
    if (!auto.on) return;
    auto.on = false;
    clearTimers();
    // si se cortó a mitad del dibujo, completar el plano
    root.classList.add("is-built");
    svg.querySelectorAll(".pl-piece").forEach((g) => g.classList.add("is-on"));
    legend.querySelectorAll("li").forEach((li) => li.classList.add("is-on"));
    const c = svg.querySelector(".pl-cursor"); if (c) c.classList.remove("is-on");
    applyColors();
  }
  autoBtn.addEventListener("click", () => {
    if (auto.on) { stopAuto(); return; }
    auto.on = true;
    nextVariant();
  });

  // ---------- Controles ----------
  const elModel = root.querySelector("[data-ctl=model]");
  const elFront = root.querySelector("[data-ctl=front]");
  const elTop = root.querySelector("[data-ctl=top]");
  const elLayout = root.querySelector("[data-ctl=layout]");

  function buildControls() {
    elModel.innerHTML = Object.keys(MODELS).map((k) =>
      `<button type="button" class="seg${k === state.model ? " is-active" : ""}" data-v="${k}">${k}</button>`).join("");
    elFront.innerHTML = MODELS[state.model].fronts.map((f, i) =>
      `<button type="button" class="swatch${i === state.front ? " is-active" : ""}" data-v="${i}" style="--c:${f[1]}" title="${f[0]}" aria-label="${f[0]}"></button>`).join("") +
      `<span class="swatch__name">${MODELS[state.model].fronts[state.front][0]}</span>`;
    elTop.innerHTML = TOPS.map((t, i) =>
      `<button type="button" class="seg${i === state.top ? " is-active" : ""}" data-v="${i}"><i style="background:${t[1]}"></i>${t[0]}</button>`).join("");
    elLayout.innerHTML = LAYOUTS.map(([v, l]) =>
      `<button type="button" class="seg${v === state.layout ? " is-active" : ""}" data-v="${v}">${l}</button>`).join("");
  }

  const onCtl = (el, fn) => el.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    stopAuto(); fn(b.dataset.v); buildControls();
  });
  onCtl(elModel, (v) => { state.model = v; state.front = 0; render(false); });
  onCtl(elFront, (v) => { state.front = +v; applyColors(); });
  onCtl(elTop, (v) => { state.top = +v; applyColors(); });
  onCtl(elLayout, (v) => { state.layout = v; render(true); });
  root.querySelector(".planner__replay").addEventListener("click", () => auto.on ? playCurrent() : render(true));

  root.querySelector(".planner__send").addEventListener("click", () => {
    const m = MODELS[state.model];
    const msg = "Hola! Quiero hacer una consulta por una cocina Cucine LUBE." +
      "\nMe interesa esta combinación que vi en la web:" +
      "\n• Modelo: " + state.model +
      "\n• Frentes: " + m.fronts[state.front][0] +
      "\n• Encimera: " + TOPS[state.top][0] +
      "\n• Distribución: " + layoutName(state.layout) +
      "\n\n¿Me pueden asesorar?";
    window.open(window.waLink(msg), "_blank", "noopener");
  });

  // ---------- Inicio ----------
  buildControls();
  render(false);
  root.classList.remove("is-built");
  svg.querySelectorAll(".pl-piece").forEach((g) => g.classList.remove("is-on"));
  legend.querySelectorAll("li").forEach((li) => li.classList.remove("is-on"));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) { auto.on = false; render(false); return; }
  let started = false;
  new IntersectionObserver((en) => {
    const vis = en[0].isIntersecting;
    const wasHidden = !auto.visible;
    auto.visible = vis;
    if (vis && !started) { started = true; playCurrent(); return; }
    if (vis && wasHidden && auto.on && root.classList.contains("is-built")) later(nextVariant, 1200);
  }, { threshold: 0.3 }).observe(svg);
})();
