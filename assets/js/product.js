/* NOL product page. Reads prices, tiers, colors and add-ons from assets/js/catalog.js. */
(function(){
"use strict";

var C = window.NOL_CATALOG, PRODUCT = C.PRODUCT, TIERS = C.TIERS, COLORS = C.COLORS, SHADES = C.SHADES, ADDONS = C.ADDONS;

/* ---------- Helpers ---------- */
window.dataLayer = window.dataLayer || [];
function track(event, params){ var o = { event: event }; for (var k in params) o[k] = params[k]; window.dataLayer.push(o); }
function money(v){ return "$" + Number(v).toLocaleString("en-US"); }
function $(id){ return document.getElementById(id); }
function ftIn(cm){ var inch = Math.round(cm / 2.54), ft = Math.floor(inch / 12), r = inch % 12; return ft + " ft" + (r ? " " + r + " in" : ""); }
function shadeName(id){ return SHADES.filter(function(x){ return x.id === id; })[0].name.split(" ")[0]; }
function byId(list, id){ return list.filter(function(x){ return x.id === id; })[0]; }
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
var ICON = function(id){ return '<svg class="ico"><use href="#' + id + '"/></svg>'; };

/* ---------- State (tier can come from ?tier=good|better|best) ---------- */
var qTier = new URLSearchParams(location.search).get("tier");
var state = { tier: byId(TIERS, qTier) ? qTier : "better", ext: "anthracite", cab: "anthracite", top: "anthracite", addons: {}, media: 0 };
function tier(){ return byId(TIERS, state.tier); }

/* ---------- Media gallery ---------- */
function media(){
  var t = tier();
  return [
    { type:"img", src:t.img, label:"NOL " + t.name, cover:true },
    { type:"video", label:"See it open", poster:"assets/video/hero-poster.jpg" },
    { type:"img", src:"assets/frames/29.webp", label:"Open" },
    { type:"img", src:"assets/frames/00.webp", label:"Closed" },
    { type:"plan", label:"Footprint" }
  ];
}
function planSvg(t){
  var L = t.dims.length, W = t.dims.width, clear = PRODUCT.clearance * 30.48;
  var scale = Math.min(520 / L, 250 / (W + clear)), pw = L * scale, pd = W * scale, cd = clear * scale;
  var x = 300 - pw / 2, y = 200 - (pd + cd) / 2;
  return '<svg class="plan" viewBox="0 0 600 400" role="img" aria-label="Top-down footprint of the ' + t.name + '">' +
    '<rect x="' + x + '" y="' + y + '" width="' + pw + '" height="' + pd + '" rx="4" fill="#111"/>' +
    '<rect x="' + x + '" y="' + (y + pd) + '" width="' + pw + '" height="' + cd + '" rx="4" fill="#111" fill-opacity=".05" stroke="#111" stroke-opacity=".45" stroke-dasharray="5 5"/>' +
    '<text x="300" y="' + (y + pd / 2 + 5) + '" text-anchor="middle" fill="#fff" font-size="14" font-family="Archivo, sans-serif">' + t.name + ' pod</text>' +
    '<text x="300" y="' + (y + pd + cd / 2 + 5) + '" text-anchor="middle" fill="#111" font-size="13" font-family="Archivo, sans-serif">About 3 ft to open and cook</text>' +
    '<text x="300" y="' + (y - 12) + '" text-anchor="middle" fill="#6A6A67" font-size="13" font-family="Archivo, sans-serif">' + L + ' cm (' + ftIn(L) + ')</text>' +
    '<text x="' + (x + pw + 14) + '" y="' + (y + pd / 2 + 5) + '" fill="#6A6A67" font-size="13" font-family="Archivo, sans-serif">' + W + ' cm</text>' +
    '</svg>';
}
var viewer = $("viewer"), thumbWrap = $("thumbs");
function showMedia(i, user){
  var list = media();
  state.media = (i + list.length) % list.length;
  var m = list[state.media];
  viewer.querySelectorAll("img,video,svg.plan").forEach(function(n){ n.remove(); });
  var el;
  if (m.type === "img"){
    el = document.createElement("img");
    el.src = m.src; el.alt = m.label; if (!m.cover) el.className = "contain";
  } else if (m.type === "video"){
    el = document.createElement("video");
    el.muted = true; el.defaultMuted = true; el.loop = true; el.playsInline = true; el.setAttribute("playsinline", ""); el.poster = m.poster;
    el.innerHTML = '<source src="assets/video/hero.mp4" type="video/mp4"><source src="assets/video/hero.webm" type="video/webm">';
    if (!reduceMotion){ el.autoplay = true; }
  } else {
    viewer.insertAdjacentHTML("afterbegin", planSvg(tier()));
  }
  if (el) viewer.insertBefore(el, viewer.firstChild);
  if (el && el.tagName === "VIDEO" && !reduceMotion){ var pr = el.play(); if (pr && pr.catch) pr.catch(function(){}); }
  $("vBadge").textContent = m.label;
  thumbWrap.querySelectorAll(".thumb").forEach(function(b, j){ b.setAttribute("aria-pressed", String(j === state.media)); });
  $("galNote").textContent = state.media === 0 ? "Shown in " + tier().look.toLowerCase() + "." : (state.media === 2 || state.media === 3 || state.media === 1 ? "Concept visual of the opening mechanism." : "Plan view with the clearance needed in front.");
  if (user) track("gallery_view", { item: m.label });
}
function renderThumbs(){
  thumbWrap.innerHTML = media().map(function(m, i){
    var inner = m.type === "img" ? '<img alt="" src="' + m.src + '"' + (m.cover ? "" : ' style="object-fit:contain;background:#fff"') + '>' :
      m.type === "video" ? '<img alt="" src="' + m.poster + '"><span class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z"/></svg></span>' :
      '<svg viewBox="0 0 150 100" aria-hidden="true"><rect x="0" y="0" width="150" height="100" fill="#fff"/><rect x="25" y="25" width="100" height="26" rx="2" fill="#111"/><rect x="25" y="51" width="100" height="24" rx="2" fill="#111" fill-opacity=".06" stroke="#111" stroke-opacity=".4" stroke-dasharray="3 3"/></svg>';
    return '<button type="button" class="thumb" data-i="' + i + '">' + inner + '<span>' + m.label + '</span></button>';
  }).join("");
}
thumbWrap.addEventListener("click", function(e){ var b = e.target.closest(".thumb"); if (b) showMedia(+b.dataset.i, true); });
$("vPrev").addEventListener("click", function(){ showMedia(state.media - 1, true); });
$("vNext").addEventListener("click", function(){ showMedia(state.media + 1, true); });

/* ---------- Tier picker ---------- */
$("tierPick").innerHTML = TIERS.map(function(t){
  return '<span><input type="radio" name="tier" id="tp-' + t.id + '" value="' + t.id + '"' + (t.id === state.tier ? " checked" : "") + '>' +
    '<label for="tp-' + t.id + '"><b>' + t.name + '</b><small>' + money(t.price) + '</small></label></span>';
}).join("");
$("tierPick").addEventListener("change", function(e){ setTier(e.target.value); track("variant_select", { tier: state.tier }); });

/* ---------- Colors ---------- */
function renderOptions(){
  var t = tier();
  $("optRow").innerHTML = COLORS.map(function(c){
    return '<div><p class="small" style="margin-bottom:.45rem">' + c.name + ': <span class="muted">' + shadeName(state[c.id]) + '</span></p><div class="opts">' +
      SHADES.map(function(sh){
        var id = "opt-" + c.id + "-" + sh.id;
        return '<span class="opt"><input type="radio" name="opt-' + c.id + '" id="' + id + '" value="' + sh.id + '" data-group="' + c.id + '"' + (state[c.id] === sh.id ? " checked" : "") + '>' +
          '<label for="' + id + '"><img src="' + c.img(t, sh.id) + '" alt="" loading="lazy">' + sh.name + '</label></span>';
      }).join("") + '</div></div>';
  }).join("");
}
$("optRow").addEventListener("change", function(e){
  state[e.target.getAttribute("data-group")] = e.target.value;
  renderOptions(); renderSummary();
  track("option_select", { option: e.target.getAttribute("data-group"), value: e.target.value });
});

/* ---------- Add-ons: chips in the buy box and cards further down, kept in sync ---------- */
function addonStatus(a, t){
  if (t.included.indexOf(a.id) > -1) return "included";
  if (t.hidden.indexOf(a.id) > -1) return "hidden";
  return a.price == null ? "hidden" : "optional";
}
function renderAddons(){
  var t = tier();
  $("addons").innerHTML = ADDONS.filter(function(a){ return addonStatus(a, t) !== "hidden"; }).map(function(a){
    var inc = addonStatus(a, t) === "included";
    return '<span class="addon"><input type="checkbox" id="ad-' + a.id + '" value="' + a.id + '"' + (inc ? " checked disabled" : (state.addons[a.id] ? " checked" : "")) + '>' +
      '<label for="ad-' + a.id + '"><span class="a-ico"><img src="assets/addons/' + a.img + '.jpg" alt=""></span>' + a.name + ' <small>' + (inc ? "Included" : "+" + money(a.price)) + '</small></label></span>';
  }).join("");
  $("addonNote").textContent = t.included.length ? "Items marked Included come standard on the " + t.name + "." : "Upgrade to Better for electronic opening, LED lighting and an exhaust fan as standard.";
  $("addonGrid").innerHTML = ADDONS.filter(function(a){ return a.price != null; }).map(function(a){
    var st = addonStatus(a, t), label;
    if (st === "included") label = "Included";
    else if (st === "hidden") label = (a.id.indexOf("led-") === 0 ? "LED included" : "Available on Better");
    else label = state.addons[a.id] ? "Added" : "Add";
    return '<article class="a-card"><img src="assets/addons/' + a.img + '.jpg" alt="" loading="lazy"><div class="a-b"><b>' + a.name + '</b><small>' + money(a.price) + '</small></div>' +
      '<button type="button" data-add="' + a.id + '" aria-pressed="' + (st === "optional" && !!state.addons[a.id]) + '"' + (st === "optional" ? "" : " disabled") + '>' + label + '</button></article>';
  }).join("");
}
function toggleAddon(id, on){
  state.addons[id] = on;
  if (!on) delete state.addons[id];
  renderAddons(); renderSummary();
  track(on ? "add_to_cart" : "remove_from_cart", { item: id, tier: state.tier });
}
$("addons").addEventListener("change", function(e){ if (!e.target.disabled) toggleAddon(e.target.value, e.target.checked); });
$("addonGrid").addEventListener("click", function(e){ var b = e.target.closest("[data-add]"); if (b && !b.disabled) toggleAddon(b.dataset.add, !state.addons[b.dataset.add]); });

/* ---------- Compare table ---------- */
var Y = ICON("i-check"), NA = '<span class="na">-</span>';
var ROWS = [
  ["Height",             function(t){ return (t.id === "good" ? "Short, " : "Full, ") + t.dims.height + " cm"; }],
  ["Length",             function(t){ return t.dims.length + " cm"; }],
  ["Opening",            function(t){ return t.included.indexOf("electronic") > -1 ? "Electronic" : "Manual"; }],
  ["LED lighting",       function(t){ return t.included.indexOf("led") > -1 ? "Included" : "Add-on"; }],
  ["Exhaust fan",        function(t){ return t.included.indexOf("fan") > -1 ? "Included" : NA; }],
  ["Cabinets",           function(t){ return (t.features.filter(function(f){ return /cabinets/.test(f); })[0] || "").split(" ")[0]; }],
  ["Sink",               function(){ return Y; }],
  ["BBQ grill",          function(){ return Y; }],
  ["Fridge",             function(){ return Y; }],
  ["Bluetooth speakers", function(t){ return t.included.indexOf("speaker") > -1 ? "Included" : (t.hidden.indexOf("speaker") > -1 ? NA : "Add-on"); }]
];
function renderCompare(){
  var sel = function(t){ return t.id === state.tier ? ' class="sel"' : ""; };
  $("cmpTable").innerHTML =
    '<thead><tr><th scope="col"><span class="sr-only">Feature</span></th>' + TIERS.map(function(t){
      return '<th scope="col"' + sel(t) + '><img src="' + t.img + '" alt=""><b>' + t.name + '</b><small>' + money(t.price) + '</small></th>';
    }).join("") + '</tr></thead><tbody>' +
    ROWS.map(function(r){ return '<tr><th scope="row">' + r[0] + '</th>' + TIERS.map(function(t){ return '<td' + sel(t) + '>' + r[1](t) + '</td>'; }).join("") + '</tr>'; }).join("") +
    '</tbody><tfoot><tr><td></td>' + TIERS.map(function(t){
      return '<td' + sel(t) + '>' + (t.id === state.tier ? '<span class="small">Selected</span>' : '<button type="button" class="btn btn-line btn-plain" data-pick="' + t.id + '">Choose ' + t.name + '</button>') + '</td>';
    }).join("") + '</tr></tfoot>';
}
$("cmpTable").addEventListener("click", function(e){
  var b = e.target.closest("[data-pick]"); if (!b) return;
  setTier(b.dataset.pick);
  $("product").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  track("compare_choose", { tier: b.dataset.pick });
});

/* ---------- Specs ---------- */
function renderSpecs(){
  var t = tier(), d = t.dims;
  var left = [
    ["Length", d.length + " cm (" + ftIn(d.length) + ")"],
    ["Internal kitchen length", d.internal + " cm (" + ftIn(d.internal) + ")"],
    ["Height", d.height + " cm (" + ftIn(d.height) + ")"],
    ["Depth", d.width + " cm (" + ftIn(d.width) + ")"],
    ["Clearance in front", "About " + PRODUCT.clearance + " ft"]
  ];
  var right = [
    ["Opening", t.included.indexOf("electronic") > -1 ? "Electronic" : "Manual, electronic upgrade available"],
    ["Lighting", t.included.indexOf("led") > -1 ? "LED, white or RGB" : "Optional LED kit"],
    ["Exterior colors", "Anthracite grey or white"],
    ["Cabinet colors", "Anthracite grey or white"],
    ["Countertop", "Anthracite grey or white"]
  ];
  var dl = function(rows){ return "<dl>" + rows.map(function(r){ return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>"; }).join("") + "</dl>"; };
  $("specs-grid").innerHTML = dl(left) + dl(right);
  $("specTier").textContent = "NOL " + t.name;
}

/* ---------- Summary and prices ---------- */
function renderSummary(){
  var t = tier();
  var chosen = ADDONS.filter(function(a){ return state.addons[a.id]; });
  var colors = shadeName(state.ext) + " exterior, " + shadeName(state.cab).toLowerCase() + " cabinets, " + shadeName(state.top).toLowerCase() + " top";
  var html = "<dt>NOL " + t.name + "<br><span class='small'>" + colors + "</span></dt><dd>" + money(t.price) + "</dd>";
  chosen.forEach(function(a){ html += "<dt>" + a.name + "</dt><dd>" + money(a.price) + "</dd>"; });
  html += "<dt>Delivery</dt><dd>" + (PRODUCT.delivery ? money(PRODUCT.delivery) : "Included") + "</dd>";
  var total = chosen.reduce(function(sum, a){ return sum + a.price; }, t.price + (PRODUCT.delivery || 0));
  html += '<dt class="total">Total</dt><dd class="total">' + money(total) + "</dd>";
  $("summary").innerHTML = html;
  $("pPrice").textContent = money(t.price);
  $("pFin").textContent = "or from " + money(t.monthly) + "/mo with financing";
  $("finance-line").textContent = "Or from " + money(t.monthly) + " a month with financing, subject to approval.";
  $("barTitle").textContent = "NOL " + t.name;
  $("barPrice").textContent = money(total);
  $("barFinish").textContent = shadeName(state.ext);
  $("barImg").src = t.img;
  var vals = { price: t.price, monthly: t.monthly, deposit: PRODUCT.deposit, from: TIERS[0].price, fromMonthly: TIERS[0].monthly };
  document.querySelectorAll("[data-p]").forEach(function(el){ el.textContent = money(vals[el.getAttribute("data-p")]); });
}

/* ---------- Tier switch ---------- */
function setTier(id){
  state.tier = id;
  var t = tier();
  Object.keys(state.addons).forEach(function(k){ if (addonStatus(byId(ADDONS, k), t) !== "optional") delete state.addons[k]; });
  var r = $("tp-" + id); if (r) r.checked = true;
  $("pTitle").textContent = "NOL " + t.name;
  $("pSub").textContent = t.tag;
  $("tierName").textContent = t.name;
  $("crumbTier").textContent = "NOL " + t.name;
  document.title = "NOL " + t.name + " Outdoor Kitchen Pod | Nordic Outdoor Living";
  $("incList").innerHTML = t.features.map(function(f){ return "<li>" + f + "</li>"; }).join("");
  var d = t.dims;
  $("dimText").textContent = "Length " + d.length + " cm (" + ftIn(d.length) + "), internal kitchen length " + d.internal + " cm, height " + d.height + " cm (" + ftIn(d.height) + "), depth " + d.width + " cm (" + ftIn(d.width) + ").";
  if (history.replaceState){ var u = new URL(location.href); u.searchParams.set("tier", id); history.replaceState(null, "", u); }
  renderThumbs(); showMedia(state.media === 0 || state.media === 4 ? state.media : 0);
  renderOptions(); renderAddons(); renderCompare(); renderSpecs(); renderSummary();
}
setTier(state.tier);

/* ---------- Reserve (prototype) ---------- */
$("reserveBtn").addEventListener("click", function(){
  $("reserveMsg").textContent = "Prototype: this opens Shopify checkout for the deposit.";
  track("begin_checkout", { type: "reservation_deposit", tier: state.tier, addons: Object.keys(state.addons).join(",") });
});

/* ---------- Sticky buy bar: shows once the buy buttons scroll away ---------- */
var bar = $("buybar"), barLink = bar.querySelector("a");
barLink.addEventListener("click", function(e){ e.preventDefault(); $("product").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); });
if ("IntersectionObserver" in window){
  var vis = { cta: true, footer: false };
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ vis[en.target.dataset.watch] = en.isIntersecting; });
    var show = !vis.cta && !vis.footer;
    bar.classList.toggle("show", show); bar.setAttribute("aria-hidden", String(!show)); barLink.tabIndex = show ? 0 : -1;
  });
  [["cta", "#ctaStack"], ["footer", "footer"]].forEach(function(p){ var n = document.querySelector(p[1]); n.dataset.watch = p[0]; io.observe(n); });
}

