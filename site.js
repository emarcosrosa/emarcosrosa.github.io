/* Marcos Rosa — Livros · comportamento compartilhado */
(function () {
  "use strict";

  /* Entrada das partes de cada seção, uma vez só */
  var items = document.querySelectorAll("[data-reveal], [data-rise]");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }
  /* Rede de segurança: nada fica escondido se o observer falhar */
  setTimeout(function () { items.forEach(function (el) { el.classList.add("in"); }); }, 4000);

  /* Rastreamento de clique na Amazon (GA4), se disponível */
  document.querySelectorAll('a[href*="amazon.com.br"]').forEach(function (a) {
    a.addEventListener("click", function () {
      if (typeof window.gtag === "function") {
        window.gtag("event", "click_amazon", { book: a.dataset.book || document.title, location: a.dataset.where || "" });
      }
    });
  });

  /* ---------- Página inicial: "Por onde começar?" ---------- */
  var chooser = document.querySelector("[data-chooser]");
  if (chooser) {
    var opts = chooser.querySelectorAll("[data-pick]");
    var panels = chooser.querySelectorAll("[data-answer]");
    function pick(id, focus) {
      opts.forEach(function (o) {
        var on = o.dataset.pick === id;
        o.setAttribute("aria-pressed", on ? "true" : "false");
      });
      panels.forEach(function (p) {
        var on = p.dataset.answer === id;
        p.hidden = !on;
        if (on) { p.classList.remove("swap"); void p.offsetWidth; p.classList.add("swap"); }
      });
    }
    opts.forEach(function (o) {
      o.addEventListener("click", function (ev) { ev.preventDefault(); pick(o.dataset.pick); });
    });
    chooser.classList.add("is-live");
    pick(opts[0].dataset.pick);
  }

  /* ---------- Python: o primeiro programa ---------- */
  var py = document.querySelector("[data-py]");
  if (py) {
    var nome = py.querySelector("#py-nome");
    var meta = py.querySelector("#py-meta");
    var horas = py.querySelector("#py-horas");
    var outN = py.querySelectorAll("[data-v=nome]");
    var outM = py.querySelectorAll("[data-v=meta]");
    var outH = py.querySelectorAll("[data-v=horas]");
    var result = py.querySelector("[data-out]");
    function clean(s, fallback) {
      s = (s || "").replace(/[\"\\]/g, "").trim();
      return s || fallback;
    }
    function run() {
      var n = clean(nome.value, "Ana");
      var m = meta.value;
      var h = Math.max(1, Math.min(40, parseInt(horas.value, 10) || 1));
      outN.forEach(function (el) { el.textContent = n; });
      outM.forEach(function (el) { el.textContent = m; });
      outH.forEach(function (el) { el.textContent = h; });
      var semanas = Math.ceil(13 / Math.max(1, Math.floor(h / 2)));
      var linhas = [
        "Olá, " + n + "! Bora ser fera em Python.",
        "Objetivo: " + m,
        semanas <= 1
          ? "Com " + h + "h por semana, você passa pelos 13 temas em cerca de 1 semana."
          : "Com " + h + "h por semana, você passa pelos 13 temas em cerca de " + semanas + " semanas."
      ];
      result.textContent = linhas.join("\n");
      result.classList.remove("blink"); void result.offsetWidth; result.classList.add("blink");
    }
    [nome, meta, horas].forEach(function (el) { el.addEventListener("input", run); el.addEventListener("change", run); });
    run();
  }

  /* ---------- IA: o fluxo da pesquisa ---------- */
  var flow = document.querySelector("[data-flow]");
  if (flow) {
    var steps = flow.querySelectorAll("[data-step]");
    var details = flow.querySelectorAll("[data-detail]");
    function show(id) {
      steps.forEach(function (s) { s.setAttribute("aria-selected", s.dataset.step === id ? "true" : "false"); s.tabIndex = s.dataset.step === id ? 0 : -1; });
      details.forEach(function (d) { d.hidden = d.dataset.detail !== id; });
    }
    steps.forEach(function (s, i) {
      s.addEventListener("click", function () { show(s.dataset.step); });
      s.addEventListener("keydown", function (e) {
        var k = e.key, next = null;
        if (k === "ArrowDown" || k === "ArrowRight") next = steps[(i + 1) % steps.length];
        if (k === "ArrowUp" || k === "ArrowLeft") next = steps[(i - 1 + steps.length) % steps.length];
        if (next) { e.preventDefault(); next.focus(); show(next.dataset.step); }
      });
    });
    flow.classList.add("is-live");
    show(steps[0].dataset.step);
  }

  /* ---------- UML: código vira diagrama ---------- */
  var uml = document.querySelector("[data-uml]");
  if (uml) {
    var tabs = uml.querySelectorAll("[data-tab]");
    var panes = uml.querySelectorAll("[data-pane]");
    function sel(id) {
      tabs.forEach(function (t) { var on = t.dataset.tab === id; t.setAttribute("aria-selected", on ? "true" : "false"); t.tabIndex = on ? 0 : -1; });
      panes.forEach(function (p) {
        var on = p.dataset.pane === id; p.hidden = !on;
        if (on) { p.classList.remove("draw"); void p.offsetWidth; p.classList.add("draw"); }
      });
    }
    tabs.forEach(function (t, i) {
      t.addEventListener("click", function () { sel(t.dataset.tab); });
      t.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (n) { e.preventDefault(); n.focus(); sel(n.dataset.tab); }
      });
    });
    uml.classList.add("is-live");
    sel(tabs[0].dataset.tab);
  }
})();
