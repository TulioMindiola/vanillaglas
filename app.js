/* Vanillaglas — the order is built across the page and lands in Daniela's WhatsApp */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const WA = "573185276376";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const wide = matchMedia("(min-width: 901px)");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  const SIZES = {
    mini: { name: "Mini Cake", long: "Mini Cake (2 a 4 porciones)", max: 24, perLine: 11, r: 196 },
    68: { name: "torta de 6 a 8", long: "6 a 8 porciones", max: 36, perLine: 13, r: 218 },
    1016: { name: "torta de 10 a 16", long: "10 a 16 porciones", max: 48, perLine: 15, r: 234 },
    1624: { name: "torta de 16 a 24", long: "16 a 24 porciones", max: 60, perLine: 17, r: 246 },
    2840: { name: "torta de 28 a 40", long: "28 a 40 porciones", max: 72, perLine: 19, r: 256 },
  };
  const ORDER = ["mini", "68", "1016", "1624", "2840"];
  const COVERS = {
    crema: { top: "#fbefd9", border: "#f3e0bd", ridge: "#dcc193", dots: "#c4202e", pipe: "#c4202e" },
    roja: { top: "#c4202e", border: "#a8162a", ridge: "#7f0f1f", dots: "#fff3dc", pipe: "#fff3dc" },
    rosada: { top: "#f7c3d6", border: "#ee95b9", ridge: "#cf6f97", dots: "#bc347b", pipe: "#bc347b" },
    fucsia: { top: "#bc347b", border: "#a32a69", ridge: "#7e1f51", dots: "#f6d89e", pipe: "#f6d89e" },
    lavanda: { top: "#e6d9ff", border: "#cbb5f6", ridge: "#a98be3", dots: "#2a0b1f", pipe: "#2a0b1f" },
  };

  const state = { size: "mini", forma: "redonda", relleno: "Vainilla con mora", frase: "", cobertura: "crema", fecha: "", diseno: "" };

  /* ---------- small helpers ---------- */
  const say = (el, text) => { if (el) el.textContent = text; };
  const bogotaToday = () => {
    const p = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    return new Date(p + "T12:00:00");
  };
  const iso = (d) => d.toISOString().slice(0, 10);
  const prettyDate = (v) => {
    if (!v) return "";
    const d = new Date(v + "T12:00:00");
    return new Intl.DateTimeFormat("es-CO", { weekday: "long", day: "numeric", month: "long" }).format(d);
  };

  /* ---------- whatsapp message ---------- */
  const send = $("#send");
  function message() {
    const s = SIZES[state.size];
    const lines = ["Hola Daniela, quiero cotizar una torta en Vanillaglas:"];
    lines.push(`• Tamaño: ${s.long}${state.size !== "mini" && state.size !== "2840" ? ", " + state.forma : ""}`);
    lines.push(`• Relleno: ${state.relleno}`);
    if (state.diseno) lines.push(`• Diseño de referencia: ${state.diseno}`);
    if (state.frase.trim()) lines.push(`• Frase en crema: "${state.frase.trim()}"`);
    lines.push(`• Cobertura: ${state.cobertura}`);
    if (state.fecha) lines.push(`• Fecha: ${prettyDate(state.fecha)}`);
    lines.push("¿Me cuentas precio y disponibilidad? Gracias.");
    return lines.join("\n");
  }
  function syncLink() { if (send) send.href = `https://wa.me/${WA}?text=${encodeURIComponent(message())}`; }

  /* ---------- header: fixed after the hero, tab takes the chapter colour ---------- */
  const bar = $("#bar");
  const brand = $(".bar-brand");
  const setBrandW = () => document.documentElement.style.setProperty("--brand-w", brand.offsetWidth + "px");
  setBrandW(); addEventListener("resize", setBrandW);
  const hero = $("#inicio");
  new IntersectionObserver(([e]) => {
    const past = !e.isIntersecting && e.boundingClientRect.top < 0;
    bar.classList.toggle("is-fixed", past);
  }, { threshold: 0, rootMargin: "-80px 0px 0px 0px" }).observe(hero);

  // [tab, tab ink, button, button ink] per chapter
  const CH = {
    paper: ["var(--magenta)", "var(--cream)", "var(--ink)", "var(--cream)"], magenta: ["var(--magenta)", "var(--cream)", "var(--ink)", "var(--cream)"],
    butter: ["var(--butter)", "var(--ink)", "var(--magenta)", "var(--cream)"], ink: ["var(--ink)", "var(--lavender)", "var(--magenta)", "var(--cream)"],
    pink: ["var(--pink)", "var(--ink)", "var(--ink)", "var(--cream)"], lavender: ["var(--lavender)", "var(--ink)", "var(--magenta)", "var(--cream)"],
  };
  const tabLinks = $$(".bar-tab a");
  const chapters = $$("[data-chapter]");
  const spy = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const [bg, ink, cta, ctaInk] = CH[e.target.dataset.chapter] || CH.paper;
      bar.style.setProperty("--tab", bg); bar.style.setProperty("--tab-ink", ink);
      bar.style.setProperty("--cta", cta); bar.style.setProperty("--cta-ink", ctaInk);
      const id = e.target.id;
      tabLinks.forEach((a) => a.classList.toggle("is-on", id && a.getAttribute("href") === "#" + id));
    }
  }, { rootMargin: "-62px 0px -88% 0px" });
  chapters.forEach((c) => spy.observe(c));

  /* ---------- hero mosaic ---------- */
  $$(".mosaic .m").forEach((m, i) => m.style.setProperty("--k", [0, 3, 1, 4, 2, 5, 2, 6, 7, 8][i] ?? i));
  const cycles = $$("[data-cycle]");
  if (!reduce.matches) cycles.forEach((fig, n) => {
    const imgs = $$("img", fig); let i = 0;
    setTimeout(() => setInterval(() => {
      if (document.hidden) return;
      imgs[i].classList.remove("is-on"); i = (i + 1) % imgs.length; imgs[i].classList.add("is-on");
    }, 4200), 1800 + n * 2100);
  });

  /* ---------- entrances ---------- */
  const rise = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); rise.unobserve(e.target); }
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
  $$(".ch").forEach((sec) => $$("[data-rise]", sec).forEach((el, i) => { el.style.setProperty("--d", (i % 6) * 80 + "ms"); rise.observe(el); }));
  $$(".lines-scroll").forEach((el) => rise.observe(el));

  /* ---------- videos only play on screen ---------- */
  const vio = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting && !reduce.matches) v.play().catch(() => {}); else v.pause();
    }
  }, { threshold: 0.15 });
  $$("video[autoplay]").forEach((v) => { if (reduce.matches) { v.removeAttribute("autoplay"); v.pause(); } vio.observe(v); });

  /* ---------- showcase: cards cross the stage while the V is piped behind them ---------- */
  const sc = $("[data-showcase]");
  const track = sc && $(".sc-track", sc);
  const head = sc && $(".sc-head", sc);
  const line = sc && $(".sc-line-path", sc);
  let scTicking = false;
  function showcase() {
    scTicking = false;
    if (!sc) return;
    if (!wide.matches) { track.style.removeProperty("--x"); head.style.removeProperty("--head-x"); return; }
    const r = sc.getBoundingClientRect();
    const vh = innerHeight, vw = sc.clientWidth;
    const p = clamp(-r.top / (r.height - vh), 0, 1);
    const cards = track.children; const first = cards[0], last = cards[cards.length - 1];
    const cw = first.offsetWidth;
    const x0 = vw - Math.min(360, cw * 0.52);
    const x1 = vw / 2 - (last.offsetLeft + cw / 2);
    const x = x0 + (x1 - x0) * p;
    track.style.setProperty("--x", x.toFixed(1) + "px");
    // the first card pushes the heading out once it reaches it
    const headRight = head.offsetLeft + head.offsetWidth + 48;
    head.style.setProperty("--head-x", Math.min(0, x - headRight).toFixed(1) + "px");
    if (line) line.style.setProperty("--draw", reduce.matches ? 0 : (1 - clamp(p * 1.25 + 0.08, 0, 1)).toFixed(3));
    // each cake rises and settles as its card reaches the middle of the stage
    if (!reduce.matches) for (const card of cards) {
      const mid = x + card.offsetLeft + cw / 2 - vw / 2;
      const d = clamp(mid / (vw * 0.6), -1, 1);
      card.style.setProperty("--lift", (Math.abs(d) * 14).toFixed(1) + "%");
      card.style.setProperty("--tilt", (d * 7).toFixed(2) + "deg");
    }
  }
  /* ---------- sabores: cards fold into spines ---------- */
  const sb = $("[data-spines]");
  const band = sb && $(".sb-band", sb);
  const sbCards = sb ? $$(".sbcard", sb) : [];
  let sbActive = -1;
  sbCards.forEach((c) => { const s = document.createElement("span"); s.className = "sbcard-spine"; s.setAttribute("aria-hidden", "true"); s.textContent = $("h3", c).textContent; c.append(s); });
  function setSpine(active) {
    if (active === sbActive) return; sbActive = active;
    sbCards.forEach((c, i) => c.classList.toggle("is-spine", i < active));
  }
  function spines() {
    if (!sb) return;
    if (!wide.matches) { setSpine(0); return; }
    const cw = 620 > band.clientWidth * 0.5 ? Math.round(band.clientWidth * 0.46) : 620;
    band.style.setProperty("--spine", Math.floor(Math.min(120, (band.clientWidth - cw) / (sbCards.length - 1))) + "px");
    const r = sb.getBoundingClientRect();
    const p = clamp(-r.top / (r.height - innerHeight), 0, 0.999);
    setSpine(Math.floor(p * sbCards.length));
  }
  const goSpine = (i) => {
    const top = sb.getBoundingClientRect().top + scrollY;
    const span = sb.offsetHeight - innerHeight;
    scrollTo({ top: top + span * ((i + 0.45) / sbCards.length), behavior: reduce.matches ? "auto" : "smooth" });
  };
  sbCards.forEach((c, i) => {
    c.addEventListener("click", (ev) => { if (c.classList.contains("is-spine") && wide.matches) { ev.preventDefault(); goSpine(i); } });
    c.addEventListener("focusin", () => { if (wide.matches && i !== sbActive) goSpine(i); });
  });

  const onScroll = () => { if (!scTicking) { scTicking = true; requestAnimationFrame(() => { showcase(); spines(); }); } };
  addEventListener("scroll", onScroll, { passive: true });
  addEventListener("resize", onScroll);
  showcase(); spines();

  /* ---------- tamaños: accordion + guests ---------- */
  const acc = $("[data-acc]");
  const panels = acc ? $$(".acc-panel", acc) : [];
  const sizePicked = $("#size-picked");
  function openPanel(key, focus) {
    panels.forEach((p) => {
      const on = p.dataset.size === key;
      p.classList.toggle("is-open", on);
      $(".acc-tab", p).setAttribute("aria-expanded", on);
      $(".acc-body", p).inert = !on;
    });
    if (focus) { const p = panels.find((x) => x.dataset.size === key); $("h3", p)?.setAttribute("tabindex", "-1"); }
  }
  panels.forEach((p) => {
    $(".acc-tab", p).addEventListener("click", () => openPanel(p.dataset.size, true));
    $$(".forms button", p).forEach((b) => b.addEventListener("click", () => {
      $$(".forms button", p).forEach((x) => x.setAttribute("aria-pressed", x === b));
      const img = $(".acc-photo img", p);
      img.style.opacity = 0;
      setTimeout(() => { img.src = b.dataset.img; img.onload = () => (img.style.opacity = 1); }, reduce.matches ? 0 : 200);
      p.dataset.forma = b.dataset.forma;
    }));
    $(".acc-pick", p).addEventListener("click", () => {
      state.size = p.dataset.size; state.forma = p.dataset.forma || "redonda";
      $("#f-size").value = state.size;
      sizePicked.innerHTML = "";
      sizePicked.append(`Listo: ${SIZES[state.size].long}${state.size !== "mini" && state.size !== "2840" ? ", " + state.forma : ""}. `);
      const a = document.createElement("a"); a.href = "#sabores"; a.textContent = "Ahora elige el relleno"; a.className = "link"; sizePicked.append(a);
      renderCake(); syncLink();
    });
  });
  openPanel("mini");
  const guestsN = $("#guests-n");
  let guests = 12;
  const sizeFor = (n) => (n <= 4 ? "mini" : n <= 10 ? "68" : n <= 16 ? "1016" : n <= 24 ? "1624" : "2840");
  function setGuests(n) { guests = clamp(n, 1, 60); guestsN.value = guests; guestsN.textContent = guests; openPanel(sizeFor(guests)); }
  $$(".guests-btn").forEach((b) => b.addEventListener("click", () => setGuests(guests + Number(b.dataset.step))));
  setGuests(12);

  /* ---------- sabores picks ---------- */
  const rellenoPicked = $("#relleno-picked");
  $$(".sb-pick").forEach((b) => b.addEventListener("click", (ev) => {
    ev.stopPropagation();
    state.relleno = b.dataset.relleno;
    $$(".sb-pick").forEach((x) => x.setAttribute("aria-pressed", x === b));
    $("#f-relleno").value = state.relleno;
    say(rellenoPicked, `Elegiste ${state.relleno.toLowerCase()}.`);
    syncLink();
  }));
  $$(".sb-pick").forEach((b) => b.setAttribute("aria-pressed", "false"));

  /* ---------- tortas: reference design ---------- */
  $$(".tcard-pick").forEach((b) => b.addEventListener("click", () => {
    const on = b.getAttribute("aria-pressed") !== "true";
    $$(".tcard-pick").forEach((x) => { x.setAttribute("aria-pressed", "false"); x.textContent = "Quiero una así"; });
    b.setAttribute("aria-pressed", on);
    if (on) b.textContent = "Elegida para tu pedido";
    state.diseno = on ? b.dataset.design : "";
    syncLink();
  }));
  $$(".tcard-pick").forEach((b) => b.setAttribute("aria-pressed", "false"));

  /* ---------- the live mini: your phrase piped in cream ---------- */
  const NS = "http://www.w3.org/2000/svg";
  const cake = $("#cake");
  const body = $("#cake-body");
  const gText = $("#cake-text");
  const gShells = $("#cake-shells");
  const gHearts = $("#cake-hearts");
  const bagG = $("#cake-bag");
  const input = $("#f-frase");
  const count = $("#f-count"), maxEl = $("#f-max"), sizeName = $("#f-size-name"), hint = $("#f-frase-hint"), tooLong = $("#too-long");
  const el = (tag, attrs) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };

  // shells and hearts are drawn once on the 250 radius and the whole cake is scaled per size
  (function drawDecor() {
    const R = 238, N = 34;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      const g = el("g", { transform: `translate(${320 + R * Math.cos(a)} ${320 + R * Math.sin(a)}) rotate(${(a * 180) / Math.PI + 90})` });
      const s = el("path", { class: "shell", d: "M-19 2C-17-13 6-17 23 1C6 16-17 15-19 2Z" });
      s.style.setProperty("--k", i);
      g.append(s, el("path", { class: "shell-line", d: "M-12-3C-3-9 7-8 15-1" }), el("path", { class: "shell-line", d: "M-11 7C-2 11 8 9 15 3" }));
      gShells.append(g);
    }
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + rnd() * 0.3, rr = 186 + rnd() * 14;
      gHearts.append(el("path", { class: "heart", d: "M0 5C-9-2-5-10 0-5C5-10 9-2 0 5Z", transform: `translate(${320 + rr * Math.cos(a)} ${320 + rr * Math.sin(a)}) rotate(${rnd() * 40 - 20}) scale(${1.1 + rnd() * 0.5})` }));
    }
  })();

  function layoutLines(text, perLine) {
    const words = text.trim().split(/\s+/).filter(Boolean);
    const lines = []; let cur = "";
    for (const w of words) {
      if (!cur) cur = w;
      else if ((cur + " " + w).length <= perLine) cur += " " + w;
      else { lines.push(cur); cur = w; }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  let reveal = { total: 0, shown: 0, raf: 0, lines: [] };
  const letters = (s) => s.replace(/\s/g, "").length;

  function renderCake(opts = {}) {
    const s = SIZES[state.size];
    const c = COVERS[state.cobertura];
    for (const [k, v] of Object.entries(c)) cake.style.setProperty("--" + (k === "top" ? "top" : k === "border" ? "border" : k), v);
    body.style.transform = `scale(${(s.r / 250).toFixed(3)})`;

    const raw = state.frase.trim() || "Feliz cumple, Sofi";
    const n = letters(state.frase.trim());
    say(count, n); say(maxEl, s.max); say(sizeName, s.name);
    const over = n > s.max;
    hint.classList.toggle("is-over", over);
    tooLong.hidden = !over;
    $("#size-up").hidden = state.size === "2840";

    let lines = layoutLines(raw, s.perLine);
    const maxLines = state.size === "mini" ? 3 : 4;
    if (lines.length > maxLines + 1) lines = lines.slice(0, maxLines + 1);
    const longest = Math.max(...lines.map((l) => l.length), 4);
    const usable = 330;
    let fs = Math.min(104, usable / (longest * 0.36), 300 / (lines.length * 0.86));
    fs = Math.max(fs, 30);
    const lh = fs * 0.86;
    const y0 = 320 - ((lines.length - 1) * lh) / 2 + fs * 0.3;

    const prevText = reveal.lines.join(" ");
    const appending = raw.startsWith(prevText) && prevText.length > 0 && !opts.restart;
    gText.textContent = "";
    const defs = el("defs", {}); gText.append(defs);
    const g = el("g", { transform: "rotate(-5 320 320)" }); gText.append(g);
    const rows = lines.map((l, i) => {
      const id = "clip-l" + i;
      const cp = el("clipPath", { id }); const rect = el("rect", { x: 0, y: y0 + i * lh - fs, width: 0, height: fs * 1.45 });
      cp.append(rect); defs.append(cp);
      const t = el("text", { class: "cake-word", x: 320, y: y0 + i * lh, "text-anchor": "middle", "font-size": fs.toFixed(1), "clip-path": `url(#${id})` });
      t.textContent = l; g.append(t);
      return { t, rect };
    });
    // measure and place reveal rects at each line's start
    let total = 0;
    rows.forEach((r) => { const w = r.t.getComputedTextLength(); r.w = w; r.x = 320 - w / 2; r.rect.setAttribute("x", r.x - 8); total += w; });
    const keep = appending ? Math.min(reveal.shown, total) : 0;
    reveal = { total, shown: reduce.matches ? total : keep, raf: reveal.raf, lines, rows, fs, y0, lh };
    cancelAnimationFrame(reveal.raf);
    paintReveal();
    if (reveal.shown < total) pipe();
    syncLink();
  }

  function paintReveal() {
    let left = reveal.shown, bx = 320, by = 320, done = true;
    for (const [i, r] of reveal.rows.entries()) {
      const w = clamp(left, 0, r.w);
      r.rect.setAttribute("width", w + (w >= r.w ? 16 : 4));
      if (left > 0 && left <= r.w) { bx = r.x + w; by = reveal.y0 + i * reveal.lh - reveal.fs * 0.28; done = false; }
      left -= r.w;
    }
    // the piping bag follows the end of the line being written (inside the rotated text group)
    const a = (-5 * Math.PI) / 180, dx = bx - 320, dy = by - 320;
    const px = 320 + dx * Math.cos(a) - dy * Math.sin(a), py = 320 + dx * Math.sin(a) + dy * Math.cos(a);
    const sc = SIZES[state.size].r / 250;
    bagG.setAttribute("transform", `translate(${320 + (px - 320) * sc} ${320 + (py - 320) * sc}) rotate(-24) translate(-30 26)`);
    bagG.style.opacity = done || reduce.matches ? 0 : 1;
  }

  function pipe() {
    let last = performance.now();
    const step = (now) => {
      const dt = Math.min(250, now - last); last = now;
      const speed = Math.max(0.55, reveal.total / 2200);
      reveal.shown = Math.min(reveal.total, reveal.shown + dt * speed);
      paintReveal();
      if (reveal.shown < reveal.total) reveal.raf = requestAnimationFrame(step);
      else { bagG.style.opacity = 0; }
    };
    reveal.raf = requestAnimationFrame(step);
  }

  if (input) {
    input.addEventListener("input", () => { state.frase = input.value; renderCake(); });
    $$("input[name=cobertura]").forEach((r) => r.addEventListener("change", () => {
      state.cobertura = r.value; cake.classList.remove("is-piping"); void cake.offsetWidth; cake.classList.add("is-piping"); renderCake();
    }));
    $("#f-size").addEventListener("change", (e) => { state.size = e.target.value; renderCake(); });
    $("#f-relleno").addEventListener("change", (e) => { state.relleno = e.target.value; syncLink(); });
    $("#size-up").addEventListener("click", () => {
      const i = ORDER.indexOf(state.size); const n = letters(state.frase);
      let j = i + 1; while (j < ORDER.length - 1 && SIZES[ORDER[j]].max < n) j++;
      state.size = ORDER[Math.min(j, ORDER.length - 1)]; $("#f-size").value = state.size; renderCake(); input.focus();
    });
    const fecha = $("#f-fecha");
    const t = bogotaToday(); t.setDate(t.getDate() + 1); fecha.min = iso(t);
    fecha.addEventListener("change", () => { state.fecha = fecha.value; syncLink(); });
    $("#order").addEventListener("submit", (e) => e.preventDefault());
  }

  // first piping happens when the cake comes into view
  let piped = false;
  document.fonts.ready.then(() => {
    renderCake({ restart: true });
    reveal.shown = 0; paintReveal(); bagG.style.opacity = 0;
    new IntersectionObserver(([e], o) => {
      if (e.isIntersecting && !piped) { piped = true; o.disconnect(); cake.classList.add("is-piping"); renderCake({ restart: true }); }
    }, { threshold: 0.45 }).observe(cake);
  });

  /* ---------- faq video plays when its answer opens ---------- */
  $$(".faq-list details").forEach((d) => d.addEventListener("toggle", () => {
    const v = $("video", d); if (!v) return;
    if (d.open && !reduce.matches) v.play().catch(() => {}); else v.pause();
  }));

  /* ---------- footer clock, Medellín time ---------- */
  const clock = $("#clock");
  const tick = () => say(clock, new Intl.DateTimeFormat("es-CO", { hour: "numeric", minute: "2-digit", timeZone: "America/Bogota" }).format(new Date()));
  tick(); setInterval(tick, 20000);

  syncLink();
})();
