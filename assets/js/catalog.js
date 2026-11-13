/* NOL catalog: PODs, parts, options and rules, following the Modular System Guide (Oct 27, 2026).
   Shared by every page. Change a price, a size or a launch flag here and the whole site follows. */
(function(){

var PRODUCT = {
  deposit: 500,         // reservation deposit
  clearance: 3,         // ft in front of the POD to open it and cook
  access: 3,            // ft of access width for the flat-pack pallet (30 in wide)
  upsellHotShare: 0.7   // highlight an upgrade once the setup has closed 30% of the price gap (gap <= 70% of the list difference)
};

/* The three kits. launched:false hides a POD everywhere (cards, comparison, upgrade nudges, its page). */
var PODS = [
  { id:"good", num:1, name:"Good", launched:true, price:9900, monthly:249,
    page:"pod-good.html", img:"assets/pods/good.jpg", shot:"POD1-01",
    tag:"Compact. Functional. Timeless.",
    size:{ w:10, h:7.5, d:4 }, shell:"Short height, manual roof", cabinets:0, countertop:"Covers the fridge",
    highlights:["Short-height shell with manual roof","Sink cabinet with black faucet and grey water tank","BBQ cabinet with stainless BBQ","Glass-door fridge"] },
  { id:"better", num:2, name:"Better", launched:true, popular:true, price:14900, monthly:379,
    page:"pod-better.html", img:"assets/pods/better.jpg", shot:"POD2-01",
    tag:"More capabilities. A brighter outdoor life.", adds:[["a full-height shell"],["motorized roof","roofmotor"],["control module","control"],["LED lighting","led"],["an extra cabinet"]],
    size:{ w:12, h:8.5, d:4 }, shell:"Full height, motorized roof", cabinets:1, countertop:"Covers the fridge and 1 cabinet",
    highlights:["Full-height shell with motorized roof","Control module with remote","LED light kit, warm white or RGB","Extra storage cabinet"] },
  { id:"best", num:3, name:"Best", launched:true, price:19900, monthly:499,
    page:"pod-best.html", img:"assets/pods/best.jpg", shot:"POD3-01",
    tag:"Our most complete kit.", adds:[["Bluetooth speakers","speakers"],["a fan","fan"],["an infrared heater","heater"],["a second cabinet"]],
    size:{ w:14, h:8.5, d:4 }, shell:"Full height, motorized roof, strongest frame", cabinets:2, countertop:"Covers the fridge and 2 cabinets",
    highlights:["Strongest full-height shell","Bluetooth speakers, fan and infrared heater","Two extra storage cabinets","Everything in Better"] }
];

/* Core parts in every kit (qty per kit comes from the POD). */
var PARTS = [
  { id:"sink",    name:"Sink cabinet",        img:"assets/parts/sink-cabinet.jpg",    shot:"PART-SINK",   desc:"Two doors, sink with black faucet, plumbing kit and grey water tank." },
  { id:"bbqcab",  name:"BBQ cabinet",         img:"assets/parts/bbq-cabinet.jpg",     shot:"PART-BBQCAB", desc:"Vented cooking slot with two drawers. Takes the BBQ, smoker, pizza oven or griddle." },
  { id:"bbq",     name:"Stainless BBQ",       img:"assets/parts/bbq.jpg",             shot:"APP-BBQ",     desc:"Propane or natural gas, stainless grates." },
  { id:"fridge",  name:"Glass-door fridge",   img:"assets/parts/fridge.jpg",          shot:"PART-FRIDGE", desc:"Stainless with tempered glass door and adjustable shelves. 110 V." },
  { id:"storage", name:"Storage cabinet",     img:"assets/parts/storage-cabinet.jpg", shot:"PART-CAB1",   desc:"Single door, left or right swing, adjustable shelf." }
];

/* Colors: three elements, white or grey each. Frame, cabinet sides, faucet and handles are always black. */
var COLORS = [
  { id:"faces",    name:"Cabinet faces" },
  { id:"exterior", name:"Exterior panels" },
  { id:"interior", name:"Interior panels" }
];
var SHADES = [ { id:"white", name:"White", hex:"#ECE7DF" }, { id:"grey", name:"Grey", hex:"#56595C" } ];

var FUELS = [ { id:"propane", name:"Propane" }, { id:"natural-gas", name:"Natural gas" } ];
var LED_COLORS = [ { id:"warm", name:"Warm white" }, { id:"rgb", name:"RGB" } ];

/* The BBQ cabinet takes one cooking appliance. The BBQ is standard; the others swap in for the price difference. */
var COOKING = [
  { id:"bbq",     short:"BBQ", name:"Stainless BBQ",         delta:0,   img:"assets/parts/bbq.jpg",        shot:"APP-BBQ",     note:"Propane or natural gas" },
  { id:"griddle", short:"Griddle", name:"Stainless griddle",     delta:390, img:"assets/parts/griddle.jpg",    shot:"APP-GRIDDLE", note:"Propane or natural gas" },
  { id:"pizza",   short:"Pizza oven", name:"Stainless pizza oven",  delta:590, img:"assets/parts/pizza-oven.jpg", shot:"APP-PIZZA",   note:"Propane or natural gas, stone included" },
  { id:"smoker",  short:"Smoker", name:"Stainless smoker",      delta:790, img:"assets/parts/smoker.jpg",     shot:"APP-SMOKER",  note:"Pellet fueled, digital controls" }
];

/* Add-ons. per POD: "inc" = included, "opt" = optional add-on, absent = not offered on that POD (yet).
   needs: another add-on it depends on (added automatically when not already there). */
var ADDONS = [
  { id:"control",   name:"Control module + remote", price:690,  img:"assets/parts/control-module.jpg", shot:"ADD-CONTROL", per:{ better:"inc", best:"inc" }, desc:"One remote for lights, fan, heater, roller screen and roof." },
  { id:"roofmotor", name:"Roof Motor Arm",          price:1490, img:null, shot:"ADD-ROOFMOTOR", per:{ better:"inc", best:"inc" }, needs:"control", desc:"Opens and closes the roof." },
  { id:"led",       name:"LED light kit",           price:490,  img:"assets/parts/led-kit.jpg", shot:"ADD-LED", per:{ better:"inc", best:"inc" }, desc:"Roof perimeter and toe kick, warm white or RGB." },
  { id:"hood",      name:"Hood fan",                price:890,  img:"assets/parts/hood-fan.jpg", shot:"ADD-HOOD", per:{ better:"opt", best:"opt" }, desc:"Ventilation over the cooking slot, baffle filters and LED." },
  { id:"speakers",  name:"Bluetooth speakers",      price:390,  img:"assets/parts/speakers.jpg", shot:"ADD-SPEAKERS", per:{ better:"opt", best:"inc" }, desc:"Ceiling-mounted, weather resistant." },
  { id:"fan",       name:"Ceiling fan",             price:490,  img:null, shot:"ADD-FAN", per:{ better:"opt", best:"inc" }, needs:"control", desc:"Ceiling-mounted, adjustable angle." },
  { id:"heater",    name:"Infrared heater",         price:790,  img:null, shot:"ADD-HEATER", per:{ better:"opt", best:"inc" }, needs:"control", desc:"Ceiling-mounted infrared heat for cooler evenings." },
  { id:"roller",    name:"Roller screen",           price:1290, img:null, shot:"ADD-ROLLER", per:{ better:"opt", best:"opt" }, needs:"control", desc:"Side screen, run from the control module. Assembled onsite." },
  { id:"awning",    name:"Awning",                  price:690,  img:null, shot:"ADD-AWNING", per:{ good:"opt", better:"opt", best:"opt" }, desc:"Extra shade. Assembled onsite." },
  { id:"tv",        name:"TV bracket",              price:149,  img:null, shot:"ADD-TV", per:{ good:"opt", better:"opt", best:"opt" }, desc:"TV mount. Assembled onsite." }
];

/* Rear utility panel: every connection exits one panel at the back. */
var UTILITIES = [
  ["Power", "110 V, 20 A. 20 ft black extension cord included"],
  ["Gas", "Propane with ball valve, or natural gas. Extension hose included"],
  ["Hot and cold water", "1/2 in PEX to the home supply"],
  ["Grey water", "2 in pipe to the grey water tank or a drain"],
  ["Garden hose (optional)", "Two 1/2 in PEX-to-hose connectors included"]
];

/* ---------- Helpers ---------- */
function money(v){ return "$" + Number(v).toLocaleString("en-US"); }
function byId(list, id){ for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i]; return null; }
function launched(){ return PODS.filter(function(p){ return p.launched; }); }
function sizeText(p){ return p.size.w + " ft W x " + p.size.h + " ft H x " + p.size.d + " ft D"; }
function addonStatus(a, pod){ return a.per[pod.id] || "na"; }
function firstOffer(a){ for (var i = 0; i < PODS.length; i++) if (PODS[i].launched && a.per[PODS[i].id]) return PODS[i]; return null; }

window.NOL_CATALOG = { PRODUCT:PRODUCT, PODS:PODS, PARTS:PARTS, COLORS:COLORS, SHADES:SHADES, FUELS:FUELS, LED_COLORS:LED_COLORS,
  COOKING:COOKING, ADDONS:ADDONS, UTILITIES:UTILITIES,
  money:money, byId:byId, launched:launched, sizeText:sizeText, addonStatus:addonStatus, firstOffer:firstOffer };
})();
