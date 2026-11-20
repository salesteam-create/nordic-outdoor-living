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

/* ---------- How it opens: the front-view POD model. Scroll lifts the roof in perspective, then the lights come on. ---------- */
(function(){
  var sec = $("#opens"); if (!sec || !$("#podModel")) return;
  var stage = $("#seqStage"), model = $("#podModel"), steps = $$("#seqSteps li"), bar = $("#seqBar"), tag = $("#seqTag"),
      NAMES = ["Closed", "Lift", "Light", "Cook"], ticking = false;
  function clamp(v){ return v < 0 ? 0 : v > 1 ? 1 : v; }
  function ease(a, b, p){ var t = clamp((p - a) / (b - a)); return t * t * (3 - 2 * t); }
  var struts = $$("#pmStruts path"), D = 2600, OX = 500, OY = 860 * .7, HINGE = 150, RH = 334;
  function fit(){
    // leave room above for the lifted roof
    var s = Math.min(stage.clientWidth / 1080, stage.clientHeight / 1000);
    model.style.transform = "translateY(" + (40 * s).toFixed(1) + "px) scale(" + s.toFixed(4) + ")";
    draw();
  }
  // where a point on the roof lands on screen, using the same perspective as the CSS
  function proj(x, ly, a){
    var y = HINGE + ly * Math.cos(a), z = ly * Math.sin(a), k = D / (D - z);
    return [OX + (x - OX) * k, OY + (y - OY) * k];
  }
  function strut(i, base, top){
    // gas strut: a fat cylinder from the post, a thin rod up to the roof
    var mx = base[0] + (top[0] - base[0]) * .55, my = base[1] + (top[1] - base[1]) * .55;
    struts[i * 2].setAttribute("d", "M" + mx.toFixed(1) + " " + my.toFixed(1) + "L" + top[0].toFixed(1) + " " + top[1].toFixed(1));
    struts[i * 2 + 1].setAttribute("d", "M" + base[0] + " " + base[1] + "L" + mx.toFixed(1) + " " + my.toFixed(1));
  }
  function progress(){
    var r = sec.getBoundingClientRect(), stick = stickH(), span = r.height - (innerHeight - stick);
    return span > 0 ? clamp((stick - r.top) / span) : 0;
  }
  function draw(){
    ticking = false;
    var p = sec.classList.contains("static") ? 1 : progress();
    var lift = ease(.1, .55, p), light = ease(.58, .74, p);
    model.style.setProperty("--lift", lift.toFixed(4));
    model.style.setProperty("--light", light.toFixed(4));
    var ang = lift * 100 * Math.PI / 180;
    strut(0, [56, 430], proj(70, RH * .62, ang)); strut(1, [944, 430], proj(930, RH * .62, ang));
    $("#pmStruts").style.opacity = ease(.18, .32, p).toFixed(3);
    bar.style.transform = "scaleX(" + p.toFixed(4) + ")";
    var s = p < .1 ? 0 : p < .56 ? 1 : p < .78 ? 2 : 3;
    steps.forEach(function(li, j){ li.classList.toggle("on", j === s); });
    tag.textContent = NAMES[s];
  }
  if (reduce) sec.classList.add("static");
  else addEventListener("scroll", function(){ if (!ticking){ ticking = true; requestAnimationFrame(draw); } }, { passive:true });
  addEventListener("resize", fit);
  fit();
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

/* ---------- Hero title: each letter flips a full turn on its centre line, left to right, every 4.5 s ---------- */
(function(){
  var h = $("#h-hero"); if (!h || reduce) return;
  var text = h.textContent, n = 0, hero = $(".hero"), seen = true;
  h.setAttribute("aria-label", text);
  h.innerHTML = text.split(" ").map(function(w){
    return '<span class="wd" aria-hidden="true">' + w.split("").map(function(c){
      return '<span class="ch" style="--i:' + (n++) + '">' + c + "</span>";
    }).join("") + "</span>";
  }).join(" ");
  var total = 700 + n * 45 + 60;
  function run(){
    if (!seen || document.hidden) return;
    h.classList.remove("roll"); void h.offsetWidth; h.classList.add("roll");
    // a full turn ends where it started, so dropping the class afterwards resets with no visible jump
    setTimeout(function(){ h.classList.remove("roll"); }, total);
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
