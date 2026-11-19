/* NOL homepage v4: everything outside the 3D stage. Prices come from catalog.js. */
(function(){
"use strict";
var C = window.NOL_CATALOG, money = C.money;
window.dataLayer = window.dataLayer || [];
function track(e, p){ var o = { event: e }; for (var k in p) o[k] = p[k]; window.dataLayer.push(o); }
window.NOL_track = track;
function $(s, r){ return (r || document).querySelector(s); }
function $$(s, r){ return [].slice.call((r || document).querySelectorAll(s)); }
var reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
var live = C.launched(), first = live[0];

/* ---------- Prices ---------- */
$$("[data-from]").forEach(function(el){ el.textContent = money(first.price); });
$$("[data-from-mo]").forEach(function(el){ el.textContent = money(first.monthly); });
$$("[data-deposit]").forEach(function(el){ el.textContent = money(C.PRODUCT.deposit); });
$$("[data-price]").forEach(function(el){ el.textContent = money(C.byId(C.PODS, el.dataset.price).price); });
$$("[data-cook-price]").forEach(function(el){ el.textContent = "+" + money(C.byId(C.COOKING, el.dataset.cookPrice).delta); });

/* ---------- Feature cards: one idea each, tap to read more ---------- */
var CARDS = [
  { img: "assets/pods/better.jpg", k: "Roof and gate", t: "Opens when you cook.", d: "The front gate lifts into a canopy on gas struts. Better and Best raise it with the Roof Motor Arm from one remote; Good opens by hand. Closed, the kitchen is sealed away from weather and leaves." },
  { img: "assets/parts/sink-cabinet.jpg", k: "Sink cabinet", t: "Water where you cook.", d: "Stainless sink with a black faucet, plumbing kit and grey water tank behind two doors. Hot and cold connect with 1/2 in PEX at the rear panel." },
  { img: "assets/parts/bbq.jpg", k: "Cooking slot", t: "One slot, four appliances.", d: "The vented BBQ cabinet takes a stainless BBQ as standard, or a pellet smoker, pizza oven or griddle. Two drawers below hold tools and fuel." },
  { img: "assets/parts/fridge.jpg", k: "Fridge", t: "Cold, right at the counter.", d: "Stainless outdoor fridge with a tempered glass door and adjustable shelves, in every POD. Runs on the same 110 V circuit." },
  { img: "assets/parts/control-module.jpg", k: "Control module", t: "One remote for everything.", d: "Lights, fan, heater, roller screen and roof from a single weather-resistant remote. Standard on Better and Best." },
  { img: "assets/parts/led-kit.jpg", k: "LED light kit", t: "Warm white, or any colour.", d: "Strips run along the roof perimeter and the toe kick. Choose warm white or RGB. Standard on Better and Best." },
  { img: "assets/parts/hood-fan.jpg", k: "Hood fan", t: "Clear air, bright counter.", d: "Stainless hood with baffle filters and LED task lights over the cooking slot. Available on Better and Best." },
  { img: "assets/parts/speakers.jpg", k: "Comfort", t: "Sound, air and heat.", d: "Best adds ceiling-mounted Bluetooth speakers, an adjustable fan and an infrared heater, all run from the control module." }
];
$("#cards").innerHTML = CARDS.map(function(c, i){
  return '<article class="card" data-rise><div class="ci"><img src="' + c.img + '" alt="" loading="lazy"></div>' +
    '<div class="cb"><p class="eyebrow">' + c.k + '</p><h3>' + c.t + '</h3>' +
    '<button type="button" class="more" aria-expanded="false" aria-controls="cd' + i + '"><svg class="ico"><use href="#i-plus"/></svg><span class="sr-only">Read more about ' + c.k + '</span></button></div>' +
    '<div class="cd" id="cd' + i + '"><p class="eyebrow">' + c.k + '</p><h3>' + c.t + '</h3><p>' + c.d + '</p></div></article>';
}).join("");
$("#cards").addEventListener("click", function(e){
  var b = e.target.closest(".more") || e.target.closest(".card.open");
  if (!b) return;
  var card = b.closest(".card"), open = !card.classList.contains("open");
  card.classList.toggle("open", open); card.querySelector(".more").setAttribute("aria-expanded", String(open));
  if (open) track("feature_card_open", { card: card.querySelector(".eyebrow").textContent });
});
$$("[data-scroll]").forEach(function(b){
  b.addEventListener("click", function(){ var el = $("#cards"); el.scrollBy({ left: +b.dataset.scroll * el.clientWidth * .75, behavior: reduceMotion ? "auto" : "smooth" }); });
});

/* ---------- POD cards ---------- */
var CHECK = '<svg class="ico"><use href="#i-check"/></svg>';
$("#podCards").innerHTML = live.map(function(p, i){
  var prev = live[i - 1];
  return '<article class="pod' + (p.popular ? " pop" : "") + '" data-rise>' + (p.popular ? '<span class="flag">Most chosen</span>' : "") +
    '<div class="pi"><img src="' + p.img + '" alt="The NOL ' + p.name + ' POD" loading="lazy"></div>' +
    '<div class="pb"><p class="eyebrow">POD ' + p.num + ' · ' + p.size.w + ' ft</p><h3>' + p.name + '</h3><p class="muted">' + p.tag + '</p>' +
    '<p class="price">' + money(p.price) + '<small>' + (prev ? "+" + money(p.price - prev.price) + " over " + prev.name + " · " : "") + "or " + money(p.monthly) + '/mo</small></p>' +
    '<ul>' + p.highlights.map(function(h){ return "<li>" + CHECK + h + "</li>"; }).join("") + '</ul>' +
    '<a class="btn ' + (p.popular ? "btn-gold" : "btn-ghost") + ' btn-block" href="' + p.page + '" data-pod="' + p.id + '">Configure ' + p.name + ' <svg class="ico"><use href="#i-ne"/></svg></a></div></article>';
}).join("");
$$("[data-pod]").forEach(function(a){ a.addEventListener("click", function(){ track("pod_card_click", { pod: a.dataset.pod }); }); });

/* ---------- Header and buy bar ---------- */
var hd = $("#hd"), buy = $("#buy"), buyLink = buy.querySelector("a");
function onScroll(){
  hd.classList.toggle("solid", scrollY > innerHeight * .5);
  var podsTop = $("#pods").getBoundingClientRect().top, finalTop = $("#reserve").getBoundingClientRect().top;
  var show = scrollY > innerHeight * .9 && !(podsTop < innerHeight && podsTop > -$("#pods").offsetHeight) && finalTop > innerHeight * .6;
  buy.classList.toggle("show", show); buy.setAttribute("aria-hidden", String(!show)); buyLink.tabIndex = show ? 0 : -1;
}
addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* ---------- Smooth in-page links (no CSS smooth scrolling: it fights the pinned stage) ---------- */
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href").length < 2) return;
  var t = document.getElementById(a.getAttribute("href").slice(1)); if (!t) return;
  e.preventDefault(); t.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  if (a.dataset.cta) track("cta_click", { cta: a.dataset.cta });
});

/* ---------- Call back form ---------- */
$("#callback").addEventListener("submit", function(e){
  e.preventDefault();
  var f = e.target, msg = $(".msg", f);
  var ok = f.name.value.trim().length > 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value) && /^\d{5}(-\d{4})?$/.test(f.zip.value.trim());
  if (!ok){ msg.textContent = "Please add your name, an email address and a 5-digit ZIP code."; return; }
  msg.textContent = "Thank you. A specialist will email you within one business day.";
  track("generate_lead", { form: "callback", location: "home" });
  f.querySelector("button").disabled = true;
});
$$(".faq details").forEach(function(d){ d.addEventListener("toggle", function(){ if (d.open) track("faq_expand", { question: d.querySelector("summary").textContent }); }); });

/* ---------- Quiet reveal for content below the stage ---------- */
if (!reduceMotion && "IntersectionObserver" in window){
  document.documentElement.classList.add("rise-on");
  var io = new IntersectionObserver(function(en){ en.forEach(function(x){ if (x.isIntersecting){ x.target.classList.add("in"); io.unobserve(x.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
  $$("[data-rise]").forEach(function(el, i){ el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el); });
}
})();
