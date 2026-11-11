// ============================================================
//  PLANO CENITAL INTERACTIVO — "Diseñá tu cocina"
//  Dibuja una cocina en planta (escala 150px = 1 m) módulo por módulo
//  con modelos, terminaciones y equipamiento de Cucine LUBE.
// ============================================================
(function () {
  const root = document.getElementById("planner");
  if (!root) return;

  // ---------- Catálogo (modelos y terminaciones) ----------
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
      note: "Formas suaves: la isla termina en extremos redondeados.",
      handles: "tirador",
      fronts: [["Crema", "#ebe3d3"], ["Arcilla", "#b47f62"], ["Verde oliva", "#6f7556"]]
    }
  };
  const TOPS = [
    ["Laminado", "#d9d4cc"],
    ["HPL", "#bdb6ab"],
    ["FENIX", "#363636"],
    ["Cuarzo", "#eeebe6"]
  ];

  const state = { model: "BRERA", front: 0, top: 2, layout: "isla" };

  // ---------- Elementos del plano ----------
  // Cada pieza: n (número de leyenda), label, svg (función), lx/ly (posición del número)
  function pieces() {
    const round = state.model === "ROUND";
    const gola = MODELS[state.model].handles === "gola";
    const handle = (x, y, w) => gola ? "" : `<line class="pl-handle" x1="${x + w / 2 - 14}" y1="${y}" x2="${x + w / 2 + 14}" y2="${y}"/>`;
    const base = (x, w, extra = "") =>
      `<rect class="pl-top" x="${x}" y="48" width="${w}" height="90"/>
       <rect class="pl-front" x="${x}" y="130" width="${w}" height="8"/>${handle(x, 134, w)}${extra}`;

    const list = [
      { n: 1, label: "Columna heladera integrada", lx: 93, ly: 93,
        svg: `<rect class="pl-col" x="48" y="48" width="90" height="90"/><path class="pl-fine" d="M56 56 L130 130 M130 56 L56 130"/>` },
      { n: 2, label: "Columna hornos · horno + microondas Whirlpool", lx: 93, ly: 183,
        svg: `<rect class="pl-col" x="48" y="138" width="90" height="90"/><rect class="pl-fine" x="62" y="152" width="62" height="62"/>` },
      { n: 3, label: "Columna despensa con interiores extraíbles", lx: 93, ly: 273,
        svg: `<rect class="pl-col" x="48" y="228" width="90" height="90"/><path class="pl-fine" d="M58 250 H128 M58 273 H128 M58 296 H128"/>` },
      { n: 4, label: "Cajoneras de 60 cm · " + (gola ? "apertura gola" : "tirador LUBE"), lx: 273, ly: 85,
        svg: base(138, 90) + base(228, 90) + base(318, 90) +
          `<rect class="pl-upper" x="138" y="52" width="270" height="36"/>` },
      { n: 5, label: "Bacha bajo mesada + grifería", lx: 498, ly: 110,
        svg: base(408, 180, `<rect class="pl-sink" x="428" y="60" width="140" height="58" rx="8"/><circle class="pl-fine" cx="498" cy="89" r="5"/><path class="pl-fine" d="M498 60 v-8"/>`) },
      { n: 6, label: "Lavavajillas integrado Hotpoint MaxiSpace", lx: 633, ly: 93,
        svg: base(588, 90, `<path class="pl-fine" d="M598 58 h70 v62 h-70 z M598 58 l70 62"/>`) },
      { n: 7, label: "Módulo esquinero con cestos extraíbles", lx: 723, ly: 93,
        svg: base(678, 90) }
    ];

    if (state.layout === "isla") {
      const r = round ? 60 : 0;
      list.push(
        { n: 8, label: "Isla 2,40 m · anafe de inducción Whirlpool Clean Protect", lx: 580, ly: 345,
          svg: `<rect class="pl-top" x="330" y="300" width="360" height="150" rx="${r}"/>
                <rect class="pl-front" x="${330 + r * 0.6}" y="300" width="${360 - r * 1.2}" height="8"/>
                ${[390, 510, 630].map((x) => handle(x - 45, 304, 90)).join("")}
                <path class="pl-dash" d="M${330 + r * 0.4} 420 H${690 - r * 0.4}"/>
                <rect class="pl-hob" x="470" y="322" width="90" height="70" rx="4"/>
                <circle class="pl-ring" cx="492" cy="343" r="13"/><circle class="pl-ring" cx="538" cy="343" r="10"/>
                <circle class="pl-ring" cx="492" cy="373" r="10"/><circle class="pl-ring" cx="538" cy="373" r="13"/>` },
        { n: 9, label: "Barra desayunadora + 3 banquetas", lx: 660, ly: 486,
          svg: [410, 510, 610].map((x) => `<circle class="pl-seat" cx="${x}" cy="482" r="19"/>`).join("") },
        { n: 10, label: "Iluminación colgante sobre la isla", lx: 400, ly: 336,
          svg: [400, 620].map((x) => `<circle class="pl-lamp" cx="${x}" cy="370" r="20"/><path class="pl-lamp" d="M${x - 8} 370 h16 M${x} 362 v16"/>`).join("") }
      );
    } else {
      list.push(
        { n: 8, label: "Península 1,80 m · anafe de inducción Whirlpool Clean Protect", lx: 723, ly: 420,
          svg: `<rect class="pl-top" x="678" y="138" width="120" height="300" rx="${round ? 40 : 0}"/>
                <rect class="pl-front" x="678" y="138" width="8" height="${round ? 260 : 300}"/>
                <rect class="pl-hob" x="700" y="200" width="70" height="90" rx="4"/>
                <circle class="pl-ring" cx="720" cy="222" r="12"/><circle class="pl-ring" cx="750" cy="222" r="9"/>
                <circle class="pl-ring" cx="720" cy="268" r="9"/><circle class="pl-ring" cx="750" cy="268" r="12"/>` },
        { n: 9, label: "Barra lateral + 3 banquetas", lx: 868, ly: 160,
          svg: [210, 290, 370].map((y) => `<circle class="pl-seat" cx="830" cy="${y}" r="19"/>`).join("") },
        { n: 10, label: "Iluminación colgante sobre la península", lx: 640, ly: 230,
          svg: `<circle class="pl-lamp" cx="738" cy="330" r="20"/><path class="pl-lamp" d="M730 330 h16 M738 322 v16"/>` }
      );
    }

    const tableX = state.layout === "isla" ? 850 : 470;
    const tableY = state.layout === "isla" ? 250 : 420;
    list.push({
      n: 11, label: "Mesa y sillas LUBE", lx: tableX + 72, ly: tableY - 64,
      svg: `<circle class="pl-table" cx="${tableX}" cy="${tableY}" r="58"/>` +
        [0, 90, 180, 270].map((a) => {
          const rad = (a * Math.PI) / 180, cx = tableX + Math.cos(rad) * 82, cy = tableY + Math.sin(rad) * 82;
          return `<rect class="pl-chair" x="${cx - 18}" y="${cy - 18}" width="36" height="36" rx="6" transform="rotate(${a} ${cx} ${cy})"/>`;
        }).join("")
    });
    return list;
  }

  // ---------- Arquitectura (paredes, aberturas, cotas) ----------
  const shell = `
    <defs>
      <pattern id="plGrid" width="15" height="15" patternUnits="userSpaceOnUse">
        <path d="M15 0H0V15" fill="none" stroke="var(--pl-grid)" stroke-width=".6"/>
      </pattern>
      <pattern id="plWood" width="10" height="90" patternUnits="userSpaceOnUse">
        <path d="M2 0 C4 30 0 60 3 90 M7 0 C9 40 5 70 8 90" fill="none" stroke="rgba(0,0,0,.12)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect x="0" y="0" width="1000" height="720" fill="url(#plGrid)"/>
    <g class="pl-arch">
      <path class="pl-wall draw" d="M40 40 H960 V680 H40 Z"/>
      <!-- ventana -->
      <rect x="400" y="30" width="200" height="20" fill="var(--pl-paper)"/>
      <path class="pl-fine draw" d="M400 36 H600 M400 44 H600 M400 30 V50 M600 30 V50"/>
      <!-- puerta -->
      <rect x="90" y="670" width="96" height="20" fill="var(--pl-paper)"/>
      <path class="pl-fine draw" d="M90 680 V590 A90 90 0 0 1 180 680"/>
      <!-- abertura a living -->
      <rect x="950" y="440" width="20" height="200" fill="var(--pl-paper)"/>
      <!-- cotas -->
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

  function applyColors() {
    const m = MODELS[state.model];
    const front = m.fronts[state.front] || m.fronts[0];
    const top = TOPS[state.top];
    svg.style.setProperty("--pl-front", front[1]);
    svg.style.setProperty("--pl-topc", top[1]);
    svg.classList.toggle("is-wood", state.model === "BRERA");
    summary.innerHTML =
      `<div><span>Modelo</span>${state.model}</div>` +
      `<div><span>Frentes</span>${front[0]}</div>` +
      `<div><span>Encimera</span>${top[0]}</div>` +
      `<div><span>Distribución</span>${state.layout === "isla" ? "Con isla" : "Con península"}</div>`;
    root.querySelector(".planner__note").textContent = m.note;
  }

  function render(animate) {
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

    // Hover sincronizado plano <-> leyenda
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
      return;
    }
    root.classList.remove("is-built");
    svg.classList.remove("is-drawn");
    void svg.getBoundingClientRect(); // reinicia la animación de paredes
    svg.classList.add("is-drawn");
    const STEP = 380, START = 1100;
    groups.forEach((g, i) => {
      setTimeout(() => {
        const bb = g.getBBox();
        cursor.setAttribute("transform", `translate(${bb.x + bb.width / 2} ${bb.y + bb.height / 2})`);
        cursor.classList.add("is-on");
        g.classList.add("is-on");
        items[i].classList.add("is-on");
        if (i === groups.length - 1) setTimeout(() => { cursor.classList.remove("is-on"); root.classList.add("is-built"); }, 600);
      }, START + i * STEP);
    });
  }

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
    elLayout.innerHTML = [["isla", "Isla"], ["peninsula", "Península"]].map(([v, l]) =>
      `<button type="button" class="seg${v === state.layout ? " is-active" : ""}" data-v="${v}">${l}</button>`).join("");
  }

  elModel.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    state.model = b.dataset.v; state.front = 0; buildControls(); render(false);
  });
  elFront.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    state.front = +b.dataset.v; buildControls(); applyColors();
  });
  elTop.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    state.top = +b.dataset.v; buildControls(); applyColors();
  });
  elLayout.addEventListener("click", (e) => {
    const b = e.target.closest("button"); if (!b) return;
    state.layout = b.dataset.v; buildControls(); render(true);
  });
  root.querySelector(".planner__replay").addEventListener("click", () => render(true));

  root.querySelector(".planner__send").addEventListener("click", () => {
    const m = MODELS[state.model];
    const msg = "Hola! Armé este diseño en la web y quiero un proyecto a medida:" +
      "\n• Modelo: " + state.model +
      "\n• Frentes: " + m.fronts[state.front][0] +
      "\n• Encimera: " + TOPS[state.top][0] +
      "\n• Distribución: " + (state.layout === "isla" ? "con isla" : "con península") +
      "\n\n¿Coordinamos una visita al showroom?";
    window.open(window.waLink(msg), "_blank", "noopener");
  });

  // ---------- Inicio: se dibuja al entrar en pantalla ----------
  buildControls();
  render(false);
  root.classList.remove("is-built");
  svg.querySelectorAll(".pl-piece").forEach((g) => g.classList.remove("is-on"));
  legend.querySelectorAll("li").forEach((li) => li.classList.remove("is-on"));

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) { render(false); return; }
  const io = new IntersectionObserver((en) => {
    if (en[0].isIntersecting) { io.disconnect(); render(true); }
  }, { threshold: 0.3 });
  io.observe(svg);
})();
