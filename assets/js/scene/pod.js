/* NOL POD, modelled in code from the Modular System Guide. Detailed daylight version.
   Units are feet. x = width, y = up, z = depth (front is +z). Floor at y = 0, POD centred on x.
   One shell per POD; the cabinets, appliances and add-ons are the same parts in every POD. */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import * as TX from './textures.js';

/* Customer colours (Guide: cabinet faces, exterior and interior panels in white or grey) */
export const SHADES = {
  faces:    { white: new THREE.Color(0xe4ddd1), grey: new THREE.Color(0x5b5e61) },
  exterior: { white: new THREE.Color(0xe9e6df), grey: new THREE.Color(0x3b3e41) },
  interior: { white: new THREE.Color(0xe6e2da), grey: new THREE.Color(0x4b4a48) }
};

export const SPECS = {
  good:   { id: 'good',   W: 10, H: 7.5, D: 4, layout: ['sink', 'bbq', 'fridge'],                       hood: false, best: false },
  better: { id: 'better', W: 12, H: 8.5, D: 4, layout: ['sink', 'bbq', 'fridge', 'storage'],            hood: true,  best: false },
  best:   { id: 'best',   W: 14, H: 8.5, D: 4, layout: ['storage', 'sink', 'bbq', 'fridge', 'storage'], hood: true,  best: true }
};
const NOMINAL = { sink: 3, bbq: 3, fridge: 2, storage: 2 };

export function makeMaterials(){
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const steelMap = TX.brushed(), stoneMap = TX.stone(), woodMap = TX.wood();
  const glow = (c) => std({ color: 0x111111, emissive: c, emissiveIntensity: 0, roughness: .6 });
  return {
    faces:    std({ color: SHADES.faces.white.clone(), roughness: .62, metalness: 0, envMapIntensity: .7 }),
    exterior: std({ color: SHADES.exterior.grey.clone(), roughness: .48, metalness: .35, envMapIntensity: .8 }),
    interior: std({ color: SHADES.interior.grey.clone(), roughness: .7, metalness: .05, envMapIntensity: .6 }),
    profile:  std({ color: 0x17181a, roughness: .38, metalness: .6, envMapIntensity: .9 }),
    body:     std({ color: 0x1a1b1d, roughness: .6, metalness: .2, envMapIntensity: .6 }),
    seam:     std({ color: 0x0c0c0d, roughness: .9 }),
    counter:  std({ map: stoneMap, color: 0xffffff, roughness: .42, metalness: 0, envMapIntensity: .8 }),
    steel:    std({ map: steelMap, color: 0xffffff, roughness: .26, metalness: 1, envMapIntensity: 1.2 }),
    steelDim: std({ map: steelMap, color: 0xbfc3c8, roughness: .34, metalness: 1, envMapIntensity: 1 }),
    chrome:   std({ color: 0xf2f3f5, roughness: .08, metalness: 1, envMapIntensity: 1.4 }),
    black:    std({ color: 0x111112, roughness: .42, metalness: .3, envMapIntensity: .7 }),
    matte:    std({ color: 0x0d0d0e, roughness: .85, metalness: 0 }),
    basin:    std({ map: steelMap, color: 0x8e9297, roughness: .3, metalness: 1, envMapIntensity: 1 }),
    wood:     std({ map: woodMap, roughness: .62, metalness: 0, envMapIntensity: .5 }),
    ceramic:  std({ color: 0xf4f1ea, roughness: .35, metalness: 0, envMapIntensity: .8 }),
    terracotta: std({ color: 0xb4694a, roughness: .8 }),
    herb:     std({ color: 0x4d6b35, roughness: .8 }),
    lemon:    std({ color: 0xf0c430, roughness: .45 }),
    dial:     std({ color: 0xf5f3ee, roughness: .3 }),
    fabric:   std({ color: 0x1c1c1e, roughness: .95 }),
    glassG:   new THREE.MeshPhysicalMaterial({ color: 0x2f6a3e, roughness: .08, metalness: 0, transparent: true, opacity: .85, envMapIntensity: 1.2 }),
    glassA:   new THREE.MeshPhysicalMaterial({ color: 0x7a4a14, roughness: .08, metalness: 0, transparent: true, opacity: .9, envMapIntensity: 1.2 }),
    door:     new THREE.MeshPhysicalMaterial({ color: 0x1b2228, roughness: .03, metalness: 0, transparent: true, opacity: .16, envMapIntensity: 1.4 }),
    fridgeIn: std({ color: 0xf1f3f5, emissive: 0xeef4ff, emissiveIntensity: .75, roughness: .5 }),
    cans:     std({ map: TX.labels(), roughness: .25, metalness: .6, envMapIntensity: 1 }),
    led:      glow(0xffd7a8),
    ledFront: glow(0xffd7a8),
    heat:     glow(0xff5a1e)
  };
}

