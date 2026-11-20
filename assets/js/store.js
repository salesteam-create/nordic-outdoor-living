/* NOL store: shared by the homepage (index.html) and the product page (product.html). Every block checks its section exists. Plain JS, no libraries, so it drops into a Shopify theme as-is.
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
function stickH(){ var sn = $("#subnav"); return $("#hd").offsetHeight + (sn ? sn.offsetHeight : 0); }
var ICO = function(id){ return '<svg class="ico"><use href="#' + id + '"/></svg>'; };

$$("[data-price]").forEach(function(el){ el.textContent = money(P.price); });
$$("[data-monthly]").forEach(function(el){ el.textContent = money(P.monthly); });
$$("[data-deposit]").forEach(function(el){ el.textContent = money(P.deposit); });

/* ---------- Card rails ---------- */
if ($("#featCards")){
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
}
if ($("#detCards")) $("#detCards").innerHTML = DETAILS.map(function(d){
  return '<figure class="dcard' + (d.dark ? " dark" : "") + '"><img src="' + d.img + '" alt="" loading="lazy"><figcaption>' + d.t + '</figcaption></figure>';
}).join("");
if ($("#stepCards")) $("#stepCards").innerHTML = STEPS.map(function(s){
  return '<article class="scard" data-rise><span class="chip"><i>' + s.n + '</i>' + s.k + '</span><h3>' + s.t + '</h3><p>' + s.d + '</p></article>';
}).join("");
$$(".arrows").forEach(function(a){
  var rail = document.getElementById(a.dataset.for); if (!rail) return;
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

/* ---------- Pinned sections: vertical scroll drives the cards sideways ---------- */
(function(){
  var secs = $$(".hs").map(function(sec){
    var track = $(".hs-track", sec), n = track.children.length;
    $(".hs-all", sec).textContent = (n < 10 ? "0" : "") + n;
    return { sec:sec, track:track, n:n, bar:$(".hs-bar span", sec), now:$(".hs-now", sec), travel:0 };
  });
  if (reduce || !secs.length) return; // falls back to swipeable rows
  document.documentElement.classList.add("hs-on");
  var stick = 0, ticking = false;
  function measure(){
    stick = stickH();
    document.documentElement.style.setProperty("--stick", stick + "px");
    secs.forEach(function(o){
      o.travel = Math.max(0, o.track.scrollWidth - innerWidth);
      o.sec.style.height = (innerHeight - stick + o.travel) + "px";
    });
    update();
  }
  function update(){
    ticking = false;
    secs.forEach(function(o){
      var r = o.sec.getBoundingClientRect(), span = r.height - (innerHeight - stick);
      var p = span > 0 ? Math.max(0, Math.min(1, (stick - r.top) / span)) : 0;
      o.track.style.transform = "translate3d(" + (-o.travel * p).toFixed(1) + "px,0,0)";
      o.bar.style.transform = "scaleX(" + p + ")";
      var i = Math.min(o.n, Math.round(p * (o.n - 1)) + 1); o.now.textContent = (i < 10 ? "0" : "") + i;
    });
  }
  addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }, { passive:true });
  addEventListener("resize", measure);
  addEventListener("load", measure);
  measure();
})();

/* ---------- POD showcase, pinned and driven by scroll:
   1. the wordmark sinks away  2. a white line sketch of the POD draws itself on the sage, with dimension lines
   3. the photo takes its place  4. it grows to full screen  5. the camera zooms to four features with callouts
   6. it pulls back to the sizes and Reserve ---------- */
