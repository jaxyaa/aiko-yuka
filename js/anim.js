(function () {
  var D = document, H = D.documentElement;
  var rm = matchMedia("(prefers-reduced-motion:reduce)").matches, fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  H.classList.add("js");
  function $(s) { return Array.prototype.slice.call(D.querySelectorAll(s)); }
  var hs = $(".hero")[0];

  /* ---- preloader (sekali per sesi, hanya halaman utama) ---- */
  function go() { H.classList.remove("pl-on"); H.classList.add("go"); }
  if (H.classList.contains("pl-on") && hs && !rm) {
    sessionStorage.setItem("pl", 1);
    var pl = D.createElement("div"); pl.className = "pl"; pl.innerHTML = "<span>Aiko Yuka</span><b class='n'>0</b><i></i>"; D.body.appendChild(pl);
    var n = pl.querySelector(".n"), bar = pl.querySelector("i"), t0 = performance.now();
    (function tick(t) {
      var p = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - p, 2.2);
      n.textContent = Math.round(e * 100); bar.style.width = e * 100 + "%";
      if (p < 1) return requestAnimationFrame(tick);
      setTimeout(function () { pl.classList.add("out"); H.classList.remove("pl-on"); setTimeout(go, 350); setTimeout(function () { pl.remove(); }, 1100); }, 200);
    })(t0);
  } else go();

  /* ---- util ---- */
  function splitChars(el) {
    var i = 0; el.setAttribute("aria-label", el.textContent.trim());
    Array.prototype.slice.call(el.childNodes).forEach(function (nd) {
      if (nd.nodeType != 3) return; var f = D.createDocumentFragment();
      nd.textContent.split("").forEach(function (c) {
        if (/\s/.test(c)) { f.appendChild(D.createTextNode(" ")); return; }
        var s = D.createElement("span"); s.className = "ch"; s.setAttribute("aria-hidden", "true"); s.style.setProperty("--i", i++); s.textContent = c; f.appendChild(s);
      });
      nd.replaceWith(f);
    });
  }
  function splitLines(el) {
    var i = 0;
    Array.prototype.slice.call(el.childNodes).forEach(function (nd) {
      if (nd.nodeType != 3 || !nd.textContent.trim()) return;
      var s = D.createElement("span"); s.className = "ln"; s.style.setProperty("--i", i++); s.textContent = nd.textContent; nd.replaceWith(s);
    });
    el.classList.add("rvh");
  }
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return; var t = e.target; t.classList.add("in"); io.unobserve(t);
      setTimeout(function () { t.style.removeProperty("--d"); }, 1600);
    });
  }, { threshold: 0.18 }) : null;
  function obs(el) { if (io) io.observe(el); else el.classList.add("in"); }
  function rv(el, d) { if (el.classList.contains("rv")) return; el.classList.add("rv"); if (d) el.style.setProperty("--d", d + "s"); obs(el); }

  var h1 = $(".hero h1")[0]; if (h1) splitChars(h1);
  $(".split h2,.page h1").forEach(function (h) { splitLines(h); obs(h); });
  $(".split p,.btn,.chips,.page>p").forEach(function (e) { rv(e, 0.1); });
  $("dt,dd").forEach(function (e, i) { rv(e, 0.15 + i * 0.07); });
  $(".disc").forEach(function (d) { d.classList.add("rv"); obs(d); });
  $(".tile").forEach(function (t, i) { rv(t, 0.2 + i * 0.14); });
  var grid = D.getElementById("grid");
  function prep() { $("#grid .card").forEach(function (c, i) { rv(c, (i % 4) * 0.09); }); $("#grid .sec").forEach(function (s) { rv(s); }); tiltCards(); }
  function tiltCards() {
    if (!fine || rm) return;
    $("#grid .card").forEach(function (c) {
      if (c._t) return; c._t = 1;
      c.addEventListener("pointermove", function (e) { var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; c.style.setProperty("--rx", (x - 0.5) * 12); c.style.setProperty("--ry", -(y - 0.5) * 12); c.style.setProperty("--gx", x * 100 + "%"); c.style.setProperty("--gy", y * 100 + "%"); });
      c.addEventListener("pointerleave", function () { c.style.setProperty("--rx", 0); c.style.setProperty("--ry", 0); });
    });
  }
  if (grid) { prep(); new MutationObserver(prep).observe(grid, { childList: true, subtree: true }); }

  var pb = D.createElement("div"); pb.className = "pb"; D.body.appendChild(pb);
  var vel = 0, lastY = scrollY;
  function sp() { var m = H.scrollHeight - innerHeight; pb.style.transform = "scaleX(" + (m > 0 ? scrollY / m : 0) + ")"; if (hs) hs.style.setProperty("--sy", Math.min(scrollY, innerHeight)); }
  addEventListener("scroll", sp, { passive: true }); sp();

  /* ---- hero: badge, stiker, pita, glitch ---- */
  if (hs) {
    function band(cls, dir, items) {
      var half = ""; for (var k = 0; k < 3; k++) items.forEach(function (x) { half += "<span>" + x + '</span><i class="dot"></i>'; });
      var el = D.createElement("div"); el.className = "mq " + cls; el.setAttribute("aria-hidden", "true"); el.innerHTML = '<div class="mq-t">' + half + half + "</div>";
      return { el: el, t: el.firstChild, x: 0, dir: dir };
    }
    var a = band("a", 1, ["Desain Komunikasi Visual", "SMK Negeri 5 Malang"]), b = band("b", -1, ["Paskibra", "Pramuka", "Aiko Yuka"]);
    hs.after(a.el); a.el.after(b.el); b.x = -1;
    if (!rm) {
      (function f() {
        var y = scrollY; vel += ((y - lastY) - vel) * 0.15; lastY = y;
        [a, b].forEach(function (m) {
          var w = m.t.scrollWidth / 2 || 1; m.x -= (1.3 + vel * 0.6) * m.dir;
          if (m.x <= -w) m.x += w; if (m.x > 0) m.x -= w;
          m.t.style.transform = "translate3d(" + m.x + "px,0,0) skewX(" + Math.max(-14, Math.min(14, -vel * 0.5 * m.dir)) + "deg)";
        });
        requestAnimationFrame(f);
      })();
      var svg = '<svg class="badge" viewBox="0 0 120 120" aria-hidden="true"><defs><path id="bc" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0"/></defs><text><textPath href="#bc" textLength="270" lengthAdjust="spacing">DKV • PASKIBRA • PRAMUKA • </textPath></text><circle cx="60" cy="60" r="7"/></svg>';
      hs.insertAdjacentHTML("beforeend", svg);
      [["DKV", "62%", "10%", -8], ["Paskibra", "6%", "58%", 6], ["Pramuka", "72%", "64%", -5]].forEach(function (s, k) {
        var e = D.createElement("div"); e.className = "stk"; e.textContent = s[0]; e.style.cssText = "left:" + s[1] + ";top:" + s[2] + ";--r:" + s[3] + "deg;--k:" + k;
        hs.appendChild(e);
        var sx, sy, ox, oy;
        e.addEventListener("pointerdown", function (ev) { e.setPointerCapture(ev.pointerId); var r = e.getBoundingClientRect(), hr = hs.getBoundingClientRect(); sx = ev.clientX; sy = ev.clientY; ox = r.left - hr.left; oy = r.top - hr.top; e.classList.add("drag"); });
        e.addEventListener("pointermove", function (ev) { if (e.classList.contains("drag")) { e.style.left = ox + ev.clientX - sx + "px"; e.style.top = oy + ev.clientY - sy + "px"; } });
        e.addEventListener("pointerup", function () { e.classList.remove("drag"); });
      });
      (function glitch() { h1.classList.add("gl"); setTimeout(function () { h1.classList.remove("gl"); }, 500); setTimeout(glitch, 3500 + Math.random() * 3000); })();
      h1.addEventListener("pointerenter", function () { h1.classList.remove("gl"); void h1.offsetWidth; h1.classList.add("gl"); });
      if (fine) {
        hs.addEventListener("pointermove", function (e) { var r = hs.getBoundingClientRect(); hs.style.setProperty("--mx", ((e.clientX - r.left) / r.width - 0.5) * 2); hs.style.setProperty("--my", ((e.clientY - r.top) / r.height - 0.5) * 2); });
        hs.addEventListener("pointerleave", function () { hs.style.setProperty("--mx", 0); hs.style.setProperty("--my", 0); });
      }
    }
  }
  if (rm) return;

  /* ---- scramble menu ---- */
  $(".nav a").forEach(function (l) {
    var o = l.textContent, busy;
    l.addEventListener("pointerenter", function () {
      if (busy) return; busy = 1; var f = 0, ch = "ABCDEFGHJKLMNPRSTUVWXYZ#%*";
      var iv = setInterval(function () { l.textContent = o.split("").map(function (c, i) { return i < f / 2 ? c : ch[Math.floor(Math.random() * ch.length)]; }).join(""); if (++f > o.length * 2) { clearInterval(iv); l.textContent = o; busy = 0; } }, 30);
    });
  });

  if (fine) {
    $(".disc").forEach(function (d) {
      d.addEventListener("pointermove", function (e) { var r = d.getBoundingClientRect(); d.style.setProperty("--tx", ((e.clientX - r.left) / r.width - 0.5) * 18); d.style.setProperty("--ty", -((e.clientY - r.top) / r.height - 0.5) * 18); });
      d.addEventListener("pointerleave", function () { d.style.setProperty("--tx", 0); d.style.setProperty("--ty", 0); });
    });
    $(".btn").forEach(function (b) {
      b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.25 + "px," + (e.clientY - r.top - r.height / 2) * 0.35 + "px)"; });
      b.addEventListener("pointerleave", function () { b.style.transform = ""; });
    });
    var c = D.createElement("div"); c.className = "cur"; D.body.appendChild(c);
    var x = 0, y = 0, tx = 0, ty = 0;
    addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; c.style.opacity = 1; });
    (function f() { x += (tx - x) * 0.2; y += (ty - y) * 0.2; c.style.transform = "translate3d(" + x + "px," + y + "px,0)"; requestAnimationFrame(f); })();
    D.addEventListener("pointerover", function (e) {
      var t = e.target, l = t.closest(".card") ? "LIHAT" : t.closest(".stk") ? "DRAG" : t.classList.contains("cut") ? "KLIK!" : "";
      c.textContent = l; c.classList.toggle("big", !!l || !!t.closest("a,button"));
    });
  }
  /* ---- klik foto = confetti ---- */
  D.addEventListener("click", function (e) {
    if (!e.target.classList.contains("cut")) return;
    var cols = ["#d7ff4f", "#8fae5c", "#4e6b2f", "#eef3e3", "#c9d6b4"];
    for (var i = 0; i < 40; i++) {
      var p = D.createElement("i"), an = Math.random() * 6.283, d = 90 + Math.random() * 180; p.className = "cf";
      p.style.cssText = "left:" + e.clientX + "px;top:" + e.clientY + "px;background:" + cols[i % 5] + ";border-radius:" + (i % 3 ? "2px" : "50%") + ";--x:" + Math.cos(an) * d + "px;--y:" + (Math.sin(an) * d + 60) + "px";
      D.body.appendChild(p); setTimeout(function (n) { n.remove(); }.bind(null, p), 1050);
    }
  });
})();
