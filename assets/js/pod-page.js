/* NOL POD page: one per POD (pod-premium.html, pod-signature.html, pod-exclusive.html).
   The POD comes from <body data-pod>. Data from catalog.js, buy box from configurator.js. */
(function(){
"use strict";

var C = window.NOL_CATALOG, money = C.money, byId = C.byId, track = window.NOL_track;
function $(id){ return document.getElementById(id); }
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var POD = byId(C.PODS, document.body.getAttribute("data-pod"));
var live = C.launched();
var CAM = '<svg class="ico"><use href="#i-camera"/></svg>';

/* ---------- Buy box with an upgrade nudge (no POD switcher on a product page) ---------- */
var cfg = window.NOL_Configurator.mount($("cfgPod"), { pod: POD.id, upgrade: true, titleTag: "h1", consultHref: "index.html#consult" });

/* ---------- Media gallery ---------- */
var KEY = POD.id.charAt(0).toUpperCase();
var MEDIA = [
  { type:"img", src:POD.img, label:"NOL " + POD.name, shot:POD.shot, note:"Concept render. Final photos follow once the manufacturer is confirmed." },
  { type:"video", label:"See it open", shot:"POD-" + KEY + "-VID", note:"Concept video of the roof opening." },
  { type:"img", src:"assets/frames/29.webp", contain:true, label:"Open", shot:"POD-" + KEY + "-02", note:"Concept visual of the opening mechanism." },
  { type:"img", src:"assets/frames/00.webp", contain:true, label:"Closed", shot:"POD-" + KEY + "-03", note:"Concept visual of the closed POD." },
  { type:"plan", label:"Footprint", note:"Plan view with the clearance needed in front." }
];
var viewer = $("viewer"), thumbWrap = $("thumbs"), cur = 0;
function planSvg(){
  var W = POD.size.w, D = POD.size.d, clear = C.PRODUCT.clearance;
  var scale = Math.min(500 / W, 250 / (D + clear)), pw = W * scale, pd = D * scale, cd = clear * scale;
  var x = 300 - pw / 2, y = 200 - (pd + cd) / 2;
  var t = function(x, y, s, fill, anchor){ return '<text x="' + x + '" y="' + y + '" text-anchor="' + (anchor || "middle") + '" fill="' + fill + '" font-size="14" font-family="Archivo, sans-serif">' + s + '</text>'; };
  return '<svg class="plan" viewBox="0 0 600 400" role="img" aria-label="Top-down footprint of the ' + POD.name + '">' +
    '<rect x="' + x + '" y="' + y + '" width="' + pw + '" height="' + pd + '" rx="4" fill="#111"/>' +
    '<rect x="' + x + '" y="' + (y + pd) + '" width="' + pw + '" height="' + cd + '" rx="4" fill="#111" fill-opacity=".05" stroke="#111" stroke-opacity=".45" stroke-dasharray="5 5"/>' +
    t(300, y + pd / 2 + 5, POD.name + " POD", "#fff") + t(300, y + pd + cd / 2 + 5, "About " + clear + " ft to open and cook", "#111") +
    t(300, y - 12, W + " ft wide", "#6A6A67") + t(x + pw + 12, y + pd / 2 + 5, D + " ft deep", "#6A6A67", "start") + '</svg>';
}
function show(i, user){
  cur = (i + MEDIA.length) % MEDIA.length;
  var m = MEDIA[cur];
  viewer.querySelectorAll("img,video,svg.plan,.shot-tag").forEach(function(n){ n.remove(); });
  if (m.type === "img"){
    var im = document.createElement("img"); im.src = m.src; im.alt = m.label; if (m.contain) im.className = "contain";
    im.setAttribute("data-shot", m.shot); viewer.insertBefore(im, viewer.firstChild);
  } else if (m.type === "video"){
    var v = document.createElement("video");
    v.muted = true; v.defaultMuted = true; v.loop = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.poster = "assets/video/hero-poster.jpg";
    v.setAttribute("data-shot", m.shot);
    v.innerHTML = '<source src="assets/video/hero.mp4" type="video/mp4"><source src="assets/video/hero.webm" type="video/webm">';
    viewer.insertBefore(v, viewer.firstChild);
    if (!reduceMotion){ var pr = v.play(); if (pr && pr.catch) pr.catch(function(){}); }
  } else viewer.insertAdjacentHTML("afterbegin", planSvg());
  $("vBadge").textContent = m.label; $("galNote").textContent = m.note;
  thumbWrap.querySelectorAll(".thumb").forEach(function(b, j){ b.setAttribute("aria-pressed", String(j === cur)); });
  window.NOL_tagShots(viewer);
  if (user) track("gallery_view", { item: m.label, pod: POD.id });
}
thumbWrap.innerHTML = MEDIA.map(function(m, i){
  var inner = m.type === "img" ? '<img alt="" src="' + m.src + '"' + (m.contain ? ' style="object-fit:contain;background:#fff"' : "") + '>' :
    m.type === "video" ? '<img alt="" src="assets/video/hero-poster.jpg"><span class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z"/></svg></span>' :
    '<svg viewBox="0 0 150 100" aria-hidden="true"><rect width="150" height="100" fill="#fff"/><rect x="25" y="25" width="100" height="26" rx="2" fill="#111"/><rect x="25" y="51" width="100" height="24" rx="2" fill="#111" fill-opacity=".06" stroke="#111" stroke-opacity=".4" stroke-dasharray="3 3"/></svg>';
  return '<button type="button" class="thumb" data-i="' + i + '">' + inner + '<span>' + m.label + '</span></button>';
}).join("");
thumbWrap.addEventListener("click", function(e){ var b = e.target.closest(".thumb"); if (b) show(+b.dataset.i, true); });
$("vPrev").addEventListener("click", function(){ show(cur - 1, true); });
$("vNext").addEventListener("click", function(){ show(cur + 1, true); });
show(0);

/* ---------- In the kit ---------- */
function partCard(img, shot, qty, name, desc, cls){
  return '<article class="part' + (cls ? " " + cls : "") + '"><div class="pi">' + (img ? '<img src="' + img + '" alt="" loading="lazy" data-shot="' + shot + '">' : '<span data-shot="' + shot + '">' + CAM + '</span>') + '</div>' +
    '<div class="pb"><span class="qty">' + qty + '</span><b>' + name + '</b><p>' + desc + '</p></div></article>';
}
var P = function(id){ return byId(C.PARTS, id); };
var kit = [
  partCard(POD.img, POD.shot, "Shell", POD.name + " shell", POD.shell + ". " + C.sizeText(POD) + ", approx."),
  partCard(P("sink").img, P("sink").shot, "1 included", P("sink").name, P("sink").desc),
  partCard(P("bbqcab").img, P("bbqcab").shot, "1 included", P("bbqcab").name, P("bbqcab").desc),
  partCard(P("bbq").img, P("bbq").shot, "1 included", P("bbq").name, P("bbq").desc + " Swap for a smoker, pizza oven or griddle."),
  partCard(P("fridge").img, P("fridge").shot, "1 included", P("fridge").name, P("fridge").desc)
];
if (POD.cabinets) kit.push(partCard(P("storage").img, P("storage").shot, POD.cabinets + " included", P("storage").name, P("storage").desc));
C.ADDONS.forEach(function(a){ if (C.addonStatus(a, POD) === "inc") kit.push(partCard(a.img, a.shot, "Included", a.name, a.desc)); });
kit.push(partCard(null, "PART-COUNTER", "Included", "Countertops and grey water tank", "Sink top plus a countertop that " + POD.countertop.toLowerCase() + "."));
$("kitGrid").innerHTML = kit.join("");

/* ---------- Compare PODs (launched only), with the price difference to this POD ---------- */
var Y = '<svg class="ico" aria-label="Included"><use href="#i-check"/></svg>', NA = '<span class="na">-</span>';
function st(id, p){ var s = C.addonStatus(byId(C.ADDONS, id), p); return s === "inc" ? Y : s === "opt" ? "Add-on" : NA; }
var ROWS = [
  ["Size (W x H x D)", function(p){ return p.size.w + " x " + p.size.h + " x " + p.size.d + " ft"; }],
  ["Shell", function(p){ return p.shell; }],
  ["Sink cabinet, faucet, plumbing", function(){ return Y; }],
  ["BBQ cabinet + BBQ", function(){ return Y; }],
  ["Glass-door fridge", function(){ return "1"; }],
  ["Storage cabinets", function(p){ return p.cabinets ? String(p.cabinets) : NA; }],
  ["Countertop", function(p){ return p.countertop; }],
  ["Grey water tank", function(){ return Y; }],
  ["Control module + remote", function(p){ return st("control", p); }],
  ["Roof Motor Arm", function(p){ return st("roofmotor", p); }],
  ["LED light kit", function(p){ return st("led", p); }],
  ["Hood fan", function(p){ return st("hood", p); }],
  ["Bluetooth speakers", function(p){ return st("speakers", p); }],
  ["Fan", function(p){ return st("fan", p); }],
  ["Heater", function(p){ return st("heater", p); }]
];
if (live.length < 2) $("compare-tiers").hidden = true;
var sel = function(p){ return p.id === POD.id ? ' class="sel"' : ""; };
$("cmpTable").innerHTML =
  '<thead><tr><th scope="col"><span class="sr-only">Feature</span></th>' + live.map(function(p){
    var d = p.price - POD.price;
    return '<th scope="col"' + sel(p) + '><img src="' + p.img + '" alt=""><b>' + p.name + '</b><small>' + money(p.price) + '</small>' +
      '<span class="delta">' + (d === 0 ? "This POD" : (d > 0 ? "+" : "-") + money(Math.abs(d))) + '</span></th>';
  }).join("") + '</tr></thead><tbody>' +
  ROWS.map(function(r){ return '<tr><th scope="row">' + r[0] + '</th>' + live.map(function(p){ return '<td' + sel(p) + '>' + r[1](p) + '</td>'; }).join("") + '</tr>'; }).join("") +
  '</tbody><tfoot><tr><td></td>' + live.map(function(p){
    return '<td' + sel(p) + '>' + (p.id === POD.id ? '<span class="small">You are here</span>' :
      '<a class="btn btn-line btn-plain" href="' + p.page + '?' + cfg.query() + '" data-pick="' + p.id + '">View ' + p.name + '</a>') + '</td>';
  }).join("") + '</tr></tfoot>';
// keep the configuration on the "View" links current
cfg.onChange(function(api){ document.querySelectorAll("[data-pick]").forEach(function(a){ a.href = byId(C.PODS, a.dataset.pick).page + "?" + api.query(); }); });

/* ---------- Specs ---------- */
var dl = function(rows){ return "<dl>" + rows.map(function(r){ return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>"; }).join("") + "</dl>"; };
$("specsGrid").innerHTML = dl([
  ["Size (approx.)", C.sizeText(POD)],
  ["Shell", POD.shell],
  ["Storage cabinets", POD.cabinets ? String(POD.cabinets) : "None"],
  ["Countertop", POD.countertop],
  ["Colors", "Cabinet faces, exterior and interior panels in white or grey"],
  ["Fixed in black", "Frame, cabinet sides and backs, faucet, handles"],
  ["Shipping", "Flat-packed on a pallet, appliances boxed separately"]
]) + dl(C.UTILITIES.concat([["Certification", "UL, CE or the relevant mark for each market"]]));

/* ---------- Add-on grid, kept in sync with the buy box ---------- */
function renderGrid(){
  var s = cfg.state;
  $("addonGrid").innerHTML = C.COOKING.filter(function(k){ return k.delta; }).map(function(k){
    var on = s.cook === k.id;
    return '<article class="a-card"><img src="' + k.img + '" alt="" loading="lazy" data-shot="' + k.shot + '"><div class="a-b"><b>' + k.name + '</b><small>+' + money(k.delta) + '</small><span class="tag">Replaces the BBQ</span></div>' +
      '<button type="button" data-cook="' + k.id + '" aria-pressed="' + on + '">' + (on ? "Selected" : "Swap in") + '</button></article>';
  }).join("") + C.ADDONS.map(function(a){
    var stt = C.addonStatus(a, POD), on = !!s.addons[a.id], label, dis = false;
    if (stt === "inc"){ label = "Included"; dis = true; }
    else if (stt === "opt") label = on ? "Added" : "Add";
    else { var up = live.filter(function(x){ return x.num > POD.num && a.per[x.id]; })[0]; if (!up) return ""; label = up.name + " and up"; dis = true; }
    return '<article class="a-card">' + (a.img ? '<img src="' + a.img + '" alt="" loading="lazy" data-shot="' + a.shot + '">' : '<div class="ph" data-shot="' + a.shot + '">' + CAM + '</div>') +
      '<div class="a-b"><b>' + a.name + '</b><small>' + money(a.price) + '</small><span class="tag">' + a.desc + '</span></div>' +
      '<button type="button" data-add="' + a.id + '" aria-pressed="' + (stt === "opt" && on) + '"' + (dis ? " disabled" : "") + '>' + label + '</button></article>';
  }).join("");
  window.NOL_tagShots($("addonGrid"));
}
cfg.onChange(renderGrid);
$("addonGrid").addEventListener("click", function(e){
  var b = e.target.closest("button"); if (!b || b.disabled) return;
  var root = $("cfgPod"), input;
  if (b.dataset.cook) input = root.querySelector('[data-k="cook"][value="' + (cfg.state.cook === b.dataset.cook ? "bbq" : b.dataset.cook) + '"]');
  else input = root.querySelector('[data-k="addon"][value="' + b.dataset.add + '"]');
  if (input){ input.click(); }
});

/* ---------- Sticky buy bar: shows once the buy buttons scroll away ---------- */
var bar = $("buybar"), barLink = bar.querySelector("a");
cfg.onChange(function(api){
  $("barImg").src = POD.img; $("barTitle").textContent = "NOL " + POD.name;
  $("barPrice").textContent = money(api.total()); $("barFin").textContent = " or from " + money(POD.monthly) + "/mo";
});
barLink.addEventListener("click", function(e){ e.preventDefault(); $("product").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); });
if ("IntersectionObserver" in window){
  var vis = { cta: true, footer: false };
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ vis[en.target.dataset.watch] = en.isIntersecting; });
    var show = !vis.cta && !vis.footer;
    bar.classList.toggle("show", show); bar.setAttribute("aria-hidden", String(!show)); barLink.tabIndex = show ? 0 : -1;
  });
  [["cta", "#cfgPod"], ["footer", "footer"]].forEach(function(p){ var n = document.querySelector(p[1]); n.dataset.watch = p[0]; io.observe(n); });
}

window.NOL_tagShots();
window.NOL_reveal();
track("view_item", { pod: POD.id, value: POD.price });
})();