/* ---------- helpers ---------- */
function box(w, h, d, mat, r = .02){
  const g = r > 0 && Math.min(w, h, d) > r * 2.2 ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(g, mat); m.castShadow = true; m.receiveShadow = true; return m;
}
function cyl(rt, rb, h, mat, seg = 28){
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.castShadow = true; m.receiveShadow = true; return m;
}
function sphere(r, mat, seg = 20){ const m = new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.max(8, seg / 2 | 0)), mat); m.castShadow = true; m.receiveShadow = true; return m; }
function at(o, x, y, z){ o.position.set(x, y, z); return o; }
const smooth = (t) => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);

/* Bar pull on two standoffs. vertical = true for doors */
function pull(len, M, vertical){
  const g = new THREE.Group();
  const bar = box(vertical ? .045 : len, vertical ? len : .045, .045, M.black, .018);
  g.add(at(bar, 0, 0, .085));
  [-1, 1].forEach((s) => {
    const st = cyl(.016, .016, .07, M.black, 12); st.rotation.x = Math.PI / 2;
    g.add(at(st, vertical ? 0 : s * len * .4, vertical ? s * len * .4 : 0, .045));
  });
  return g;
}

/* ---------- cabinets ---------- */
const CAB_H = 2.62, CAB_D = 2.0;
function cabinet(kind, w, M){
  const g = new THREE.Group();
  // fridges keep their front 1.3 ft hollow so the lit interior shows through the glass
  const hollow = kind === 'fridge' ? 1.3 : 0;
  g.add(at(box(w - .02, CAB_H, CAB_D - hollow, M.body, .015), 0, CAB_H / 2, -hollow / 2));
  const fz = CAB_D / 2 + .022, gap = .03;
  const front = (fw, fh, x, y) => g.add(at(box(fw, fh, .05, M.faces, .012), x, y, fz));
  if (kind === 'sink'){
    const dw = w / 2 - gap * 1.5;
    [-1, 1].forEach((s) => { front(dw, CAB_H - .14, s * (dw / 2 + gap / 2), CAB_H / 2); const p = pull(.9, M, true); g.add(at(p, s * .14, CAB_H * .62, fz)); });
  } else if (kind === 'bbq'){
    const dh = (CAB_H - .14 - gap) / 2;
    [0, 1].forEach((i) => { const y = .07 + dh / 2 + i * (dh + gap); front(w - gap * 2, dh, 0, y); g.add(at(pull(w * .48, M, false), 0, y + dh * .26, fz)); });
  } else if (kind === 'storage'){
    front(w - gap * 2, CAB_H - .14, 0, CAB_H / 2);
    g.add(at(pull(.9, M, true), w / 2 - .26, CAB_H * .62, fz));
  } else if (kind === 'fridge'){
    const iw = w - .34, ih = CAB_H - .6;
    // stainless frame
    g.add(at(box(w - .04, .18, .06, M.steel, .015), 0, CAB_H - .1, fz));
    g.add(at(box(.15, CAB_H - .1, .06, M.steel, .015), -w / 2 + .1, CAB_H / 2, fz));
    g.add(at(box(.15, CAB_H - .1, .06, M.steel, .015), w / 2 - .1, CAB_H / 2, fz));
    // kick grille
    g.add(at(box(w - .04, .32, .05, M.matte, .01), 0, .16, fz));
    for (let i = 0; i < 9; i++) g.add(at(box(w - .3, .012, .02, M.steelDim, 0), 0, .06 + i * .028, fz + .03));
    // interior: lit white liner, wire shelves, bottles and cans
    g.add(at(box(iw, ih, .02, M.fridgeIn, 0), 0, .36 + ih / 2, fz - 1.2));
    g.add(at(box(.02, ih, 1.15, M.fridgeIn, 0), -iw / 2, .36 + ih / 2, fz - .62));
    g.add(at(box(.02, ih, 1.15, M.fridgeIn, 0), iw / 2, .36 + ih / 2, fz - .62));
    g.add(at(box(iw, .02, 1.2, M.fridgeIn, 0), 0, .36 + ih, fz - .62));
    g.add(at(box(iw, .02, 1.2, M.fridgeIn, 0), 0, .36, fz - .62));
    g.add(at(box(w - .04, .25, 1.25, M.body, 0), 0, CAB_H - .125, fz - .65));
    const shelfY = [.42, 1.08, 1.7];
    shelfY.forEach((y) => g.add(at(box(iw, .015, 1.1, M.steelDim, 0), 0, y, fz - .62)));
    const per = Math.floor(iw / .2);
    const bottles = new THREE.InstancedMesh(new THREE.CylinderGeometry(.065, .07, .42, 14), M.glassG, per);
    const necks = new THREE.InstancedMesh(new THREE.CylinderGeometry(.022, .045, .17, 10), M.glassG, per);
    const beer = new THREE.InstancedMesh(new THREE.CylinderGeometry(.055, .058, .36, 14), M.glassA, per);
    const cans = new THREE.InstancedMesh(new THREE.CylinderGeometry(.05, .05, .2, 16), M.cans, per * 2);
    const d = new THREE.Object3D();
    for (let i = 0; i < per; i++){
      const x = -iw / 2 + .12 + i * ((iw - .24) / (per - 1));
      d.position.set(x, 1.7 + .21, fz - .35); d.updateMatrix(); bottles.setMatrixAt(i, d.matrix);
      d.position.set(x, 1.7 + .5, fz - .35); d.updateMatrix(); necks.setMatrixAt(i, d.matrix);
      d.position.set(x, 1.08 + .19, fz - .35); d.updateMatrix(); beer.setMatrixAt(i, d.matrix);
      for (let k = 0; k < 2; k++){ d.position.set(x, .42 + .11, fz - .35 - k * .3); d.rotation.y = i * 1.3 + k; d.updateMatrix(); cans.setMatrixAt(i * 2 + k, d.matrix); }
      d.rotation.y = 0;
    }
    [bottles, necks, beer, cans].forEach((m) => { m.castShadow = false; g.add(m); });
    // tinted glass door and handle
    g.add(at(box(w - .3, CAB_H - .5, .03, M.door, 0), 0, CAB_H / 2 + .1, fz + .02));
    g.add(at(pull(1.55, M, true), w / 2 - .2, CAB_H * .58, fz + .02));
  }
  return g;
}

