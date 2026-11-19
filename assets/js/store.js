/* NOL store: one product page. Plain JS, no libraries, so it drops into a Shopify theme as-is.
   Product data lives at the top: change a price or an option here and the whole page follows. */
(function(){
"use strict";

/* ---------- Product data ---------- */
var P = {
  name: "NOL Outdoor Kitchen POD",
  price: 9900, monthly: 249, deposit: 500,
  shades: [ { id:"white", name:"White", hex:"#ECE7DF" }, { id:"grey", name:"Grey", hex:"#56595C" } ],
  finish: [ { id:"faces", name:"Cabinet faces", def:"white" }, { id:"exterior", name:"Exterior panels", def:"grey" }, { id:"interior", name:"Interior panels", def:"grey" } ],
  cooking: [
    { id:"bbq",     name:"BBQ",        full:"Stainless BBQ",        delta:0,   img:"assets/parts/bbq.jpg" },
    { id:"griddle", name:"Griddle",    full:"Stainless griddle",    delta:390, img:"assets/parts/griddle.jpg" },
    { id:"pizza",   name:"Pizza oven", full:"Stainless pizza oven", delta:590, img:"assets/parts/pizza-oven.jpg" },
    { id:"smoker",  name:"Smoker",     full:"Pellet smoker",        delta:790, img:"assets/parts/smoker.jpg" }
  ],
  fuels: [ { id:"propane", name:"Propane" }, { id:"natural-gas", name:"Natural gas" } ],
  addons: [
    { id:"awning", name:"Awning",     price:690, desc:"Extra shade over the counter. Assembled onsite." },
    { id:"tv",     name:"TV bracket", price:149, desc:"Mount a TV inside the canopy. Assembled onsite." }
  ],
  included: ["Shell with lift-up roof on gas struts", "Sink cabinet with black faucet, plumbing kit and grey water tank",
    "BBQ cabinet with two drawers", "Your choice of cooking appliance", "Glass-door fridge, 110 V", "Countertop over the fridge", "20 ft power cord and gas extension hose"],
  utilities: [
    ["Power", "110 V, 20 A. 20 ft black extension cord included"],
    ["Gas", "Propane with ball valve, or natural gas. Extension hose included"],
    ["Hot and cold water", "1/2 in PEX to the home supply"],
    ["Grey water", "2 in pipe to the grey water tank or a drain"],
    ["Garden hose (optional)", "Two 1/2 in PEX-to-hose connectors included"]
  ],
  specs: [
    ["Size (approx.)", "10 ft W x 7.5 ft H x 4 ft D"],
    ["Roof", "Lifts by hand on gas struts, closes weather-tight"],
    ["Countertop", "Covers the fridge"],
    ["Colours", "Cabinet faces, exterior and interior panels in white or grey"],
    ["Always black", "Frame, cabinet sides and backs, faucet, handles"],
    ["Clearance", "About 3 ft in front to open and cook"],
    ["Shipping", "Flat-packed on a pallet, appliances boxed separately"]
  ]
};

var FEATURES = [
  { k:"Lift-up roof", t:"Opens into a canopy", img:"assets/frames/29.webp", dark:true, d:"The roof swings up on gas struts by hand and becomes a canopy over the whole counter. Shade at lunch, shelter in a shower." },
  { k:"Sink cabinet", t:"Running water, outside", img:"assets/parts/sink-cabinet.jpg", d:"Stainless sink with a black faucet. The plumbing kit and grey water tank hide behind two doors." },
  { k:"Built-in grill", t:"A proper BBQ, not a cart", img:"assets/parts/bbq.jpg", d:"Stainless BBQ on propane or natural gas, set into a vented cabinet. Swap it for a griddle, pizza oven or smoker." },
  { k:"Glass-door fridge", t:"Drinks within reach", img:"assets/parts/fridge.jpg", d:"Stainless with tempered glass and adjustable shelves. Runs on the same 110 V circuit as everything else." },
  { k:"BBQ cabinet", t:"Two deep drawers", img:"assets/parts/bbq-cabinet.jpg", d:"Tools, trays and fuel live right under the grill, so nothing goes back and forth to the house." },
  { k:"Four ways to cook", t:"Pick your appliance", img:"assets/parts/pizza-oven.jpg", d:"BBQ as standard, or a griddle, pizza oven or pellet smoker for the difference in price." },
  { k:"Closed", t:"Tidy when you're done", img:"assets/frames/00.webp", dark:true, d:"Close the roof and the kitchen disappears into one clean, weather-tight shape. No covers to wrestle with." }
];
var DETAILS = [
  { img:"assets/photos/life-1.jpg", t:"Warm light on the counter after dark" },
  { img:"assets/parts/griddle.jpg", t:"Griddle for breakfasts, smash burgers and stir-fries" },
  { img:"assets/photos/build.jpg", t:"Sits naturally on a patio, deck or lawn edge" },
  { img:"assets/parts/smoker.jpg", t:"Pellet smoker with digital temperature control" },
  { img:"assets/photos/life-2.jpg", t:"The roof doubles as shelter from sun and showers" },
  { img:"assets/frames/14.webp", t:"Gas struts hold the roof at any height on the way up", dark:true }
];
var STEPS = [
  { n:"01", k:"Reserve", t:"Hold your POD", img:"assets/pods/good.jpg", d:"Choose your finish and cooking appliance, then reserve with a $500 deposit that counts toward your price." },
  { n:"02", k:"Plan", t:"Check your space", img:"assets/video/hero-poster.jpg", d:"We send a spec sheet, an HOA approval pack and a utilities checklist for your plumber and electrician." },
  { n:"03", k:"Deliver", t:"Flat-packed to your driveway", img:"assets/photos/build.jpg", d:"It arrives on one pallet about 10 ft long and 30 in wide, with the appliances boxed separately." },
  { n:"04", k:"Cook", t:"Connect and light it up", img:"assets/photos/life-3.jpg", d:"Power, gas and water connect at one rear panel. Lift the roof and dinner's outside." }
];
var MEDIA = [
  { src:"assets/pods/good.jpg", label:"The POD" },
  { video:true, src:"assets/video/hero-poster.jpg", label:"In the garden" },
  { src:"assets/frames/29.webp", label:"Open", dark:true },
  { src:"assets/frames/00.webp", label:"Closed", dark:true },
  { src:"assets/photos/life-3.jpg", label:"On the patio" },
  { src:"assets/photos/life-1.jpg", label:"After dark" },
  { plan:true, label:"Footprint" }
];

/* ---------- Helpers ---------- */
function $(s, r){ return (r || document).querySelector(s); }
function $$(s, r){ return [].slice.call((r || document).querySelectorAll(s)); }
function money(v){ return "$" + Number(v).toLocaleString("en-US"); }
var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
window.dataLayer = window.dataLayer || [];
function track(e, p){ var o = { event:e }; for (var k in p) o[k] = p[k]; window.dataLayer.push(o); }
var ICO = function(id){ return '<svg class="ico"><use href="#' + id + '"/></svg>'; };

$$("[data-price]").forEach(function(el){ el.textContent = money(P.price); });
$$("[data-monthly]").forEach(function(el){ el.textContent = money(P.monthly); });
$$("[data-deposit]").forEach(function(el){ el.textContent = money(P.deposit); });

/* ---------- Card rails ---------- */
$("#featCards").innerHTML = FEATURES.map(function(f, i){
  return '<article class="fcard' + (f.dark ? " dark" : "") + '"><div class="fc-top"><p class="eyebrow">' + f.k + '</p><h3>' + f.t + '</h3></div>' +
    '<img src="' + f.img + '" alt="" loading="lazy">' +
    '<button type="button" class="fc-more" aria-expanded="false" aria-controls="fd' + i + '">' + ICO("i-plus") + '<span class="sr-only">More about ' + f.k + '</span></button>' +
    '<div class="fc-detail" id="fd' + i + '"><p class="eyebrow">' + f.k + '</p><h3>' + f.t + '</h3><p>' + f.d + '</p></div></article>';
}).join("");
$("#featCards").addEventListener("click", function(e){
  var b = e.target.closest(".fc-more"); if (!b) return;
  var c = b.closest(".fcard"), open = !c.classList.contains("open");
  c.classList.toggle("open", open); b.setAttribute("aria-expanded", String(open));
  if (open) track("feature_card_open", { card: $(".eyebrow", c).textContent });
});
$("#detCards").innerHTML = DETAILS.map(function(d){
  return '<figure class="dcard' + (d.dark ? " dark" : "") + '"><img src="' + d.img + '" alt="" loading="lazy"><figcaption>' + d.t + '</figcaption></figure>';
}).join("");
$("#stepCards").innerHTML = STEPS.map(function(s){
  return '<article class="scard"><img src="' + s.img + '" alt="" loading="lazy"><p class="s-n">' + s.n + ' ' + s.k + '</p><h3>' + s.t + '</h3><p>' + s.d + '</p></article>';
}).join("");
$$(".arrows").forEach(function(a){
  var rail = document.getElementById(a.dataset.for);
  function sync(){
    $("[data-dir='-1']", a).disabled = rail.scrollLeft < 8;
    $("[data-dir='1']", a).disabled = rail.scrollLeft + rail.clientWidth > rail.scrollWidth - 8;
  }
  a.addEventListener("click", function(e){
    var b = e.target.closest("button"); if (!b) return;
    var card = rail.firstElementChild, step = card ? card.getBoundingClientRect().width + 16 : 300;
    rail.scrollBy({ left: +b.dataset.dir * step, behavior: reduce ? "auto" : "smooth" });
  });
  rail.addEventListener("scroll", sync, { passive:true }); addEventListener("resize", sync); sync();
});

/* ---------- Feature cards: vertical scroll drives them sideways while the section is pinned ---------- */
(function(){
  var sec = $("#features"), track = $("#featCards"), bar = $("#hsBar"), now = $("#hsNow"), n = track.children.length, travel = 0, ticking = false;
  $("#hsAll").textContent = (n < 10 ? "0" : "") + n;
  if (reduce) return; // falls back to a swipeable row
  document.documentElement.classList.add("hs-on");
  function measure(){
    var stick = $("#hd").offsetHeight + $("#subnav").offsetHeight;
    document.documentElement.style.setProperty("--stick", stick + "px");
    travel = Math.max(0, track.scrollWidth - innerWidth);
    sec.style.height = (innerHeight - stick + travel) + "px";
    update();
  }
  function update(){
    ticking = false;
    var r = sec.getBoundingClientRect(), span = r.height - (innerHeight - parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--stick")));
    var p = span > 0 ? Math.max(0, Math.min(1, (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--stick")) - r.top) / span)) : 0;
    track.style.transform = "translate3d(" + (-travel * p).toFixed(1) + "px,0,0)";
    bar.style.transform = "scaleX(" + p + ")";
    var i = Math.min(n, Math.round(p * (n - 1)) + 1); now.textContent = (i < 10 ? "0" : "") + i;
  }
  addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }, { passive:true });
  addEventListener("resize", measure);
  addEventListener("load", measure);
  measure();
})();

/* ---------- Gallery ---------- */
var stage = $("#stage"), thumbs = $("#thumbs"), cur = 0;
function plan(){
  return '<svg class="plan" viewBox="0 0 600 420" role="img" aria-label="Top-down footprint: 10 ft wide, 4 ft deep, with 3 ft clear in front">' +
    '<rect x="100" y="120" width="400" height="160" rx="4" fill="#141414"/>' +
    '<rect x="100" y="280" width="400" height="120" rx="4" fill="#141414" fill-opacity=".05" stroke="#141414" stroke-opacity=".4" stroke-dasharray="6 6"/>' +
    '<g font-family="Google Sans Flex, sans-serif" font-size="16" text-anchor="middle"><text x="300" y="205" fill="#fff">NOL POD</text>' +
    '<text x="300" y="345" fill="#141414">About 3 ft to open and cook</text><text x="300" y="100" fill="#77736b">10 ft wide</text>' +
    '<text x="520" y="205" fill="#77736b" text-anchor="start">4 ft deep</text></g></svg>';
}
function show(i, user){
  cur = (i + MEDIA.length) % MEDIA.length;
  var m = MEDIA[cur];
  $$("img,video,svg.plan", stage).forEach(function(n){ n.remove(); });
  stage.classList.toggle("dark", !!m.dark);
  if (m.plan) stage.insertAdjacentHTML("afterbegin", plan());
  else if (m.video){
    var v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute("playsinline", ""); v.poster = m.src;
    v.innerHTML = '<source src="assets/video/hero.webm" type="video/webm"><source src="assets/video/hero.mp4" type="video/mp4">';
    stage.insertBefore(v, stage.firstChild); if (!reduce){ var pr = v.play(); if (pr && pr.catch) pr.catch(function(){}); }
  } else {
    var im = new Image(); im.src = m.src; im.alt = P.name + ": " + m.label; stage.insertBefore(im, stage.firstChild);
  }
  $("#stageBadge").textContent = m.label;
  $$(".thumb", thumbs).forEach(function(t, j){ t.setAttribute("aria-pressed", String(j === cur)); });
  if (user) track("gallery_view", { item: m.label });
}
thumbs.innerHTML = MEDIA.map(function(m, i){
  var inner = m.plan ? '<svg viewBox="0 0 60 60" aria-hidden="true"><rect width="60" height="60" fill="#fff"/><rect x="10" y="18" width="40" height="14" fill="#141414"/><rect x="10" y="32" width="40" height="12" fill="none" stroke="#141414" stroke-dasharray="2 2" stroke-opacity=".5"/></svg>'
    : '<img src="' + m.src + '" alt="" loading="lazy">' + (m.video ? '<span class="play">' + ICO("i-play") + '</span>' : "");
  return '<button type="button" class="thumb' + (m.dark ? " dark" : "") + '" aria-label="' + m.label + '">' + inner + '</button>';
}).join("");
thumbs.addEventListener("click", function(e){ var b = e.target.closest(".thumb"); if (b) show($$(".thumb", thumbs).indexOf(b), true); });
$$(".snav", stage).forEach(function(b){ b.addEventListener("click", function(){ show(cur + +b.dataset.step, true); }); });
show(0);

/* ---------- Configurator ---------- */
var st = { cook:"bbq", fuel:"propane", addons:{} };
P.finish.forEach(function(f){ st[f.id] = f.def; });
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; }

function renderOptions(){
  $("#finish").innerHTML = P.finish.map(function(f){
    return '<div class="fin-row" role="radiogroup" aria-label="' + f.name + '"><span class="fin-name">' + f.name + '<small>' + byId(P.shades, st[f.id]).name + '</small></span><div class="sw">' +
      P.shades.map(function(s){ return '<button type="button" role="radio" aria-checked="' + (st[f.id] === s.id) + '" data-k="' + f.id + '" data-v="' + s.id + '" style="--c:' + s.hex + '"><span class="sr-only">' + s.name + '</span></button>'; }).join("") + '</div></div>';
  }).join("");
  $("#cook").innerHTML = P.cooking.map(function(c){
    return '<button type="button" role="radio" aria-checked="' + (st.cook === c.id) + '" data-k="cook" data-v="' + c.id + '"><img src="' + c.img + '" alt="" loading="lazy"><b>' + c.name + '</b><small>' + (c.delta ? "+" + money(c.delta) : "Included") + '</small></button>';
  }).join("");
  $("#cookName").textContent = byId(P.cooking, st.cook).full;
  $("#fuel").innerHTML = P.fuels.map(function(f){ return '<button type="button" role="radio" aria-checked="' + (st.fuel === f.id) + '" data-k="fuel" data-v="' + f.id + '">' + f.name + '</button>'; }).join("");
  $("#addons").innerHTML = P.addons.map(function(a){
    var on = !!st.addons[a.id];
    return '<button type="button" role="checkbox" aria-checked="' + on + '" data-k="addon" data-v="' + a.id + '"><span class="ad-box">' + ICO("i-check") + '</span><span class="ad-t"><b>' + a.name + '</b><small>' + a.desc + '</small></span><span class="ad-p">+' + money(a.price) + '</span></button>';
  }).join("");
  var cook = byId(P.cooking, st.cook), total = P.price + cook.delta, extras = [];
  if (cook.delta) extras.push(cook.name + " +" + money(cook.delta));
  P.addons.forEach(function(a){ if (st.addons[a.id]){ total += a.price; extras.push(a.name + " +" + money(a.price)); } });
  $("#total").textContent = money(total);
  $("#lines").textContent = extras.length ? "Includes " + extras.join(", ") : "BBQ, sink and fridge included";
  $("#miniPrice").textContent = money(total);
  st.total = total;
}
$("#info").addEventListener("click", function(e){
  var b = e.target.closest("[data-k]"); if (!b) return;
  var k = b.dataset.k, v = b.dataset.v;
  if (k === "addon"){ if (st.addons[v]) delete st.addons[v]; else st.addons[v] = true; track(st.addons[v] ? "add_to_cart" : "remove_from_cart", { item:v }); }
  else { st[k] = v; track("option_select", { option:k, value:v }); }
  renderOptions();
  var again = $('[data-k="' + k + '"][data-v="' + v + '"]', $("#info")); if (again) again.focus({ preventScroll:true });
});
renderOptions();
$("#included").innerHTML = P.included.map(function(t){ return "<li>" + ICO("i-check") + t + "</li>"; }).join("");
var kv = function(rows){ return rows.map(function(r){ return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>"; }).join(""); };
$("#utilAcc").innerHTML = kv(P.utilities);
$("#specList").innerHTML = kv(P.specs.concat(P.utilities));
$("#reserveBtn").addEventListener("click", function(){
  $("#reserveMsg").textContent = "Prototype: this opens Shopify checkout for the " + money(P.deposit) + " deposit on this setup.";
  track("begin_checkout", { value: st.total, cook: st.cook, fuel: st.fuel, faces: st.faces, exterior: st.exterior, interior: st.interior, addons: Object.keys(st.addons).join(",") });
});

/* ---------- Scroll sequence: 30 rendered frames scrubbed by scroll. Loads only when near. ---------- */
(function(){
  var sec = $("#opens"), canvas = $("#seqCanvas"), ctx = canvas.getContext("2d"), N = 30, imgs = [], loaded = 0, last = -1, ticking = false;
  var steps = $$("#seqSteps li"), bar = $("#seqBar");
  if (reduce){ sec.classList.add("static"); return; }
  function src(i){ return "assets/frames/" + (i < 10 ? "0" : "") + i + ".webp"; }
  function load(){
    for (var i = 0; i < N; i++){ var im = new Image(); im.decoding = "async"; im.onload = function(){ loaded++; if (loaded === 1 || loaded === N){ last = -1; draw(); } }; im.src = src(i); imgs[i] = im; }
  }
  function size(){
    var r = canvas.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * d); canvas.height = Math.round(r.height * d); last = -1; draw();
  }
  function progress(){
    var r = sec.getBoundingClientRect(), span = r.height - innerHeight;
    return Math.max(0, Math.min(1, -r.top / span));
  }
  function draw(){
    ticking = false;
    var p = progress(), i = Math.min(N - 1, Math.round(p * 1.15 * (N - 1)));
    bar.style.transform = "scaleX(" + p + ")";
    var s = p < .3 ? 0 : p < .62 ? 1 : 2;
    steps.forEach(function(li, j){ li.classList.toggle("on", j === s); });
    var im = imgs[i];
    while (im && !im.complete && i > 0) im = imgs[--i];
    if (!im || !im.complete || i === last) return;
    last = i;
    var cw = canvas.width, ch = canvas.height, sc = Math.min(cw / im.naturalWidth, ch / im.naturalHeight) * (cw > ch ? 1 : 1.45);
    var w = im.naturalWidth * sc, h = im.naturalHeight * sc;
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(im, (cw - w) / 2 + (cw > ch ? cw * .12 : 0), (ch - h) / 2 + (cw > ch ? 0 : -ch * .16), w, h);
  }
  function req(){ if (!ticking){ ticking = true; requestAnimationFrame(draw); } }
  new IntersectionObserver(function(en, o){ if (en[0].isIntersecting){ o.disconnect(); load(); size(); addEventListener("scroll", req, { passive:true }); addEventListener("resize", size); } }, { rootMargin:"150% 0px" }).observe(sec);
})();

/* ---------- Sticky subnav: active section ---------- */
var links = $$(".subnav a"), secs = links.map(function(a){ return document.getElementById(a.getAttribute("href").slice(1)); });
function activeSec(){
  var y = innerHeight * .35, on = -1;
  secs.forEach(function(s, i){ if (s && s.getBoundingClientRect().top < y) on = i; });
  links.forEach(function(a, i){ a.classList.toggle("on", i === on); });
  var a = links[on]; if (a && a.scrollIntoView && innerWidth < 760) a.parentNode.scrollTo({ left: a.offsetLeft - 16 });
}

/* ---------- Mini buy box: after the hero, hidden while the buy box or footer is on screen ---------- */
var mini = $("#mini"), miniLink = $("a", mini), hero = $(".hero"), buy = $("#buy"), foot = $(".ft");
function onScroll(){
  $("#hd").classList.toggle("solid", scrollY > 10);
  var bR = buy.getBoundingClientRect(), fR = foot.getBoundingClientRect();
  var qR = $("#opens").getBoundingClientRect();
  var show = hero.getBoundingClientRect().bottom < 0 && !(bR.top < innerHeight && bR.bottom > 0) && !(qR.top < innerHeight * .5 && qR.bottom > innerHeight * .5) && fR.top > innerHeight;
  mini.classList.toggle("show", show); mini.setAttribute("aria-hidden", String(!show)); miniLink.tabIndex = show ? 0 : -1;
  activeSec();
}
addEventListener("scroll", onScroll, { passive:true }); onScroll();

/* ---------- In-page links ---------- */
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href").length < 2) return;
  var t = document.getElementById(a.getAttribute("href").slice(1)); if (!t) return;
  e.preventDefault(); t.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  if (a.dataset.cta) track("cta_click", { cta: a.dataset.cta });
});

/* ---------- Forms ---------- */
var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
$("#cbForm").addEventListener("submit", function(e){
  e.preventDefault(); var f = e.target, m = $(".msg", f);
  if (f.name.value.trim().length < 2 || !EMAIL.test(f.email.value) || !/^\d{5}(-\d{4})?$/.test(f.zip.value.trim())){ m.textContent = "Please add your name, an email address and a 5-digit ZIP code."; return; }
  m.textContent = "Thank you. A specialist will call you within one business day."; $("button", f).disabled = true; track("generate_lead", { form:"callback" });
});
$("#newsForm").addEventListener("submit", function(e){
  e.preventDefault(); var m = $(".msg", e.target);
  if (!EMAIL.test($("#newsEmail").value)){ m.textContent = "Enter an email like name@example.com."; return; }
  m.textContent = "You're on the list."; track("newsletter_signup", {});
});
$$(".faq details").forEach(function(d){ d.addEventListener("toggle", function(){ if (d.open) track("faq_expand", { question: $("summary", d).textContent }); }); });

/* ---------- Quiet reveal ---------- */
if (!reduce && "IntersectionObserver" in window){
  document.documentElement.classList.add("rise-on");
  var io = new IntersectionObserver(function(en){ en.forEach(function(x){ if (x.isIntersecting){ x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin:"0px 0px -8% 0px" });
  $$("[data-rise], .panel-fig").forEach(function(el){ io.observe(el); });
}
track("view_item", { value: P.price });
})();