/* ---------- Shared page UI ---------- */
var menuBtn = $("menuBtn"), navList = $("navList"), header = $("siteHeader");
menuBtn.addEventListener("click", function(){ var open = navList.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(open)); });
navList.addEventListener("click", function(e){ if (e.target.closest("a")){ navList.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); if (document.activeElement) document.activeElement.blur(); } });
function onScroll(){ header.classList.toggle("scrolled", window.scrollY > 8); }
window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
var tbcBtn = $("tbcToggle");
tbcBtn.addEventListener("click", function(){ var on = document.body.classList.toggle("show-tbc"); tbcBtn.setAttribute("aria-pressed", String(on)); });
$("waitForm").addEventListener("submit", function(e){
  e.preventDefault();
  var v = $("wEmail").value, m = $("waitMsg");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ m.textContent = "Enter an email address like name@example.com."; return; }
  m.textContent = "You're on the list. We'll email you before reservations open.";
  track("newsletter_signup", { location: "footer" });
});
document.querySelectorAll(".faq details").forEach(function(d){
  d.addEventListener("toggle", function(){ if (d.open) track("faq_expand", { question: d.querySelector("summary").textContent }); });
});
if (!reduceMotion && "IntersectionObserver" in window){
  document.documentElement.classList.add("reveal-on");
  var rio = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add("in"); rio.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  document.querySelectorAll("[data-reveal]").forEach(function(el){
    var sib = el.parentNode.querySelectorAll(":scope > [data-reveal]");
    el.style.transitionDelay = (Math.max(0, Array.prototype.indexOf.call(sib, el)) * 90) + "ms";
    rio.observe(el);
  });
}
track("view_item", { tier: state.tier });
})();
