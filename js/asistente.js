// ============================================================
//  ASISTENTE DE PREGUNTAS FRECUENTES
//  Responde al instante y SIEMPRE deriva a WhatsApp.
//  Para editar respuestas: modificá el array FAQ.
//  - chip: texto del botón rápido (opcional)
//  - keys: palabras que activan la respuesta (sin tildes, minúsculas)
//  - a:    respuesta
//  - wa:   mensaje que se precarga en WhatsApp
// ============================================================
(function () {
  const C = window.LUBE_CONFIG;

  const FAQ = [
    {
      chip: "📍 Dónde están",
      keys: ["donde", "direccion", "ubicacion", "ubicados", "showroom", "local", "mapa", "llegar", "salta"],
      a: "Nuestro showroom oficial está en " + C.direccion + ", Patagonia. Es el primer showroom oficial de Cucine LUBE en Argentina.\nTe recomendamos coordinar la visita para que un asesor te atienda de forma personalizada.",
      wa: "Hola! Quiero coordinar una visita al showroom de Salta 95."
    },
    {
      chip: "🕒 Horarios",
      keys: ["horario", "hora", "abren", "abierto", "cierran", "atienden", "sabado", "domingo", "feriado"],
      a: "Nuestro showroom en Salta 95 atiende:\n• Lunes a viernes: 9 a 17 h\n• Sábados: 9 a 13 h\n• Domingos: cerrado\nTambién podés llamarnos al 0299 326-8860. Si querés, te agendamos una visita por WhatsApp.",
      wa: "Hola! ¿Cuál es el horario de atención del showroom?"
    },
    {
      chip: "💰 Precios",
      keys: ["precio", "cuesta", "cuanto", "valor", "presupuesto", "cotizacion", "cotizar", "costo", "sale"],
      a: "Cada cocina LUBE se fabrica a medida, por eso el valor depende de las medidas, el modelo, las terminaciones, la encimera y los electrodomésticos.\nCon unas medidas aproximadas (o un plano) te armamos un presupuesto personalizado.",
      wa: "Hola! Quiero pedir un presupuesto para una cocina a medida."
    },
    {
      chip: "🇮🇹 ¿Son italianas?",
      keys: ["italia", "italiana", "importada", "original", "fabrica", "fabricacion", "origen", "made", "treia"],
      a: "Sí. Todas las cocinas Cucine LUBE se diseñan y fabrican en Italia, en la planta del Gruppo LUBE en Treia (Marche), una de las mayores fábricas de cocinas de Europa. Somos showroom oficial de la marca.",
      wa: "Hola! Quiero saber más sobre la fabricación italiana de las cocinas LUBE."
    },
    {
      chip: "⏳ Plazos de entrega",
      keys: ["plazo", "demora", "tarda", "entrega", "cuando", "tiempo", "llega", "importacion"],
      a: "El plazo depende del modelo y de la configuración elegida, ya que cada cocina se produce a medida en Italia y se importa. Al confirmar el proyecto te damos una fecha estimada de entrega e instalación.",
      wa: "Hola! Quiero consultar plazos de entrega para una cocina."
    },
    {
      chip: "📐 Proyecto 3D",
      keys: ["diseno", "3d", "render", "proyecto", "plano", "medida", "medidas", "arquitecto", "relevamiento"],
      a: "Diseñamos tu cocina en 3D junto con vos (o con tu arquitecto). Podemos trabajar sobre planos existentes o hacer un relevamiento de medidas en obra. Así ves cómo queda antes de fabricarla.",
      wa: "Hola! Quiero empezar el diseño 3D de mi cocina."
    },
    {
      chip: "🔧 Instalación",
      keys: ["instalacion", "instalan", "montaje", "colocacion", "armado", "garantia", "posventa", "service"],
      a: "Brindamos un servicio integral de instalación y te acompañamos en la posventa. Los detalles de garantía dependen de cada componente: un asesor te los explica según tu proyecto.",
      wa: "Hola! Quiero consultar sobre instalación y garantía."
    },
    {
      chip: "🗺️ Zonas",
      keys: ["zona", "cipolletti", "plottier", "roca", "bariloche", "patagonia", "rio negro", "envio", "envian", "interior", "provincia", "centenario", "vaca muerta", "anelo", "san martin"],
      a: "Atendemos proyectos en Neuquén, el Alto Valle y toda la Patagonia. Contanos dónde es tu obra y te confirmamos logística e instalación.",
      wa: "Hola! Tengo una obra fuera de Neuquén Capital y quiero consultar si llegan."
    },
    {
      chip: "🍳 Modelos",
      keys: ["modelo", "modelos", "brera", "clover", "immagina", "round", "nexa", "materia", "flavour", "tablet", "creo", "coleccion", "estilo", "catalogo", "linea"],
      a: "Trabajamos cocinas italianas de alta gama de Cucine LUBE: NEXA (puertas en FENIX), BRERA (madera natural), MATERIA, IMMAGINA, FLAVOUR (línea clásica), CLOVER y ROUND, además de la cocina Tablet de CREO Kitchens (Grupo LUBE). En el showroom podés verlas y tocarlas.\n¿Querés que te mandemos el catálogo?",
      wa: "Hola! ¿Me pueden enviar el catálogo de modelos de Cucine LUBE?"
    },
    {
      chip: "🎨 Materiales",
      keys: ["material", "color", "colores", "terminacion", "laca", "lacado", "madera", "encimera", "mesada", "fenix", "hpl", "puerta", "tirador"],
      a: "Podés elegir entre cientos de combinaciones: puertas en madera, lacados mate o brillantes, FENIX, vidrio; encimeras en laminado, HPL, FENIX, cuarzo o piedra; y distintos sistemas de apertura. Te asesoramos en el showroom con muestras reales.",
      wa: "Hola! Quiero asesoramiento sobre materiales y terminaciones."
    },
    {
      chip: "🔌 Electrodomésticos",
      keys: ["electrodomestico", "horno", "heladera", "anafe", "induccion", "lavavajillas", "campana", "bacha", "pileta", "grifo"],
      a: "Integramos electrodomésticos, bachas y griferías en el proyecto para que todo quede a medida. Contanos cuáles tenés pensados y los incluimos en el diseño.",
      wa: "Hola! Quiero consultar por electrodomésticos integrados en la cocina."
    },
    {
      chip: "💳 Formas de pago",
      keys: ["pago", "pagar", "financiacion", "financiar", "cuotas", "tarjeta", "transferencia", "dolares", "pesos", "efectivo"],
      a: "Las formas de pago y financiación se definen según cada proyecto. Un asesor te detalla las opciones vigentes por WhatsApp.",
      wa: "Hola! Quiero consultar formas de pago y financiación."
    },
    {
      chip: "🛋️ Vestidores y living",
      keys: ["living", "mesa", "mesas", "silla", "sillas", "placard", "placares", "vestidor", "vestidores", "mueble", "muebles", "bano"],
      a: "Además de cocinas, como store oficial de Grupo LUBE ofrecemos vestidores y placares a medida, y soluciones de living, mesas y sillas con el mismo estilo italiano. Consultanos qué necesitás.",
      wa: "Hola! Quiero consultar por vestidores, placares o living LUBE."
    }
  ];

  const GREETING = "¡Hola! 👋 Soy el asistente de Cucine LUBE Neuquén.\nPreguntame lo que quieras sobre nuestras cocinas italianas, o elegí una opción rápida. Cuando quieras, seguimos por WhatsApp con un asesor.";
  const FALLBACK = "Buena pregunta. Para darte una respuesta precisa, te conecto con un asesor del showroom por WhatsApp. Tu consulta ya queda escrita en el mensaje 👇";

  const $ = (id) => document.getElementById(id);
  const fab = $("assistFab"), box = $("assist"), log = $("assistLog"),
        chips = $("assistChips"), form = $("assistForm"), input = $("assistText");
  let started = false;

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  function match(q) {
    const t = norm(q);
    let best = null, score = 0;
    FAQ.forEach((f) => {
      const s = f.keys.reduce((n, k) => n + (t.includes(k) ? k.length : 0), 0);
      if (s > score) { score = s; best = f; }
    });
    return best;
  }

  function add(text, who, waMsg) {
    const div = document.createElement("div");
    div.className = "msg msg--" + who;
    div.textContent = text;
    if (waMsg) {
      const a = document.createElement("a");
      a.className = "msg__wa";
      a.href = window.waLink(waMsg);
      a.target = "_blank"; a.rel = "noopener";
      a.textContent = "Seguir por WhatsApp";
      div.appendChild(document.createElement("br"));
      div.appendChild(a);
    }
    log.appendChild(div);
    log.scrollTop = log.scrollHeight;
  }

  function botReply(text, waMsg) {
    const t = document.createElement("div");
    t.className = "msg msg--bot typing";
    t.innerHTML = "<i></i><i></i><i></i>";
    log.appendChild(t); log.scrollTop = log.scrollHeight;
    setTimeout(() => { t.remove(); add(text, "bot", waMsg); }, 550);
  }

  function ask(q) {
    q = q.trim(); if (!q) return;
    add(q, "user");
    const f = match(q);
    if (f) botReply(f.a, f.wa + "\n\nMi consulta: " + q);
    else botReply(FALLBACK, "Hola! Tengo una consulta: " + q);
  }

  FAQ.filter((f) => f.chip).forEach((f) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "chip"; b.textContent = f.chip;
    b.addEventListener("click", () => {
      add(f.chip.replace(/^\S+\s/, ""), "user");
      botReply(f.a, f.wa);
    });
    chips.appendChild(b);
  });

  function open(state) {
    box.hidden = !state;
    fab.setAttribute("aria-expanded", state);
    fab.classList.add("is-seen");
    if (state && !started) { started = true; botReply(GREETING); }
    if (state) setTimeout(() => input.focus(), 50);
  }
  fab.addEventListener("click", () => open(box.hidden));
  $("assistClose").addEventListener("click", () => open(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) open(false); });
  form.addEventListener("submit", (e) => { e.preventDefault(); ask(input.value); input.value = ""; });
})();