/* ---------- stainless BBQ ---------- */
function bbq(w, M){
  const g = new THREE.Group(), aw = Math.min(w * .86, 3.0);
  g.add(at(box(aw, .5, 1.5, M.steel, .03), 0, .25, 0));
  const panel = box(aw - .02, .34, .08, M.steelDim, .02); panel.rotation.x = -.32;
  g.add(at(panel, 0, .28, .77));
  for (let i = 0; i < 4; i++){
    const x = -aw * .3 + i * aw * .2;
    const bez = cyl(.1, .1, .02, M.chrome, 28); bez.rotation.x = Math.PI / 2 - .32; g.add(at(bez, x, .28, .835));
    const k = cyl(.065, .07, .08, M.black, 24); k.rotation.x = Math.PI / 2 - .32; g.add(at(k, x, .285, .87));
  }
  const ign = cyl(.03, .03, .03, M.chrome, 16); ign.rotation.x = Math.PI / 2 - .32; g.add(at(ign, aw * .42, .28, .84));
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, aw - .02, 48, 1, false, 0, Math.PI), M.steel);
  lid.rotation.z = Math.PI / 2; lid.scale.set(1, 1, 1.42); lid.castShadow = true; lid.receiveShadow = true;
  g.add(at(lid, 0, .5, 0));
  const handle = pull(aw * .7, M, false); handle.children.forEach((c) => c.material = M.chrome);
  handle.rotation.x = -.5; g.add(at(handle, 0, .78, .64));
  const dialRim = cyl(.13, .13, .03, M.chrome, 32); dialRim.rotation.x = Math.PI / 2 - .55; g.add(at(dialRim, 0, .9, .45));
  const dial = cyl(.11, .11, .032, M.dial, 32); dial.rotation.x = Math.PI / 2 - .55; g.add(at(dial, 0, .905, .46));
  const badge = box(.36, .1, .015, M.black, .01); badge.rotation.x = -.6; g.add(at(badge, 0, .62, .73));
  return g;
}

