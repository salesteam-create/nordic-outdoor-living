/* NOL shared page UI: header, menu, POD links, review toggles, image codes, forms, reveal. */
(function(){
"use strict";

var C = window.NOL_CATALOG, money = C.money;
window.dataLayer = window.dataLayer || [];
function track(event, params){ var o = { event: event }; for (var k in params) o[k] = params[k]; window.dataLayer.push(o); }
window.NOL_track = track;
function $(id){ return document.getElementById(id); }
var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Launch switch: a POD page for an unlaunched POD sends visitors home ---------- */
var pagePod = document.body.getAttribute("data-pod");
if (pagePod && !C.byId(C.PODS, pagePod).launched){ location.replace("index.html"); return; }

/* ---------- POD links in the menu and footer, from the catalog ---------- */
document.querySelectorAll("[data-pod-links]").forEach(function(ul){
  ul.innerHTML = C.launched().map(function(p){
    return '<li><a href="' + p.page + '">POD ' + p.num + ' ' + p.name + '</a></li>';
  }).join("") + (C.launched().length > 1 ? '<li><a href="index.html#tiers">Compare PODs</a></li>' : "");
});
/* "From" prices */
var first = C.launched()[0];
document.querySelectorAll("[data-p]").forEach(function(el){
  var k = el.getAttribute("data-p");
  var v = { from: first.price, fromMonthly: first.monthly, deposit: C.PRODUCT.deposit }[k];
  if (v != null) el.textContent = money(v);
});

/* ---------- Header ---------- */
var menuBtn = $("menuBtn"), navList = $("navList"), header = $("siteHeader");
if (menuBtn){
  menuBtn.addEventListener("click", function(){ var open = navList.classList.toggle("open"); menuBtn.setAttribute("aria-expanded", String(open)); });
  navList.addEventListener("click", function(e){
    if (e.target.closest("a")){ navList.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); if (document.activeElement) document.activeElement.blur(); }
  });
}
function onScroll(){ if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

/* ---------- Review mode: highlight unconfirmed details and show image codes ---------- */
function tagShots(scope){
  (scope || document).querySelectorAll("[data-shot]").forEach(function(el){
    var host = el.parentNode;
    if (!host || host.querySelector(':scope > .shot-tag[data-for="' + el.getAttribute("data-shot") + '"]')) return;
    if (getComputedStyle(host).position === "static") host.style.position = "relative";
    var t = document.createElement("span");
    t.className = "shot-tag"; t.setAttribute("data-for", el.getAttribute("data-shot")); t.textContent = el.getAttribute("data-shot");
    host.appendChild(t);
  });
}
window.NOL_tagShots = tagShots;
tagShots();
var tbcBtn = $("tbcToggle");
if (tbcBtn) tbcBtn.addEventListener("click", function(){
  var on = document.body.classList.toggle("show-tbc");
  tbcBtn.setAttribute("aria-pressed", String(on));
});

/* ---------- Waitlist ---------- */
var wf = $("waitForm");
if (wf) wf.addEventListener("submit", function(e){
  e.preventDefault();
  var v = $("wEmail").value, m = $("waitMsg");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)){ m.textContent = "Enter an email address like name@example.com."; return; }
  m.textContent = "You're on the list. We'll email you before reservations open.";
  track("newsletter_signup", { location: "footer" });
});

/* ---------- Tracking ---------- */
document.querySelectorAll(".faq details").forEach(function(d){
  d.addEventListener("toggle", function(){ if (d.open) track("faq_expand", { question: d.querySelector("summary").textContent }); });
});
document.querySelectorAll("[data-cta]").forEach(function(a){
  a.addEventListener("click", function(){ track("cta_click", { cta: a.getAttribute("data-cta") }); });
});

/* ---------- Scroll reveal ---------- */
window.NOL_reveal = function(scope){
  if (reduceMotion || !("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("reveal-on");
  var rio = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if (en.isIntersecting){ en.target.classList.add("in"); rio.unobserve(en.target); } });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  (scope || document).querySelectorAll("[data-reveal]:not(.in)").forEach(function(el){
    var sib = el.parentNode.querySelectorAll(":scope > [data-reveal]");
    el.style.transitionDelay = (Math.max(0, Array.prototype.indexOf.call(sib, el)) * 90) + "ms";
    rio.observe(el);
  });
};
})();