(function(){
  var sec = $("#pod"); if (!sec || !$(".sage-pin", sec)) return;
  var pin = $(".sage-pin", sec), media = $(".sage-media", sec), art = $(".sage-art", sec), photo = $("img", art), sketch = $(".sage-sketch", sec),
      groups = $$(".sage-sketch g[data-g]", sec), dims = $(".sk-dims", sec), word = $(".sage-word", sec), top = $(".sage-top", sec),
      shade = $(".sage-shade", sec), fshade = $(".sage-fshade", sec), end = $(".sage-end", sec), endLink = $("a", end),
      texts = $$(".co-text", sec), line = $(".co-line", sec), dot = $(".co-dot", sec);
  var IW = 1170, IH = 780, L = {}, ticking = false;
  // focus points in photo pixels, and how far to zoom
  var SPOTS = [ { fx:1005, fy:300, s:2.1 }, { fx:300, fy:480, s:2.1 }, { fx:616, fy:480, s:2 }, { fx:886, fy:595, s:2 } ];
  var DRAW = [ [.03, .1], [.07, .14], [.11, .18], [.16, .22] ], PHOTO = [.25, .31], GROW = [.3, .42];
  var F0 = .45, FS = .11, FEND = .9;
  function clamp(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(a, b, p){ var t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); }
  function mix(a, b, t){ return a + (b - a) * t; }
  function measure(){
    var W = pin.clientWidth, H = pin.clientHeight;
    word.style.fontSize = "100px";
    var size = 100 * (W - 2 * Math.max(12, W * .02)) / word.offsetWidth;
    size = Math.min(size, H * .5 / .74);
    word.style.fontSize = size.toFixed(1) + "px";
    // the drawing (with its dimension lines) fits the space under the headline; the wordmark is gone by then
    var zone = top.offsetTop + top.offsetHeight + 28, aw = Math.min(W * .84, W - 32), ah = H - zone - 28;
    var u = Math.min(aw / 1060, ah / 650);
    var w = IW * u, h = IH * u;
    L = { W:W, H:H, capH:size * .72, u:u, x:W / 2 - 590 * u, y:zone + ah / 2 - 512 * u, w:w, h:h, mob:W < 860 };
    update();
  }
  function progress(){
    var r = sec.getBoundingClientRect(), stick = stickH(), span = r.height - (innerHeight - stick);
    return span > 0 ? clamp((stick - r.top) / span) : 0;
  }
  function blend(a, b, t){ return { fx:mix(a.fx, b.fx, t), fy:mix(a.fy, b.fy, t), s:mix(a.s, b.s, t), ov:mix(a.ov || 0, b.ov || 0, t) }; }
  function state(p){
    var ov = { fx:IW / 2, fy:IH / 2, s:1, ov:1 }, list = [ov].concat(SPOTS);
    if (p >= FEND) return blend(SPOTS[3], ov, ease(FEND, FEND + .04, p));
    for (var i = SPOTS.length - 1; i >= 0; i--){ var t0 = F0 + i * FS; if (p >= t0) return blend(list[i], list[i + 1], ease(t0, t0 + .03, p)); }
    return ov;
  }
  function update(){
    ticking = false;
    var stat = sec.classList.contains("static"), q = stat ? .23 : progress();
    // 1. wordmark sinks before anything is drawn, so the two never overlap
    var w = ease(0, .06, q);
    word.style.transform = "translate(-50%," + (w * L.capH * 1.1).toFixed(1) + "px)";
    word.style.opacity = (1 - ease(.01, .05, q)).toFixed(3);
    // 2. sketch
    groups.forEach(function(gr, i){ gr.style.setProperty("--d", (1 - ease(DRAW[i][0], DRAW[i][1], q)).toFixed(4)); });
    dims.style.opacity = ease(.2, .23, q).toFixed(3);
    // 3. photo replaces the drawing; headline leaves
    var ph = ease(PHOTO[0], PHOTO[1], q);
    photo.style.opacity = ph.toFixed(3);
    sketch.style.opacity = (1 - ease(PHOTO[0] + .02, PHOTO[1], q)).toFixed(3);
    media.classList.toggle("lit", ph > .02);
    var t = ease(.21, .25, q);
    top.style.opacity = (1 - t).toFixed(3); top.style.transform = "translateY(" + (-24 * t).toFixed(1) + "px)";
    // 4. grow to full screen
    var g = ease(GROW[0], GROW[1], q), mw = L.w + (L.W - L.w) * g, mh = L.h + (L.H - L.h) * g;
    media.style.left = (L.x * (1 - g)).toFixed(1) + "px";
    media.style.top = (L.y * (1 - g)).toFixed(1) + "px";
    media.style.width = mw.toFixed(1) + "px";
    media.style.height = mh.toFixed(1) + "px";
    media.style.borderRadius = (8 * (1 - g)).toFixed(1) + "px";
    // 5. camera
    var k = Math.max(mw / IW, mh / IH), aw = IW * k, ah = IH * k, ax = (mw - aw) / 2, ay = (mh - ah) / 2;
    var cam = state(q), X = L.mob ? mw * .5 : mw * .64, Y = L.mob ? mh * .34 : mh * .5;
    X = mix(X, ax + aw / 2, cam.ov); Y = mix(Y, ay + ah / 2, cam.ov);
    var tx = X - ax - cam.s * cam.fx * k, ty = Y - ay - cam.s * cam.fy * k;
    if (g > 0){ tx = Math.min(-ax, Math.max(mw - ax - cam.s * aw, tx)); ty = Math.min(-ay, Math.max(mh - ay - cam.s * ah, ty)); }
    art.style.left = ax.toFixed(1) + "px"; art.style.top = ay.toFixed(1) + "px";
    art.style.width = aw.toFixed(1) + "px"; art.style.height = ah.toFixed(1) + "px";
    art.style.transform = "translate(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px) scale(" + cam.s.toFixed(4) + ")";
    sketch.style.strokeWidth = (1.5 * IW / (aw * cam.s)).toFixed(3); // a steady 1.5 px line at any size
    // callouts
    var vis = 0, on = -1;
    texts.forEach(function(el, i){
      var t0 = F0 + i * FS, v = ease(t0 + .02, t0 + .04, q) - (i < 3 ? ease(t0 + .09, t0 + .105, q) : ease(FEND - .015, FEND, q));
      v = stat ? 0 : clamp(v);
      el.style.opacity = v.toFixed(3);
      el.style.transform = L.mob ? "translateY(" + (16 * (1 - v)).toFixed(1) + "px)" : "translateY(calc(-50% + " + (16 * (1 - v)).toFixed(1) + "px))";
      if (v > vis){ vis = v; on = i; }
    });
    fshade.style.opacity = vis.toFixed(3);
    if (on >= 0){
      var sp = SPOTS[on], px = ax + tx + cam.s * sp.fx * k, py = ay + ty + cam.s * sp.fy * k, el = texts[on];
      var x1 = L.mob ? px : el.offsetLeft + el.offsetWidth + 20, y1 = L.mob ? el.offsetTop - 16 : py;
      var dx = px - x1, dy = py - y1, len = Math.sqrt(dx * dx + dy * dy) - 9;
      line.style.left = x1.toFixed(1) + "px"; line.style.top = y1.toFixed(1) + "px";
      line.style.width = Math.max(0, len * vis).toFixed(1) + "px";
      line.style.transform = "rotate(" + Math.atan2(dy, dx) + "rad)";
      dot.style.left = px.toFixed(1) + "px"; dot.style.top = py.toFixed(1) + "px";
    }
    line.style.opacity = dot.style.opacity = vis.toFixed(3);
    // 6. sizes and Reserve over the whole photo
    shade.style.opacity = ease(.92, .96, q).toFixed(3);
    var e = ease(.94, .98, q);
    end.style.opacity = e.toFixed(3); end.style.transform = "translateY(" + (24 * (1 - e)).toFixed(1) + "px)";
    var shown = e > .5; end.classList.toggle("on", shown); end.setAttribute("aria-hidden", String(!shown)); endLink.tabIndex = shown ? 0 : -1;
  }
  if (reduce) sec.classList.add("static");
  else addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }, { passive:true });
  addEventListener("resize", measure);
  addEventListener("load", measure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  measure();
})();