/* ---------- the POD ---------- */
export function buildPod(spec, M){
  const { W, H, D } = spec, t = .16;
  const root = new THREE.Group(); root.name = 'pod-' + spec.id;

  // Recessed plinth with toe-kick light
  root.add(at(box(W - .1, .3, D - .3, M.profile, .02), 0, .15, -.1));
  root.add(at(box(W - .5, .025, .02, M.led, 0), 0, .27, D / 2 - .26));

  // Shell: exterior panels, black extrusion profiles on every edge, seamed interior lining
  const shellY = .3 + (H - .3) / 2, shellH = H - .3;
  root.add(at(box(W, shellH, t, M.exterior, .015), 0, shellY, -D / 2 + t / 2));
  [-1, 1].forEach((s) => {
    root.add(at(box(t, shellH, D, M.exterior, .015), s * (W / 2 - t / 2), shellY, 0));
    root.add(at(box(.2, shellH, .2, M.profile, .02), s * (W / 2 - .1), shellY, D / 2 - .1));
    root.add(at(box(.2, shellH, .2, M.profile, .02), s * (W / 2 - .1), shellY, -D / 2 + .1));
    root.add(at(box(.2, .2, D, M.profile, .02), s * (W / 2 - .1), .4, 0));
    root.add(at(box(.035, H - .75, D - t - .25, M.interior, 0), s * (W / 2 - t - .02), .4 + (H - .75) / 2, t / 2 - .05));
  });
  root.add(at(box(W - 2 * t - .04, H - .75, .035, M.interior, 0), 0, .4 + (H - .75) / 2, -D / 2 + t + .02));
  for (let x = -W / 2 + 2.6; x < W / 2 - 1; x += 2.4) root.add(at(box(.025, H - .75, .01, M.seam, 0), x, .4 + (H - .75) / 2, -D / 2 + t + .04));

  // Cabinet run, scaled to fill the inside of the shell
  const inner = W - 2 * t - .12, sum = spec.layout.reduce((s, k) => s + NOMINAL[k], 0), k = inner / sum;
  const zc = -D / 2 + t + .06 + CAB_D / 2;
  const run = []; let x = -inner / 2, bbqX = 0, sinkX = 0, fridgeX = 0, storeX = null;
  spec.layout.forEach((kind) => {
    const w = NOMINAL[kind] * k, cx = x + w / 2;
    const g = cabinet(kind, w, M); g.position.set(cx, .3, zc); g.userData.kind = kind;
    root.add(g); run.push(g);
    if (kind === 'bbq') bbqX = cx; if (kind === 'sink') sinkX = cx; if (kind === 'fridge') fridgeX = cx; if (kind === 'storage' && storeX === null) storeX = cx;
    x += w;
  });
  const topY = .3 + CAB_H + .13;

  // Honed stone countertop with an undermount sink and black gooseneck faucet
  root.add(at(box(inner + .08, .13, CAB_D + .16, M.counter, .02), 0, topY - .065, zc + .06));
  root.add(at(box(1.62, .015, 1.08, M.basin, 0), sinkX, topY + .002, zc + .12));
  root.add(at(box(1.5, .012, .96, M.matte, 0), sinkX, topY + .006, zc + .12));
  const drain = cyl(.07, .07, .01, M.chrome, 20); root.add(at(drain, sinkX, topY + .014, zc + .12));
  const fx = sinkX, fz = zc - .5;
  root.add(at(cyl(.07, .08, .12, M.black), fx, topY + .06, fz));
  const fp = new THREE.CatmullRomCurve3([
    new THREE.Vector3(fx, topY + .1, fz), new THREE.Vector3(fx, topY + 1.15, fz), new THREE.Vector3(fx, topY + 1.42, fz + .26),
    new THREE.Vector3(fx, topY + 1.22, fz + .56), new THREE.Vector3(fx, topY + .95, fz + .6)]);
  const spout = new THREE.Mesh(new THREE.TubeGeometry(fp, 60, .045, 14), M.black); spout.castShadow = true; root.add(spout);
  const lever = box(.04, .04, .32, M.black, .015); lever.rotation.x = .5; root.add(at(lever, fx + .1, topY + .62, fz - .05));

  // Counter styling: oak board, bowl of lemons, pepper mills
  const board = box(.85, .06, 1.15, M.wood, .025); board.rotation.x = -1.3;
  root.add(at(board, fridgeX + .32, topY + .55, zc - .76));
  const bowl = new THREE.Mesh(new THREE.SphereGeometry(.26, 28, 14, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), M.ceramic);
  bowl.rotation.x = Math.PI; bowl.castShadow = true; root.add(at(bowl, fridgeX - .25, topY + .25, zc + .15));
  [[-.08, .03], [.08, .05], [0, -.09]].forEach(([dx, dz]) => root.add(at(sphere(.085, M.lemon, 16), fridgeX - .25 + dx, topY + .2, zc + .15 + dz)));
  [0, 1].forEach((i) => root.add(at(cyl(.06, .075, .5 - i * .08, i ? M.wood : M.black, 20), sinkX + .95 + i * .2, topY + .25 - i * .04, zc - .55)));

  // Cooking slot: the stainless BBQ
  const grill = bbq(NOMINAL.bbq * k, M); grill.position.set(bbqX, topY - .02, zc + .08); root.add(grill);

  // Hood with baffle filters, oak shelves and herbs
  if (spec.hood){
    const hy = H - 2.35, hz = -D / 2 + t + .8;
    root.add(at(box(2.6, .34, 1.5, M.steel, .03), bbqX, hy, hz));
    const taper = new THREE.Mesh(new THREE.CylinderGeometry(.55, 1.3, .55, 4, 1), M.steel);
    taper.rotation.y = Math.PI / 4; taper.scale.set(1.32, 1, .74); taper.castShadow = true; root.add(at(taper, bbqX, hy + .44, hz - .16));
    root.add(at(box(.95, H - .45 - (hy + .7), .62, M.steel, .015), bbqX, (H - .45 + hy + .7) / 2, -D / 2 + t + .36));
    for (let i = 0; i < 5; i++) root.add(at(box(.42, .02, 1.2, M.steelDim, 0), bbqX - 1 + i * .5, hy - .175, hz));
    [-.75, .75].forEach((dx) => root.add(at(cyl(.08, .08, .02, M.ledFront, 20), bbqX + dx, hy - .18, hz + .45)));
  }
  [[sinkX, 0], [fridgeX, 1]].forEach(([sx, n]) => {
    const sy = topY + 2.05, sz = -D / 2 + t + .36;
    root.add(at(box(2.3, .1, .62, M.wood, .02), sx, sy, sz));
    if (n === 0){
      root.add(at(cyl(.055, .07, .55, M.glassG, 18), sx - .7, sy + .32, sz));
      root.add(at(cyl(.02, .03, .14, M.glassG, 10), sx - .7, sy + .66, sz));
      [0, 1, 2].forEach((i) => root.add(at(cyl(.06, .06, .2, M.ceramic, 18), sx - .2 + i * .17, sy + .15, sz)));
      root.add(at(cyl(.15, .11, .26, M.terracotta, 20), sx + .65, sy + .18, sz));
      for (let i = 0; i < 9; i++){ const a = i * 2.4; root.add(at(sphere(.09 + (i % 3) * .015, M.herb, 10), sx + .65 + Math.cos(a) * .09, sy + .36 + (i % 3) * .07, sz + Math.sin(a) * .09)); }
    } else {
      root.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.22, .14, .14, 28), M.ceramic), sx - .5, sy + .12, sz));
      root.add(at(new THREE.Mesh(new THREE.CylinderGeometry(.2, .12, .12, 28), M.ceramic), sx - .5, sy + .24, sz));
      root.add(at(cyl(.07, .07, .32, M.steelDim, 20), sx + .2, sy + .21, sz));
      root.add(at(cyl(.07, .07, .24, M.wood, 20), sx + .45, sy + .17, sz));
    }
  });

  // Best: ceiling speakers, infrared heaters, wall fan
  if (spec.best){
    [-1, 1].forEach((s) => {
      root.add(at(cyl(.12, .12, .05, M.black, 20), s * (W / 2 - 1.3), H - .37, D / 2 - 1.1));
      root.add(at(cyl(.022, .022, .3, M.black, 10), s * (W / 2 - 1.3), H - .55, D / 2 - 1.1));
      root.add(at(cyl(.25, .25, .6, M.fabric, 32), s * (W / 2 - 1.3), H - 1.0, D / 2 - 1.1));
      root.add(at(box(1.6, .15, .34, M.black, .02), s * 2.7, H - .45, .25));
      root.add(at(box(1.4, .02, .24, M.heat, 0), s * 2.7, H - .53, .25));
    });
  }

  // Fixed roof: black fascia with a light cap, LED perimeter under it
  root.add(at(box(W + .34, .3, D + .34, M.profile, .03), 0, H + .15, 0));
  root.add(at(box(W + .26, .03, D + .26, M.exterior, .01), 0, H + .31, 0));
  root.add(at(box(W - .5, .03, .03, M.led, 0), 0, H - .07, D / 2 - .14));
  root.add(at(box(W - .5, .03, .03, M.led, 0), 0, H - .34, -D / 2 + t + .07));

  // The gate: hinged at the roof's front edge. Closed it covers the kitchen; open it is the canopy.
  const gh = H - .55, gw = W - .08;
  const pivot = new THREE.Group(); pivot.position.set(0, H - .02, D / 2 + .1);
  const gate = new THREE.Group(); gate.position.set(0, -gh / 2, .06); pivot.add(gate);
  gate.add(box(gw, gh, .08, M.profile, .015));
  const ribs = Math.floor(gw / .3), ribW = .2;
  const ribMesh = new THREE.InstancedMesh(new RoundedBoxGeometry(ribW, gh - .14, .07, 3, .03), M.exterior, ribs);
  const d = new THREE.Object3D();
  for (let i = 0; i < ribs; i++){ d.position.set(-gw / 2 + .2 + i * ((gw - .4) / (ribs - 1)), 0, .07); d.updateMatrix(); ribMesh.setMatrixAt(i, d.matrix); }
  ribMesh.castShadow = true; ribMesh.receiveShadow = true; gate.add(ribMesh);
  gate.add(at(box(gw - .3, gh - .3, .02, M.interior, 0), 0, 0, -.05));
  gate.add(at(box(gw - .5, .03, .03, M.ledFront, 0), 0, -gh / 2 + .18, -.07));
  root.add(pivot);

  // Gas struts between the side profile and the gate
  const struts = [-1, 1].map((s) => {
    const body = cyl(.045, .045, 1, M.black, 14), rod = cyl(.022, .022, 1, M.chrome, 10);
    root.add(body, rod); return { body, rod, s };
  });
  const A = new THREE.Vector3(), B = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

  const lamp = new THREE.PointLight(0xffd2a0, 0, 12, 2); lamp.position.set(0, H - 1.2, .7); root.add(lamp);

  const find = (kind) => run.find((g) => g.userData.kind === kind);
  const anchors = {
    roof:    () => root.localToWorld(new THREE.Vector3(-W * .32, H - .1, D / 2 - .2)),
    sink:    () => root.localToWorld(new THREE.Vector3(sinkX - .3, topY + .05, zc + .3)),
    bbq:     () => grill.localToWorld(new THREE.Vector3(0, .95, .3)),
    fridge:  () => find('fridge').localToWorld(new THREE.Vector3(0, CAB_H * .7, CAB_D / 2)),
    storage: () => (find('storage') || find('fridge')).localToWorld(new THREE.Vector3(0, CAB_H * .45, CAB_D / 2)),
    hood:    () => root.localToWorld(new THREE.Vector3(bbqX, H - 2.2, -D / 2 + t + 1.5)),
    top:     () => root.localToWorld(new THREE.Vector3(0, H + 1, 0))
  };

  function update(S){
    const r = smooth(S.roof);
    pivot.rotation.x = -1.68 * r;
    const L = S.lights;
    M.led.emissiveIntensity = 2.2 * L; M.ledFront.emissiveIntensity = 2.2 * L * r; M.heat.emissiveIntensity = 1.2 * L * r;
    lamp.intensity = 1.6 * L * r;
    struts.forEach(({ body, rod, s }) => {
      A.set(s * (W / 2 - .32), H - 2.2, D / 2 - .12); root.localToWorld(A);
      B.set(s * (gw / 2 - .3), -gh / 2 + gh * .55, -.08); gate.localToWorld(B);
      const dir = B.clone().sub(A), len = dir.length(), q = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
      const mid = A.clone().addScaledVector(dir, .3), mid2 = A.clone().addScaledVector(dir, .78);
      root.worldToLocal(mid); root.worldToLocal(mid2);
      body.position.copy(mid); body.scale.set(1, len * .6, 1); body.quaternion.copy(q);
      rod.position.copy(mid2); rod.scale.set(1, len * .44, 1); rod.quaternion.copy(q);
      body.visible = rod.visible = r > .04;
    });
  }
  return { root, update, anchors, spec, bbqX };
}
