/* NOL configurator: the buy box, shared by the homepage and the POD pages.
   Steps follow the guide: POD, colors, cooking appliance, fuel, LED color, add-ons.
   NOL_Configurator.mount(root, { pod, picker, upgrade, titleTag }) */
(function(){
"use strict";

var C = window.NOL_CATALOG, money = C.money, byId = C.byId;
window.dataLayer = window.dataLayer || [];
function track(event, params){ var o = { event: event }; for (var k in params) o[k] = params[k]; window.dataLayer.push(o); }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;" }[c]; }); }
var ARR = '<span class="arr"><svg class="ico"><use href="#i-ne"/></svg></span>';

/* ---------- Config <-> URL, so a choice survives a jump to another POD page ---------- */
function readQuery(){
  var q = new URLSearchParams(location.search), s = {};
  ["faces","exterior","interior","fuel","cook","led"].forEach(function(k){ if (q.get(k)) s[k] = q.get(k); });
  if (q.get("add")) s.addons = q.get("add").split(",").reduce(function(o, id){ if (byId(C.ADDONS, id)) o[id] = true; return o; }, {});
  return s;
}
function toQuery(st){
  var q = new URLSearchParams();
  ["faces","exterior","interior","fuel","cook","led"].forEach(function(k){ q.set(k, st[k]); });
  var add = Object.keys(st.addons).filter(function(k){ return st.addons[k]; });
  if (add.length) q.set("add", add.join(","));
  return q.toString();
}

function mount(root, opts){
  opts = opts || {};
  var listeners = [];
  var q = readQuery();
  var st = {
    pod: opts.pod || "better",
    faces: q.faces || "white", exterior: q.exterior || "grey", interior: q.interior || "grey",
    fuel: q.fuel || "propane", cook: q.cook || "bbq", led: q.led || "warm",
    addons: q.addons || {}
  };
  if (!byId(C.PODS, st.pod) || !byId(C.PODS, st.pod).launched) st.pod = C.launched()[0].id;
  function pod(){ return byId(C.PODS, st.pod); }

  function ledActive(){ var a = byId(C.ADDONS, "led"); return C.addonStatus(a, pod()) === "inc" || !!st.addons.led; }

  /* Keep add-ons valid for the current POD and pull in dependencies */
  function normalize(){
    var p = pod();
    Object.keys(st.addons).forEach(function(id){
      var s = C.addonStatus(byId(C.ADDONS, id), p);
      if (s !== "opt" || !st.addons[id]) delete st.addons[id];
    });
    C.ADDONS.forEach(function(a){
      if (st.addons[a.id] && a.needs){
        var need = byId(C.ADDONS, a.needs);
        if (C.addonStatus(need, p) === "opt") st.addons[need.id] = true;
      }
    });
  }

  function lines(){
    var p = pod(), out = [];
    var colors = byId(C.SHADES, st.faces).name + " cabinet faces, " + byId(C.SHADES, st.exterior).name.toLowerCase() + " exterior, " + byId(C.SHADES, st.interior).name.toLowerCase() + " interior";
    out.push({ label:"NOL " + p.name, sub:colors, price:p.price });
    var ck = byId(C.COOKING, st.cook);
    if (ck.delta) out.push({ label:ck.name + " in place of the BBQ", price:ck.delta });
    C.ADDONS.forEach(function(a){ if (st.addons[a.id]) out.push({ label:a.name, price:a.price }); });
    return out;
  }
  function total(){ return lines().reduce(function(s, l){ return s + l.price; }, 0); }

  /* What this exact setup would cost on another POD: its price, the same cooking swap, and the
     chosen add-ons it doesn't already include. gap = that minus today's total. */
  function gapTo(x){
    var carried = 0, free = [];
    C.ADDONS.forEach(function(a){
      if (!st.addons[a.id]) return;
      var s = C.addonStatus(a, x);
      if (s === "inc") free.push(a); else if (s === "opt") carried += a.price;
    });
    var target = x.price + byId(C.COOKING, st.cook).delta + carried;
    var gap = target - total();
    return { gap: gap, target: target, free: free, hot: gap > 0 && gap <= (x.price - pod().price) * C.PRODUCT.upsellHotShare };
  }
  function lc(s){ return /^[A-Z][a-z]/.test(s) && !/^(Bluetooth|LED|TV)/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s; }
  function listText(arr){ return arr.length < 2 ? arr.join("") : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1]; }

  /* ---------- Render ---------- */
  function chip(name, id, value, checked, label, extra){
    return '<span class="cfg-chip"><input type="radio" name="' + name + '" id="' + id + '" value="' + value + '"' + (checked ? " checked" : "") + '>' +
      '<label for="' + id + '">' + label + (extra ? ' <small>' + extra + '</small>' : "") + '</label></span>';
  }
  function render(){
    normalize();
    var p = pod(), uid = root.id || "cfg";
    var T = opts.titleTag || "h3";
    var h = '';
    h += '<span class="kicker" style="margin-bottom:.5rem">POD ' + p.num + '</span>';
    h += '<' + T + ' class="p-title">NOL ' + esc(p.name) + '</' + T + '>';
    h += '<p class="p-sub">' + esc(p.tag) + ' <span class="muted">' + C.sizeText(p) + ' (approx.)</span></p>';
    h += '<div class="price"><b>' + money(p.price) + '</b><span>or from ' + money(p.monthly) + '/mo with financing</span></div>';
    h += '<p class="fin-line">Reserve with a ' + money(C.PRODUCT.deposit) + ' deposit that counts toward your price.</p>';

    if (opts.picker){
      h += '<div class="cfg-step"><span class="cfg-label">POD</span><div class="cfg-ctrl tier-pick">' +
        C.launched().map(function(x){
          return '<span><input type="radio" name="' + uid + '-pod" id="' + uid + '-pod-' + x.id + '" value="' + x.id + '" data-k="pod"' + (x.id === p.id ? " checked" : "") + '>' +
            '<label for="' + uid + '-pod-' + x.id + '"' + (x.num > p.num && gapTo(x).hot ? ' class="hot"' : "") + '><b>' + x.name + '</b><small>' + pickNote(x, p) + '</small></label></span>';
        }).join("") + '</div></div>';
    }
    if (opts.upgrade){
      var ups = C.launched().filter(function(x){ return x.num > p.num; });
      if (ups.length) h += '<div class="upsell"><p class="up-head">Upgrade your setup</p>' + ups.map(function(x){
        var u = upText(x), g = u.g, head = u.head, gains = u.gains;
        return '<a class="up-card' + (g.hot ? " up-hot" : "") + '" href="' + x.page + '?' + toQuery(st) + '" data-up="' + x.id + '" data-gap="' + g.gap + '"><img src="' + x.img + '" alt="" data-shot="' + x.shot + '">' +
          '<span><b>' + head + '</b><small>' + esc(gains) + '.</small></span>' + ARR + '</a>';
      }).join("") + '</div>';
    }

    h += '<div class="cfg-steps">';
    C.COLORS.forEach(function(c){
      h += '<div class="cfg-step"><span class="cfg-label">' + c.name + '<small>' + byId(C.SHADES, st[c.id]).name + '</small></span><div class="cfg-ctrl swatches">' +
        C.SHADES.map(function(s){
          var id = uid + "-" + c.id + "-" + s.id;
          return '<span class="swatch"><input type="radio" name="' + uid + '-' + c.id + '" id="' + id + '" value="' + s.id + '" data-k="' + c.id + '"' + (st[c.id] === s.id ? " checked" : "") + '>' +
            '<label for="' + id + '" title="' + s.name + '"><i style="background:' + s.hex + '"></i><span class="sr-only">' + c.name + ': ' + s.name + '</span></label></span>';
        }).join("") + '</div></div>';
    });
    h += '<p class="cfg-fixed">Frame, cabinet sides, faucet and handles are black.</p>';

    h += '<div class="cfg-step cfg-cook"><span class="cfg-label">Cooking<small>' + byId(C.COOKING, st.cook).short + '</small></span><div class="cfg-ctrl cook-grid">' +
      C.COOKING.map(function(k){
        var id = uid + "-cook-" + k.id;
        return '<span class="cook"><input type="radio" name="' + uid + '-cook" id="' + id + '" value="' + k.id + '" data-k="cook"' + (st.cook === k.id ? " checked" : "") + '>' +
          '<label for="' + id + '"><img src="' + k.img + '" alt="" data-shot="' + k.shot + '"><b>' + k.short + '</b><small>' + (k.delta ? "+" + money(k.delta) : "Standard") + '</small></label></span>';
      }).join("") + '</div></div>';

    h += '<div class="cfg-step"><span class="cfg-label">Fuel</span><div class="cfg-ctrl chips">' +
      C.FUELS.map(function(f){ return chip(uid + "-fuel", uid + "-fuel-" + f.id, f.id, st.fuel === f.id, f.name).replace('type="radio"', 'type="radio" data-k="fuel"'); }).join("") + '</div></div>';
    if (ledActive()){
      h += '<div class="cfg-step"><span class="cfg-label">LED color</span><div class="cfg-ctrl chips">' +
        C.LED_COLORS.map(function(l){ return chip(uid + "-led", uid + "-led-" + l.id, l.id, st.led === l.id, l.name).replace('type="radio"', 'type="radio" data-k="led"'); }).join("") + '</div></div>';
    }
    h += '</div>';

    // Add-ons: included, optional, or offered on a bigger POD (shown so the upgrade is visible)
    var inc = [], opt = [], up = [];
    C.ADDONS.forEach(function(a){
      var s = C.addonStatus(a, p);
      if (s === "inc") inc.push(a);
      else if (s === "opt") opt.push(a);
      else { var on = C.launched().filter(function(x){ return x.num > p.num && a.per[x.id]; })[0]; if (on) up.push([a, on]); }
    });
    h += '<div class="cfg-step cfg-add"><span class="cfg-label">Add-ons<small>optional</small></span><div class="cfg-ctrl addons">';
    opt.forEach(function(a){
      var id = uid + "-ad-" + a.id;
      var dep = a.needs && C.addonStatus(byId(C.ADDONS, a.needs), p) === "opt" ? ' <small>needs control module</small>' : "";
      h += '<span class="addon"><input type="checkbox" id="' + id + '" value="' + a.id + '" data-k="addon"' + (st.addons[a.id] ? " checked" : "") + '>' +
        '<label for="' + id + '">' + thumb(a) + a.name + ' <small>+' + money(a.price) + '</small>' + dep + '</label></span>';
    });
    up.forEach(function(pair){
      h += '<span class="addon"><input type="checkbox" disabled id="' + uid + '-ad-' + pair[0].id + '"><label for="' + uid + '-ad-' + pair[0].id + '" title="Available on ' + pair[1].name + '">' + thumb(pair[0]) + pair[0].name + ' <small>' + pair[1].name + ' and up</small></label></span>';
    });
    h += '</div></div>';
    if (inc.length) h += '<p class="cfg-inc"><b>Included on ' + p.name + ':</b> ' + inc.map(function(a){ return a.name; }).join(", ") + '.</p>';

    // Summary
    h += '<div class="summary" aria-live="polite"><dl>';
    lines().forEach(function(l){ h += '<dt>' + esc(l.label) + (l.sub ? '<br><span class="small">' + esc(l.sub) + '</span>' : "") + '</dt><dd>' + money(l.price) + '</dd>'; });
    h += '<dt>Delivery</dt><dd><span class="tbc">Free driveway delivery</span></dd>';
    h += '<dt class="total">Total</dt><dd class="total">' + money(total()) + '</dd></dl>';
    h += '<div class="cta-stack"><button class="btn btn-dark btn-block" type="button" data-act="reserve">Reserve with ' + money(C.PRODUCT.deposit) + ' deposit ' + ARR + '</button>' +
      '<a class="btn btn-line btn-block" href="' + (opts.consultHref || "#consult") + '" data-act="callback">Request a call back ' + ARR + '</a></div>';
    h += '<p class="note cfg-msg" aria-live="polite" style="text-align:center"></p>';
    h += '<p class="note" style="text-align:center">Or from ' + money(p.monthly) + ' a month with financing, subject to approval.</p>';
    if (opts.detailsLink) h += '<p style="text-align:center;margin-top:.4rem"><a class="text-link" href="' + p.page + '?' + toQuery(st) + '">See full details <svg class="ico"><use href="#i-arrow"/></svg></a></p>';
    h += '</div>';

    root.innerHTML = h;
    listeners.forEach(function(fn){ fn(api); });
    if (window.NOL_tagShots) window.NOL_tagShots(root);
  }
  /* Upgrade wording, shared by the card and the pop-up */
  function upText(x){
    var p = pod(), g = gapTo(x);
    var between = C.launched().filter(function(y){ return y.num > p.num && y.num < x.num; });
    // what the bigger POD adds, minus anything the customer has already chosen
    var addsTxt = listText(x.adds.filter(function(a){ return !(a[1] && st.addons[a[1]]); }).map(function(a){ return a[0]; }));
    var head = g.gap > 0 ? (g.hot ? "Only " + money(g.gap) + " more for " + x.name : x.name + ": +" + money(g.gap) + " from your setup")
                         : x.name + (g.gap === 0 ? " for the same price as your setup" : " for " + money(-g.gap) + " less than your setup");
    var gains = between.length ? "Everything in " + between.map(function(y){ return y.name; }).join(", ") + ", plus " + addsTxt
      : g.free.length ? "Your " + listText(g.free.map(function(a){ return lc(a.name); })) + (g.free.length > 1 ? " come" : " comes") + " included, plus " + addsTxt
      : "Adds " + addsTxt;
    return { g: g, head: head, gains: gains };
  }

  /* ---------- Upgrade pop-up: appears when the customer's own change brings a bigger POD within reach.
     Once per POD per visit, closes itself after 12 s, never on page load. ---------- */
  var seen = {}, toast = null, toastTimer = null;
  function hotNow(){
    var out = {};
    C.launched().forEach(function(x){ if (x.num > pod().num){ var g = gapTo(x); if (g.hot) out[x.id] = g.gap; } });
    return out;
  }
  function closeToast(){ if (toast){ toast.classList.remove("show"); var t = toast; setTimeout(function(){ t.remove(); }, 300); toast = null; } clearTimeout(toastTimer); }
  function showToast(x){
    closeToast();
    var u = upText(x);
    seen[x.id] = true;
    toast = document.createElement("div");
    toast.className = "up-toast"; toast.setAttribute("role", "status");
    toast.innerHTML = '<img src="' + x.img + '" alt="">' +
      '<div><b>' + u.head + '</b><small>' + esc(u.gains) + '.</small>' +
      '<a class="btn btn-dark btn-sm" href="' + x.page + '?' + toQuery(st) + '" data-up="' + x.id + '" data-gap="' + u.g.gap + '">View ' + x.name + ' ' + ARR + '</a></div>' +
      '<button type="button" class="up-x" aria-label="Close"><svg class="ico" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>';
    document.body.appendChild(toast);
    toast.querySelector(".up-x").addEventListener("click", function(){ closeToast(); track("upgrade_prompt_close", { to: x.id }); });
    toast.querySelector("[data-up]").addEventListener("click", function(){ track("upgrade_click", { from: st.pod, to: x.id, gap: u.g.gap, source: "popup" }); });
    requestAnimationFrame(function(){ requestAnimationFrame(function(){ if (toast) toast.classList.add("show"); }); });
    toastTimer = setTimeout(closeToast, 12000);
    track("upgrade_prompt_shown", { from: st.pod, to: x.id, gap: u.g.gap });
  }

  function pickNote(x, p){
    if (x.id === p.id) return money(x.price);
    if (x.num < p.num) return "-" + money(p.price - x.price);
    var g = gapTo(x).gap;
    return g > 0 ? "+" + money(g) + " from your setup" : "Same as your setup";
  }
  function thumb(a){
    return '<span class="a-ico">' + (a.img ? '<img src="' + a.img + '" alt="" data-shot="' + a.shot + '">' : '<svg class="ico"><use href="#i-camera"/></svg>') + '</span>';
  }

  root.addEventListener("change", function(e){
    var t = e.target, k = t.getAttribute("data-k");
    if (!k) return;
    var before = k === "pod" ? {} : hotNow();
    if (k === "addon"){
      if (t.checked) st.addons[t.value] = true; else delete st.addons[t.value];
      // removing a dependency removes what needs it
      if (!t.checked) C.ADDONS.forEach(function(a){ if (a.needs === t.value) delete st.addons[a.id]; });
      track(t.checked ? "add_to_cart" : "remove_from_cart", { item: t.value, pod: st.pod });
    } else {
      st[k] = t.value;
      track(k === "pod" ? "variant_select" : "option_select", { option: k, value: t.value, pod: st.pod });
    }
    var y = window.scrollY; render(); window.scrollTo(0, y);
    if (k === "pod") closeToast();
    var after = hotNow();
    var reach = Object.keys(after).filter(function(id){ return !(id in before) && !seen[id]; })[0];
    if (reach) showToast(byId(C.PODS, reach));
    else Object.keys(after).length || closeToast();
    var again = root.querySelector('[data-k="' + k + '"][value="' + t.value + '"]'); if (again) again.focus({ preventScroll: true });
  });
  root.addEventListener("click", function(e){
    var r = e.target.closest('[data-act="reserve"]');
    if (r){
      root.querySelector(".cfg-msg").textContent = "Prototype: this opens Shopify checkout for the " + money(C.PRODUCT.deposit) + " deposit on this setup.";
      track("begin_checkout", { pod: st.pod, value: total(), config: toQuery(st) });
    }
    var up = e.target.closest("[data-up]");
    if (up) track("upgrade_click", { from: st.pod, to: up.getAttribute("data-up"), gap: +up.getAttribute("data-gap") });
  });

  var api = {
    get state(){ return st; },
    pod: pod, lines: lines, total: total, gapTo: gapTo, query: function(){ return toQuery(st); },
    setPod: function(id){ st.pod = id; render(); },
    onChange: function(fn){ listeners.push(fn); fn(api); }
  };
  render();
  return api;
}

window.NOL_Configurator = { mount: mount };
})();