/* ---------- Product page: gallery and configurator ---------- */
var st = { cook:"bbq", fuel:"propane", addons:{}, total:P.price };
P.finish.forEach(function(f){ st[f.id] = f.def; });
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; }
var kv = function(rows){ return rows.map(function(r){ return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>"; }).join(""); };
if ($("#specList")) $("#specList").innerHTML = kv(P.specs.concat(P.utilities));
if ($("#miniPrice")) $("#miniPrice").textContent = "From " + money(P.price);
/* "In the box" cards on the product page; the cooking card follows the buy box choice */
function renderIncluded(){
  var g = $("#incGrid"); if (!g) return;
  var ck = byId(P.cooking, st.cook);
  var items = [
    { img:"assets/frames/00.webp", dark:true, t:"Shell with lift-up roof", d:"Black frame, white or grey panels. The roof lifts by hand on gas struts." },
    { img:"assets/parts/sink-cabinet.jpg", t:"Sink cabinet", d:"Stainless sink, black faucet, plumbing kit and grey water tank." },
    { img:"assets/parts/bbq-cabinet.jpg", t:"BBQ cabinet", d:"Vented cooking slot with two deep drawers underneath." },
    { img:ck.img, t:ck.full, d:ck.delta ? "Your choice, +" + money(ck.delta) + " over the BBQ." : "Standard. Swap for a griddle, pizza oven or smoker." },
    { img:"assets/parts/fridge.jpg", t:"Glass-door fridge", d:"Stainless, tempered glass, adjustable shelves. 110 V." }
  ];
  g.innerHTML = items.map(function(it){
    return '<article class="inc' + (it.dark ? " dark" : "") + '"><img src="' + it.img + '" alt="" loading="lazy"><h3>' + it.t + '</h3><p>' + it.d + '</p></article>';
  }).join("");
}
if ($("#stage")){
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

/* Configurator */

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
  renderIncluded();
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
$("#utilAcc").innerHTML = kv(P.utilities);
$("#reserveBtn").addEventListener("click", function(){
  $("#reserveMsg").textContent = "Prototype: this opens Shopify checkout for the " + money(P.deposit) + " deposit on this setup.";
  track("begin_checkout", { value: st.total, cook: st.cook, fuel: st.fuel, faces: st.faces, exterior: st.exterior, interior: st.interior, addons: Object.keys(st.addons).join(",") });
});
}

/* ---------- Closer look: one feature open at a time. The pill grows into its card (size animated), the others move to make room,
   the image crossfades to that feature. Arrows step through; the close button goes back to the whole POD. ---------- */
(function(){
  var cx = $("#cx"); if (!cx) return;
  var items = $$(".fx", cx), imgs = $$(".cx-img", cx), arrows = $$(".cx-arrow", cx), cur = -1, EASE = "cubic-bezier(.45,0,.2,1)", DUR = reduce ? 0 : 460;
  function size(el){ var r = el.getBoundingClientRect(); return { w:r.width, h:r.height }; }
  // switch an item's state and animate its box from the old size to the new one
  function morph(el, open){
    var a = size(el);
    el.classList.toggle("open", open);
    $(".fx-pill", el).setAttribute("aria-expanded", String(open));
    var b = size(el);
    if (!DUR || !el.animate) return;
    el.classList.add(open ? "enter" : "leave");
    var an = el.animate([{ width:a.w + "px", height:a.h + "px" }, { width:b.w + "px", height:b.h + "px" }], { duration:DUR, easing:EASE });
    an.onfinish = function(){ el.classList.remove("enter", "leave"); };
  }
  function show(i){
    var key = i < 0 ? "overview" : String(i);
    imgs.forEach(function(im){ im.classList.toggle("on", im.dataset.k === key); });
  }
  function open(i){
    if (i === cur) return;
    if (cur >= 0) morph(items[cur], false);
    cur = i;
    if (i >= 0){ morph(items[i], true); track("feature_card_open", { card: $(".fx-pill", items[i]).textContent.trim() }); }
    cx.classList.toggle("is-open", i >= 0);
    arrows[0].disabled = i <= 0; arrows[1].disabled = i >= items.length - 1;
    show(i);
  }
  items.forEach(function(el, i){ $(".fx-pill", el).addEventListener("click", function(){ open(i); }); });
  arrows.forEach(function(b){ b.addEventListener("click", function(){ var n = cur + +b.dataset.step; if (n >= 0 && n < items.length) open(n); }); });
  $(".cx-close", cx).addEventListener("click", function(){ open(-1); });
  cx.addEventListener("keydown", function(e){ if (e.key === "Escape" && cur >= 0) open(-1); });
})();

/* ---------- Statement: while pinned, each word and frame comes out of a blur in reading order ---------- */
(function(){
  var sec = $("#said"); if (!sec) return;
  var bits = $$(".said-h .w, .said-h .m", sec), link = $(".said-link", sec), vids = $$("video", sec), n = bits.length, ticking = false;
  // clips load only when the section is close
  new IntersectionObserver(function(en, o){
    if (!en[0].isIntersecting) return; o.disconnect();
    vids.forEach(function(v){ v.src = v.dataset.src; if (!reduce){ var pr = v.play(); if (pr && pr.catch) pr.catch(function(){}); } });
  }, { rootMargin:"60% 0px" }).observe(sec);
  if (reduce){ sec.classList.add("static"); return; }
  function clamp(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
  function draw(){
    ticking = false;
    var r = sec.getBoundingClientRect(), stick = stickH(), span = r.height - (innerHeight - stick);
    // start a little before the pin so the first words are already forming as the section arrives
    var p = clamp(((stick - r.top) / span) * 1.25 + .06), head = p * (n + 3);
    bits.forEach(function(el, i){
      var t = clamp((head - i) / 3), e = t * t * (3 - 2 * t);
      el.style.opacity = (.08 + .92 * e).toFixed(3);
      el.style.filter = e > .995 ? "none" : "blur(" + (14 * (1 - e)).toFixed(2) + "px)";
      el.style.transform = "translateY(" + (.18 * (1 - e)).toFixed(3) + "em)";
    });
    var l = clamp((head - n) / 2);
    link.style.opacity = l.toFixed(3); link.style.transform = "translateY(" + (12 * (1 - l)).toFixed(1) + "px)";
  }
  addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(draw); } }, { passive:true });
  addEventListener("resize", draw);
  draw();
})();

/* ---------- Specs: a line drawing of the POD in 3D. Scroll draws it, shows the rear utility panel,
   turns it to the front and explodes it into its parts. Plain SVG, rebuilt each frame from simple boxes. ---------- */
(function(){
  var sec = $("#specs"); if (!sec || !$("#xpSvg")) return;
  var svg = $("#xpSvg"), steps = $$("#xpSteps li"), bar = $("#xpBar"), ticking = false, NS = "http://www.w3.org/2000/svg";
  function clamp(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(a, b, p){ var t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); }
  function mix(a, b, t){ return a + (b - a) * t; }
  var R = Math.PI / 180, E = 24 * R;

  /* parts: boxes in inches (x across, d front to back, z up), how far each one moves when exploded, and line details per face */
  function box(id, x0, x1, d0, d1, z0, z1, off, det){ return { id:id, b:[x0, x1, d0, d1, z0, z1], off:off, det:det || {} }; }
  var slats = [], i;
  for (i = 6; i < 120; i += 6) slats.push([i, 2, i, 78]);
  var roofLines = [];
  for (i = 8; i < 58; i += 8) roofLines.push([0, i, 124, i]);
  var PARTS = [
    box("plinth", 4, 116, 6, 38, 0, 4, [0, 0, -10]),
    box("postL", 0, 4, 0, 40, 4, 84, [-18, 0, 0]),
    box("postR", 116, 120, 0, 40, 4, 84, [18, 0, 0]),
    box("wall", 4, 116, 34, 40, 4, 84, [0, 30, 4], { front:slats,
      back:{ rects:[[40, 12, 64, 24]], circles:[[44, 18, 1.6], [49, 18, 1.6], [54, 18, 1.6], [59, 18, 1.6], [62, 14.5, 1]] } }),
    box("sinkCab", 6, 42, 8, 33, 4, 36, [-10, -16, 0], { front:{ rects:[[1, 1, 17.5, 31], [18.5, 1, 35, 31]], lines:[[16, 17, 16, 26], [20.5, 17, 20.5, 26]] } }),
    box("bbqCab", 42, 80, 8, 33, 4, 36, [0, -16, 0], { front:{ rects:[[1, 1, 37, 15], [1, 16, 37, 31]], lines:[[13, 11, 25, 11], [13, 27, 25, 27]] } }),
    box("fridge", 80, 114, 8, 33, 4, 36, [10, -16, 0], { front:{ rects:[[4, 5, 31, 30]], lines:[[2.5, 9, 2.5, 26], [5, 13.5, 30, 13.5], [5, 21.5, 30, 21.5], [6, 2.2, 29, 2.2], [6, 3.4, 29, 3.4]] } }),
    box("counter", 4, 116, 6, 34, 36, 38, [0, 0, 20], { top:{ rects:[[10, 6, 32, 21], [12, 8, 30, 19]] } }),
    box("faucet", 20, 22, 26, 28, 38, 47, [0, 0, 20]),
    box("bbq", 46, 76, 12, 30, 38, 48, [0, 0, 36], { front:{ lines:[[0, 6.5, 30, 6.5], [4, 8.2, 26, 8.2]], circles:[[6, 3.2, 1.5], [12, 3.2, 1.5], [18, 3.2, 1.5], [24, 3.2, 1.5]] }, top:{ circles:[[15, 9, 1.8]] } }),
    box("roof", -2, 122, -14, 44, 84, 88, [0, 0, 48], { top:{ lines:roofLines } })
  ];
  /* rear connections: port on the panel, then out behind the POD to a label on the ground */
  var PIPES = [
    { x:76, z:22, lx:122, ld:70, ty:6, label:"Power" }, { x:71, z:22, lx:92, ld:70, ty:15, label:"Gas" }, { x:66, z:22, lx:62, ld:70, ty:6, label:"Hot water" },
    { x:61, z:22, lx:32, ld:70, ty:15, label:"Cold water" }, { x:58, z:18.5, lx:2, ld:70, ty:6, label:"Grey water" }
  ];
  /* exploded callouts: point on the part, which side the label sits */
  var CALLS = [
    { part:"roof", p:[100, -14, 88], t:"Lift-up roof", side:1 },
    { part:"wall", p:[112, 34, 70], t:"Slatted back wall", side:1 },
    { part:"bbq", p:[46, 12, 44], t:"Built-in BBQ", side:-1 },
    { part:"counter", p:[8, 6, 38], t:"Countertop", side:-1 },
    { part:"sinkCab", p:[6, 8, 22], t:"Sink cabinet", side:-1 },
    { part:"fridge", p:[114, 20, 30], t:"Glass-door fridge", side:1 },
    { part:"bbqCab", p:[44, 8, 8], t:"Two-drawer cabinet", side:-1 }
  ];
  var BY = {}; PARTS.forEach(function(pt){ BY[pt.id] = pt; });

  var cam, rv, uv;
  function setCam(th){
    var s = Math.sin(th), c = Math.cos(th);
    cam = [s * Math.cos(E), -c * Math.cos(E), Math.sin(E)];
    rv = [c, s, 0];
    uv = [-s * Math.sin(E), c * Math.sin(E), Math.cos(E)];
  }
  function P(p){ return [p[0] * rv[0] + p[1] * rv[1], -(p[0] * uv[0] + p[1] * uv[1] + p[2] * uv[2])]; }
  function far(p){ return -(p[0] * cam[0] + p[1] * cam[1] + p[2] * cam[2]); }
  // a face: plane mapping from face coords (u, v) to the world, its normal and size
  function faces(b){
    var x0 = b[0], x1 = b[1], d0 = b[2], d1 = b[3], z0 = b[4], z1 = b[5];
    return [
      { k:"front", n:[0, -1, 0], w:x1 - x0, h:z1 - z0, m:function(u, v){ return [x0 + u, d0, z0 + v]; } },
      { k:"back",  n:[0, 1, 0],  w:x1 - x0, h:z1 - z0, m:function(u, v){ return [x1 - u, d1, z0 + v]; } },
      { k:"right", n:[1, 0, 0],  w:d1 - d0, h:z1 - z0, m:function(u, v){ return [x1, d0 + u, z0 + v]; } },
      { k:"left",  n:[-1, 0, 0], w:d1 - d0, h:z1 - z0, m:function(u, v){ return [x0, d1 - u, z0 + v]; } },
      { k:"top",   n:[0, 0, 1],  w:x1 - x0, h:d1 - d0, m:function(u, v){ return [x0 + u, d0 + v, z1]; } }
    ];
  }
  function pt(p){ var s = P(p); return s[0].toFixed(2) + " " + s[1].toFixed(2); }
  function poly(m, pts){ return "M" + pts.map(function(q){ return pt(m(q[0], q[1])); }).join("L") + "Z"; }
  function line(m, a){ return "M" + pt(m(a[0], a[1])) + "L" + pt(m(a[2], a[3])); }
  function circ(m, c){ var s = "", k; for (k = 0; k <= 24; k++){ var a = k / 24 * 2 * Math.PI; s += (k ? "L" : "M") + pt(m(c[0] + Math.cos(a) * c[2], c[1] + Math.sin(a) * c[2])); } return s + "Z"; }
  function moved(pt0, ex){ var o = pt0.off; return pt0.b.map(function(v, j){ return v + o[j >> 1] * ex; }); }
  function addOff(p, part, ex){ var o = BY[part].off; return [p[0] + o[0] * ex, p[1] + o[1] * ex, p[2] + o[2] * ex]; }

  function state(p){
    return { draw:ease(0, .2, p), panel:ease(.2, .3, p) - ease(.42, .5, p), th:mix(150, 32, ease(.42, .6, p)) * R, ex:ease(.62, .86, p), call:ease(.84, .92, p) };
  }
  function build(s){
    setCam(s.th);
    var out = [], list = PARTS.map(function(pt0, idx){ var b = moved(pt0, s.ex); return { pt:pt0, b:b, idx:idx, f:far([(b[0] + b[1]) / 2, (b[2] + b[3]) / 2, (b[4] + b[5]) / 2]) }; });
    list.sort(function(a, b){ return b.f - a.f; });
    list.forEach(function(it){
      var t = clamp(s.draw * 1.6 - it.idx / PARTS.length * .6), d = (1 - t).toFixed(3), det = it.pt.det;
      faces(it.b).forEach(function(f){
        if (f.n[0] * cam[0] + f.n[1] * cam[1] + f.n[2] * cam[2] <= .02) return;
        out.push('<path class="xf" style="fill-opacity:' + (t * t).toFixed(3) + ';stroke-dashoffset:' + d + '" pathLength="1" d="' + poly(f.m, [[0, 0], [f.w, 0], [f.w, f.h], [0, f.h]]) + '"/>');
        var dd = det[f.k]; if (!dd || t < .6) return;
        var o = clamp((t - .6) / .4).toFixed(3), segs = Array.isArray(dd) ? { lines:dd } : dd, path = "";
        (segs.lines || []).forEach(function(a){ path += line(f.m, a); });
        (segs.rects || []).forEach(function(r){ path += poly(f.m, [[r[0], r[1]], [r[2], r[1]], [r[2], r[3]], [r[0], r[3]]]); });
        (segs.circles || []).forEach(function(c){ path += circ(f.m, c); });
        var cls = it.pt.id === "wall" && f.k === "back" ? "xd xpanel" : "xd";
        out.push('<path class="' + cls + '" style="opacity:' + o + '" d="' + path + '"/>');
      });
    });
    // rear connections
    if (s.panel > .01){
      var g = '<g class="xpipes" style="opacity:' + s.panel.toFixed(3) + '">';
      PIPES.forEach(function(q, k){
        var a = addOff([q.x, 40, q.z], "wall", s.ex), b = addOff([q.x, 52, q.z], "wall", s.ex), c = addOff([q.lx, q.ld, 0], "wall", s.ex);
        var len = clamp(s.panel * 1.4 - k * .08);
        g += '<path pathLength="1" style="stroke-dashoffset:' + (1 - len).toFixed(3) + '" d="M' + pt(a) + "L" + pt(b) + "L" + pt([c[0], c[1], q.z]) + "L" + pt(c) + '"/>';
        var cs = P(c);
        g += '<circle cx="' + cs[0].toFixed(2) + '" cy="' + cs[1].toFixed(2) + '" r=".9"/><text x="' + cs[0].toFixed(2) + '" y="' + (cs[1] + q.ty).toFixed(2) + '" text-anchor="middle" style="opacity:' + clamp(len * 2 - 1).toFixed(3) + '">' + q.label + "</text>";
      });
      out.push(g + "</g>");
    }
    return out;
  }
  // fixed frame: the union of the drawing's bounds over the whole sequence, plus room for labels
  var VB;
  // frame what is on screen now: the parts (and the pipe labels while they show), scaled to fill the stage,
  // with fixed room in screen pixels for the labels at the sides
  var VB, FIT = 3, FMIN = 0, FW = 0;
  function frame(s, probe){
    setCam(s.th);
    var mnx = 1e9, mny = 1e9, mxx = -1e9, mxy = -1e9;
    function add(q){ mnx = Math.min(mnx, q[0]); mxx = Math.max(mxx, q[0]); mny = Math.min(mny, q[1]); mxy = Math.max(mxy, q[1]); }
    PARTS.forEach(function(pt0){ var b = moved(pt0, s.ex);
      [0, 1].forEach(function(a){ [2, 3].forEach(function(c){ [4, 5].forEach(function(e){ add(P([b[a], b[c], b[e]])); }); }); });
    });
    var box0 = [mnx, mny, mxx, mxy];
    PIPES.forEach(function(q){ var c = P(addOff([q.lx, q.ld, 0], "wall", s.ex)); add([c[0] - 9, c[1]]); add([c[0] + 9, c[1] + q.ty + 2]); });
    var t = clamp(s.panel * 3), bx = [mix(box0[0], mnx, t), mix(box0[1], mny, t), mix(box0[2], mxx, t), mix(box0[3], mxy, t)];
    var W = svg.clientWidth || 800, H = svg.clientHeight || 600, mob = innerWidth < 860;
    var padX = mob ? 8 : mix(40, 170, s.call), padY = mob ? 12 : 48, gw = bx[2] - bx[0], gh = bx[3] - bx[1];
    var f = Math.min((W - 2 * padX) / gw, (H - 2 * padY) / gh);
    if (probe) return f;
    // the most cramped stage sets the base zoom; others may zoom in a little, never more than 20%
    if (FW !== W + "x" + H){ FW = W + "x" + H; FMIN = 1e9; for (var q = 0; q <= 1.0001; q += .04) FMIN = Math.min(FMIN, frame(state(q), true)); }
    FIT = Math.min(f, FMIN * 1.2);
    var vw = W / FIT, vh = H / FIT, cx = (bx[0] + bx[2]) / 2, cy = (bx[1] + bx[3]) / 2;
    VB = [cx - vw / 2, cy - vh / 2, vw, vh];
    svg.setAttribute("viewBox", VB.map(function(v){ return v.toFixed(2); }).join(" "));
    svg.style.setProperty("--u", (1 / FIT).toFixed(4) + "px");
  }
  function callouts(s){
    if (s.call < .01) return "";
    setCam(s.th);
    var g = '<g class="xcall" style="opacity:' + s.call.toFixed(3) + '">', u = 1 / FIT, L = VB[0] + 4 * u, Rr = VB[0] + VB[2] - 4 * u, GAP = 30 * u;
    [-1, 1].forEach(function(side){
      var cs = CALLS.filter(function(c){ return c.side === side; }).map(function(c){ return { c:c, a:P(addOff(c.p, c.part, s.ex)) }; });
      cs.sort(function(m, n){ return m.a[1] - n.a[1]; });
      // labels keep their part's height where they can, pushed apart to at least GAP
      var ys = cs.map(function(o){ return o.a[1]; });
      for (var k = 1; k < ys.length; k++) ys[k] = Math.max(ys[k], ys[k - 1] + GAP);
      cs.forEach(function(o, k){
        var a = o.a, y = ys[k], tx = side < 0 ? L : Rr, ex = side < 0 ? L + 130 * u : Rr - 130 * u;
        g += '<circle cx="' + a[0].toFixed(2) + '" cy="' + a[1].toFixed(2) + '" r=".9"/><path d="M' + a[0].toFixed(2) + " " + a[1].toFixed(2) + "L" + (ex + side * -12 * u).toFixed(2) + " " + y.toFixed(2) + "L" + ex.toFixed(2) + " " + y.toFixed(2) + '"/>' +
          '<text x="' + tx.toFixed(2) + '" y="' + (y + 4.5 * u).toFixed(2) + '" text-anchor="' + (side < 0 ? "start" : "end") + '">' + o.c.t + "</text>";
      });
    });
    return g + "</g>";
  }
  function progress(){
    var r = sec.getBoundingClientRect(), stick = stickH(), span = r.height - (innerHeight - stick);
    return span > 0 ? clamp((stick - r.top) / span) : 1;
  }
  function draw(){
    ticking = false;
    var p = sec.classList.contains("static") ? 1 : progress(), s = state(p);
    // one screen pixel in drawing units, so line weights stay crisp at any size
    frame(s);
    svg.innerHTML = build(s).join("") + callouts(s);
    bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    var k = p < .2 ? 0 : p < .42 ? 1 : 2;
    steps.forEach(function(li, j){ li.classList.toggle("on", j === k); });
  }
  if (reduce) sec.classList.add("static");
  else addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(draw); } }, { passive:true });
  addEventListener("resize", draw);
  draw();
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
var mini = $("#mini"), miniLink = $("a", mini), hero = $(".hero"), zones = $$("[data-buyzone]"), seq = $("#opens"), pod = $("#pod"), foot = $(".ft");
function inView(el){ var r = el.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0; }
function onScroll(){
  $("#hd").classList.toggle("solid", scrollY > 10);
  var past = hero ? hero.getBoundingClientRect().bottom < 0 : scrollY > innerHeight * .6;
  var inSeq = seq && (function(r){ return r.top < innerHeight * .5 && r.bottom > innerHeight * .5; })(seq.getBoundingClientRect());
  var inPod = pod && (function(r){ return r.top < innerHeight * .5 && r.bottom > innerHeight * .5; })(pod.getBoundingClientRect());
  var show = past && !zones.some(inView) && !inSeq && !inPod && foot.getBoundingClientRect().top > innerHeight;
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

/* ---------- Hero title: TextRoll, run automatically every 4.5 s ----------
   Port of the supplied TextRoll component (stagger 35 ms from the centre, 0.3 s ease-in-out, y 0 to -100% and 100% to 0). */
(function(){
  var h = $("#h-hero"); if (!h || reduce) return;
  var text = h.textContent, STAGGER = 35, mid = (text.length - 1) / 2, k = 0, maxD = 0;
  h.setAttribute("aria-label", text);
  h.innerHTML = text.split(" ").map(function(w, wi){
    var start = k; k += w.length + 1;
    var letters = w.split("").map(function(c, i){
      var d = STAGGER * Math.abs(start + i - mid); maxD = Math.max(maxD, d);
      return '<span class="c" style="--d:' + d.toFixed(0) + 'ms">' + c + "</span>";
    }).join("");
    return '<span class="tr" aria-hidden="true"><span class="l1">' + letters + '</span><span class="l2">' + letters + "</span></span>";
  }).join(" ");
  var hero = $(".hero"), seen = true;
  function run(){
    if (!seen || document.hidden) return;
    h.classList.remove("roll"); void h.offsetWidth; h.classList.add("roll");
    // both copies are the same word, so dropping the class afterwards resets with no visible jump
    setTimeout(function(){ h.classList.remove("roll"); }, maxD + 360);
  }
  new IntersectionObserver(function(en){ seen = en[0].isIntersecting; }).observe(hero);
  setTimeout(run, 900); setInterval(run, 4500);
})();

/* ---------- Quiet reveal ---------- */
if (!reduce && "IntersectionObserver" in window){
  document.documentElement.classList.add("rise-on");
  var io = new IntersectionObserver(function(en){ en.forEach(function(x){ if (x.isIntersecting){ x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin:"0px 0px -8% 0px" });
  $$("[data-rise], .panel-fig").forEach(function(el){ io.observe(el); });
}
track("view_item", { value: P.price });
})();
