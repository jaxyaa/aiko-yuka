var S = window.SITE;
document.querySelectorAll("[data-photo]").forEach(function (i) { var p = S.photos[i.dataset.photo]; if (p) i.src = p; });
function media(p, cls) {
  var d = document.createElement("div"); d.className = "ph " + (cls || ""); d.style.aspectRatio = p.ratio || "3/4"; d.textContent = p.title;
  if (!p.img) return d;
  var i = new Image(); i.alt = p.title; i.src = p.img; i.style.aspectRatio = p.ratio || "3/4"; i.className = cls || "";
  i.onerror = function () { i.replaceWith(d); };
  return i;
}
var prev = document.getElementById("preview");
if (prev) S.projects.slice(0, 3).forEach(function (p, n) {
  var a = document.createElement("a"); a.className = "tile"; a.href = "projects.html#p" + n; a.appendChild(media(p, "t")); prev.appendChild(a);
});
var grid = document.getElementById("grid");
if (grid) {
  var cats = S.projects.map(function (p) { return p.category; }).filter(function (c, i, a) { return a.indexOf(c) == i; });
  var fb = document.getElementById("filters"), cur = "Semua", lb = document.getElementById("lb");
  function draw() {
    grid.innerHTML = "";
    cats.forEach(function (c) {
      if (cur != "Semua" && cur != c) return;
      var list = S.projects.map(function (p, i) { return [p, i]; }).filter(function (x) { return x[0].category == c; });
      var r = (list[0][0].ratio || "3/4").split("/"), land = +r[0] > +r[1];
      var h = document.createElement("h2"); h.className = "sec"; h.textContent = c; grid.appendChild(h);
      var g = document.createElement("div"); g.className = "grid " + (land ? "land" : "port"); grid.appendChild(g);
      list.forEach(function (x) {
        var p = x[0], b = document.createElement("button"); b.className = "card"; b.id = "p" + x[1];
        b.appendChild(media(p));
        b.insertAdjacentHTML("beforeend", "<b>" + p.title + "</b><small>" + p.category + " · " + p.year + "</small>");
        b.onclick = function () { show(x[1]); }; g.appendChild(b);
      });
    });
  }
  ["Semua"].concat(cats).forEach(function (c) {
    var b = document.createElement("button"); b.textContent = c; b.className = "chip" + (c == cur ? " on" : "");
    b.onclick = function () { cur = c; fb.querySelectorAll(".chip").forEach(function (x) { x.classList.toggle("on", x == b); }); draw(); };
    fb.appendChild(b);
  });
  function show(i) {
    var p = S.projects[i], inn = lb.querySelector(".inner"); inn.innerHTML = "";
    var m = media(p, "big"); inn.appendChild(m);
    inn.insertAdjacentHTML("beforeend", "<h3>" + p.title + "</h3><small>" + p.category + " · " + p.year + "</small><p>" + p.desc + "</p>");
    lb.hidden = false; lb.querySelector(".x").focus();
  }
  lb.onclick = function (e) { if (e.target == lb || e.target.className == "x") lb.hidden = true; };
  document.onkeydown = function (e) { if (e.key == "Escape") lb.hidden = true; };
  draw();
  var h = location.hash.match(/^#p(\d+)$/); if (h && S.projects[h[1]]) show(+h[1]);
}
