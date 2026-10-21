/* NOL catalog: prices, tiers, colors and add-ons. Shared by every page. */
(function(){
var PRODUCT = {
  deposit: 500,         // reservation deposit
  delivery: 0,          // 0 shows as "Included"
  clearance: 3,         // ft in front of the pod to open it and cook
  access: 3.5           // ft of access width needed for delivery
};
// Three tiers. dims in cm.
var TIERS = [
  { id:"good",   name:"Good",   price:9900,  monthly:249, img:"assets/tiers/good.jpg",   opt:"good",
    tag:"Compact. Functional. Timeless.", look:"Anthracite exterior, white cabinets",
    features:["Short height","Manual opening","2 cabinets","Sink","BBQ grill","Fridge"],
    dims:{ length:260, internal:230, height:150, width:92 },
    included:[], hidden:["led","fan","speaker"] },
  { id:"better", name:"Better", price:14900, monthly:379, img:"assets/tiers/better.jpg", opt:"better", popular:true,
    tag:"More features. More possibilities.", look:"Anthracite",
    features:["Full-height enclosure","Electronic opening","LED lighting (white or RGB)","Exhaust fan","3 cabinets","Sink","BBQ grill","Fridge"],
    dims:{ length:260, internal:230, height:235, width:92 },
    included:["led","electronic","fan"], hidden:["led-warm","led-rgb"] },
  { id:"best",   name:"Best",   price:19900, monthly:499, img:"assets/tiers/best.jpg",   opt:"better",
    tag:"More space. More features. More together.", look:"Anthracite",
    features:["Full-height enclosure","Electronic opening","LED lighting (white or RGB)","Exhaust fan","4 cabinets","Sink","BBQ grill","Fridge","Bluetooth speakers"],
    dims:{ length:300, internal:270, height:235, width:92 },
    included:["led","electronic","fan","speaker"], hidden:["led-warm","led-rgb"] }
];
var COLORS = [
  { id:"ext", name:"Exterior",   img:function(t, c){ return "assets/tiers/" + t.opt + "-ext-" + c + ".jpg"; } },
  { id:"cab", name:"Cabinets",   img:function(t, c){ return "assets/tiers/" + t.opt + "-cab-" + c + ".jpg"; } },
  { id:"top", name:"Countertop", img:function(t, c){ return "assets/tiers/top-" + c + ".jpg"; } }
];
var SHADES = [ { id:"anthracite", name:"Anthracite grey" }, { id:"white", name:"White" } ];
var ADDONS = [
  { id:"led",        name:"LED lighting",       img:"led-warm",   price:null },
  { id:"led-warm",   name:"LED kit, warm white", img:"led-warm",  price:290 },
  { id:"led-rgb",    name:"LED kit, RGB",       img:"led-rgb",    price:390 },
  { id:"electronic", name:"Electronic opening", img:"electronic", price:1190 },
  { id:"fan",        name:"Exhaust fan",        img:"fan",        price:null },
  { id:"speaker",    name:"Speaker kit",        img:"speaker",    price:390 },
  { id:"zip",        name:"Zip screen",         img:"zip",        price:1490 },
  { id:"tools",      name:"BBQ tool kit",       img:"tools",      price:149 },
  { id:"lamp",       name:"Solar lamp",         img:"lamp",       price:79 },
  { id:"plant",      name:"Faux plant",         img:"plant",      price:59 },
  { id:"mat",        name:"Soft working mat",   img:"mat",        price:89 }
];
window.NOL_CATALOG = { PRODUCT: PRODUCT, TIERS: TIERS, COLORS: COLORS, SHADES: SHADES, ADDONS: ADDONS };
})();
