/* NOL POD, modelled in code from the Modular System Guide.
   Units are feet. x = width, y = up, z = depth (front is +z). Floor at y = 0, POD centred on x.
   One shell per POD; the cabinets, appliances and add-ons are the same parts in every POD. */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const SHADES = { white: new THREE.Color(0xE7E2D9), grey: new THREE.Color(0x4E5154) };

export const SPECS = {
  good:   { id: 'good',   W: 10, H: 7.5, D: 4, layout: ['sink', 'bbq', 'fridge'],                       hood: false, best: false },
  better: { id: 'better', W: 12, H: 8.5, D: 4, layout: ['sink', 'bbq', 'fridge', 'storage'],            hood: true,  best: false },
  best:   { id: 'best',   W: 14, H: 8.5, D: 4, layout: ['storage', 'sink', 'bbq', 'fridge', 'storage'], hood: true,  best: true }
};
const NOMINAL = { sink: 3, bbq: 3, fridge: 2, storage: 2 };

/* Shared materials: recolouring one recolours every POD in the scene. */
export function makeMaterials(){
  const std = (o) => new THREE.MeshStandardMaterial(o);
  const glow = (c) => std({ color: 0x000000, emissive: c, emissiveIntensity: 0, roughness: 1 });
  return {
    faces:    std({ color: SHADES.white.clone(), roughness: .5, metalness: 0, envMapIntensity: .5 }),
    exterior: std({ color: SHADES.grey.clone(),  roughness: .55, metalness: .08, envMapIntensity: .5 }),
    interior: std({ color: SHADES.grey.clone(),  roughness: .7, metalness: 0, envMapIntensity: .4 }),
    frame:    std({ color: 0x101113, roughness: .38, metalness: .55, envMapIntensity: .6 }),
    body:     std({ color: 0x141516, roughness: .62, metalness: .2,  envMapIntensity: .4 }),
    counter:  std({ color: 0x1d1e1f, roughness: .3,  metalness: .05, envMapIntensity: .7 }),
    steel:    std({ color: 0xd2d5d9, roughness: .2,  metalness: 1,   envMapIntensity: 1.1 }),
    steelDim: std({ color: 0x8e9196, roughness: .34, metalness: 1,   envMapIntensity: 1 }),
    black:    std({ color: 0x0c0c0d, roughness: .45, metalness: .35, envMapIntensity: .6 }),
    rubber:   std({ color: 0x080808, roughness: .9,  metalness: 0 }),
    basin:    std({ color: 0x2a2c2f, roughness: .25, metalness: .9,  envMapIntensity: .9 }),
    wood:     std({ color: 0x7d5434, roughness: .65, metalness: 0,   envMapIntensity: .3 }),
    glass:    new THREE.MeshPhysicalMaterial({ color: 0x0d1114, roughness: .04, metalness: 0, transparent: true, opacity: .32, envMapIntensity: 1.4 }),
    flute:    std({ color: 0x3a3c3e, roughness: .6, metalness: .08, envMapIntensity: .4 }),
    led:      glow(0xffcf9a),
    ledFront: glow(0xffcf9a),
    cool:     glow(0xdfeaff),
    fire:     glow(0xff6a1e),
    heat:     glow(0xff4a14),
    lineMat:  new THREE.MeshBasicMaterial({ color: 0xc9a96e, transparent: true, opacity: .95 })
  };
}

/* ---------- small helpers ---------- */
function box(w, h, d, mat, r = .025){
  const g = r > 0 && Math.min(w, h, d) > r * 2.2 ? new RoundedBoxGeometry(w, h, d, 2, r) : new THREE.BoxGeometry(w, h, d);
  const m = new THREE.Mesh(g, mat); m.castShadow = true; m.receiveShadow = true; return m;
}
function cyl(rt, rb, h, mat, seg = 24){
  const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.castShadow = true; m.receiveShadow = true; return m;
}
function at(obj, x, y, z){ obj.position.set(x, y, z); return obj; }
const smooth = (t) => t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t);

/* ---------- cabinets (body black, fronts in the "cabinet faces" colour) ---------- */
const CAB_H = 2.6, CAB_D = 2.0;
function handleV(M){ return box(.055, .95, .06, M.black, .02); }
function handleH(w, M){ return box(w, .055, .06, M.black, .02); }

function cabinet(kind, w, M){
  const g = new THREE.Group();
  g.add(at(box(w - .02, CAB_H, CAB_D, M.body, .02), 0, CAB_H / 2, 0));
  const fz = CAB_D / 2 + .022, gap = .035;
  if (kind === 'sink'){
    const dw = w / 2 - gap * 1.5;
    [-1, 1].forEach((s) => {
      g.add(at(box(dw, CAB_H - .16, .04, M.faces, .012), s * (dw / 2 + gap / 2), CAB_H / 2, fz));
      g.add(at(handleV(M), s * .16, CAB_H * .62, fz + .05));
    });
  } else if (kind === 'bbq'){
    const dh = (CAB_H - .16 - gap) / 2;
    [0, 1].forEach((i) => {
      const y = .08 + dh / 2 + i * (dh + gap);
      g.add(at(box(w - gap * 2, dh, .04, M.faces, .012), 0, y, fz));
      g.add(at(handleH(w * .5, M), 0, y + dh * .28, fz + .05));
    });
  } else if (kind === 'storage'){
    g.add(at(box(w - gap * 2, CAB_H - .16, .04, M.faces, .012), 0, CAB_H / 2, fz));
    g.add(at(handleV(M), w / 2 - .28, CAB_H * .62, fz + .05));
  } else if (kind === 'fridge'){
    g.add(at(box(w - .06, CAB_H - .1, .05, M.steelDim, .02), 0, CAB_H / 2, fz - .01));
    g.add(at(box(w - .3, CAB_H - .42, .02, M.cool, 0), 0, CAB_H / 2 + .06, fz - .04));
    // bottles on three shelves
    const shelves = 3, per = Math.max(4, Math.floor((w - .5) / .27));
    const bottle = new THREE.InstancedMesh(new THREE.CylinderGeometry(.075, .085, .55, 12), new THREE.MeshStandardMaterial({ roughness: .2, metalness: .1 }), shelves * per);
    const dummy = new THREE.Object3D(), tint = [0x2f5b3a, 0x6b4a1d, 0x9db9c4, 0x3c5a2c];
    let n = 0;
    for (let s = 0; s < shelves; s++) for (let i = 0; i < per; i++){
      dummy.position.set(-(w - .5) / 2 + i * ((w - .5) / (per - 1)), .55 + s * .68, fz - .2);
      dummy.updateMatrix(); bottle.setMatrixAt(n, dummy.matrix);
      bottle.setColorAt(n, new THREE.Color(tint[(i + s) % tint.length])); n++;
    }
    g.add(bottle);
    for (let s = 0; s < shelves; s++) g.add(at(box(w - .3, .02, .5, M.steelDim, 0), 0, .27 + s * .68, fz - .2));
    g.add(at(box(w - .22, CAB_H - .34, .035, M.glass, 0), 0, CAB_H / 2 + .04, fz + .03));
    g.add(at(box(.06, 1.5, .07, M.steel, .025), w / 2 - .2, CAB_H * .55, fz + .1));
  }
  return g;
}

/* ---------- cooking appliances for the BBQ cabinet slot ---------- */
function appliances(w, M){
  const aw = Math.min(w * .86, 3.0), list = [];
  // 0 BBQ
  {
    const g = new THREE.Group();
    g.add(at(box(aw, .5, 1.45, M.steel, .03), 0, .25, 0));
    g.add(at(box(aw - .04, .22, .06, M.steelDim, .02), 0, .26, .73));
    for (let i = 0; i < 4; i++){
      const k = cyl(.075, .075, .08, M.black, 20); k.rotation.x = Math.PI / 2;
      g.add(at(k, -aw * .3 + i * aw * .2, .26, .8));
    }
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(.52, .52, aw - .02, 40, 1, false, 0, Math.PI), M.steel);
    lid.rotation.z = Math.PI / 2; lid.scale.set(1, 1, 1.38); lid.castShadow = true;
    g.add(at(lid, 0, .5, 0));
    const bar = cyl(.035, .035, aw * .72, M.steel, 16); bar.rotation.z = Math.PI / 2;
    g.add(at(bar, 0, .76, .82));
    const gauge = at(cyl(.12, .12, .03, M.basin, 24), 0, .98, .32); gauge.rotation.x = Math.PI / 2.6; g.add(gauge);
    list.push(g);
  }
  // 1 Smoker
  {
    const g = new THREE.Group(), sw = aw * .66;
    g.add(at(box(sw, 1.0, 1.25, M.steel, .04), -aw * .12, .5, 0));
    g.add(at(box(sw * .76, .42, .03, M.glass, 0), -aw * .12, .62, .64));
    g.add(at(box(sw * .74, .4, .02, M.fire, 0), -aw * .12, .62, .6));
    g.add(at(box(.5, 1.05, .9, M.black, .04), sw / 2 - aw * .12 + .28, .52, .05));
    g.add(at(box(.3, .16, .02, M.cool, 0), sw / 2 - aw * .12 + .28, .82, .51));
    g.add(at(cyl(.1, .1, .75, M.steel), -aw * .12 - sw * .32, 1.36, -.25));
    const bar = cyl(.03, .03, sw * .6, M.steel, 16); bar.rotation.z = Math.PI / 2;
    g.add(at(bar, -aw * .12, .32, .7));
    list.push(g);
  }
  // 2 Pizza oven
  {
    const g = new THREE.Group(), ow = aw * .72;
    g.add(at(box(ow, .32, 1.35, M.steel, .03), 0, .16, 0));
    const dome = new THREE.Mesh(new THREE.CylinderGeometry(.62, .62, 1.3, 40, 1, true, -Math.PI / 2, Math.PI), M.black);
    dome.rotation.x = Math.PI / 2; dome.scale.set(ow / 1.3, 1, 1); dome.castShadow = true;
    g.add(at(dome, 0, .32, 0));
    const face = new THREE.Mesh(new THREE.CircleGeometry(.62, 40, 0, Math.PI), M.steel);
    face.scale.x = ow / 1.3; g.add(at(face, 0, .32, .651));
    const mouth = new THREE.Mesh(new THREE.CircleGeometry(.36, 32, 0, Math.PI), M.fire);
    mouth.scale.x = ow / 1.3; g.add(at(mouth, 0, .34, .656));
    g.add(at(cyl(.11, .11, .7, M.steel), 0, 1.15, -.2));
    list.push(g);
  }
  // 3 Griddle
  {
    const g = new THREE.Group();
    g.add(at(box(aw, .42, 1.4, M.steel, .03), 0, .21, 0));
    g.add(at(box(aw - .06, .05, 1.32, M.black, .015), 0, .445, .02));
    g.add(at(box(aw, .42, .05, M.black, .015), 0, .66, -.68));
    for (let i = 0; i < 4; i++){
      const k = cyl(.075, .075, .08, M.black, 20); k.rotation.x = Math.PI / 2;
      g.add(at(k, -aw * .3 + i * aw * .2, .22, .74));
    }
    list.push(g);
  }
  return list;
}

/* ---------- the POD ---------- */
export function buildPod(spec, M){
  const { W, H, D } = spec, t = .16;
  const root = new THREE.Group(); root.name = 'pod-' + spec.id;
  const parts = {};

  // Plinth with toe-kick light
  const plinth = new THREE.Group();
  plinth.add(at(box(W, .34, D, M.frame, .03), 0, .17, 0));
  plinth.add(at(box(W - .4, .03, .02, M.led, 0), 0, .1, D / 2 + .012));
  root.add(plinth);

  // Back wall, sides: exterior panels outside, interior panels inside, black frame posts
  const back = new THREE.Group(), left = new THREE.Group(), right = new THREE.Group();
  back.add(at(box(W, H - .34, t, M.exterior, .02), 0, .34 + (H - .34) / 2, -D / 2 + t / 2));
  back.add(at(box(W - 2 * t, H - .7, .03, M.interior, 0), 0, .34 + (H - .7) / 2, -D / 2 + t + .016));
  [[left, -1], [right, 1]].forEach(([g, s]) => {
    g.add(at(box(t, H - .34, D, M.exterior, .02), s * (W / 2 - t / 2), .34 + (H - .34) / 2, 0));
    g.add(at(box(.03, H - .7, D - t - .1, M.interior, 0), s * (W / 2 - t - .016), .34 + (H - .7) / 2, t / 2));
    g.add(at(box(.22, H - .34, .22, M.frame, .02), s * (W / 2 - .11), .34 + (H - .34) / 2, D / 2 - .11));
  });
  root.add(back, left, right);

  // Rear utility panel and its five ports
  const util = new THREE.Group();
  util.add(at(box(1.7, 1.05, .08, M.black, .02), W / 2 - 1.6, 1.1, -D / 2 - .04));
  const ports = [];
  for (let i = 0; i < 5; i++){
    const p = cyl(.06, .06, .14, i === 1 ? M.wood : M.steel, 16); p.rotation.x = Math.PI / 2;
    const v = new THREE.Vector3(W / 2 - 2.25 + i * .32, 1.05, -D / 2 - .12);
    util.add(at(p, v.x, v.y, v.z)); ports.push(v);
  }
  back.add(util);

  // Cabinet run, scaled to fill the inside of the shell
  const inner = W - 2 * t - .12, sum = spec.layout.reduce((s, k) => s + NOMINAL[k], 0), k = inner / sum;
  const zc = -D / 2 + t + .04 + CAB_D / 2;
  const run = []; let x = -inner / 2, bbqX = 0, sinkX = 0, fridgeX = 0;
  spec.layout.forEach((kind, i) => {
    const w = NOMINAL[kind] * k, cx = x + w / 2;
    const g = cabinet(kind, w, M); g.position.set(cx, .34, zc);
    g.userData = { kind, w, base: g.position.clone(), i };
    root.add(g); run.push(g);
    if (kind === 'bbq') bbqX = cx; if (kind === 'sink') sinkX = cx; if (kind === 'fridge') fridgeX = cx;
    x += w;
  });
  const topY = .34 + CAB_H + .14;

  // Countertop with sink, faucet and a cutting board
  const counter = new THREE.Group();
  counter.add(at(box(inner + .06, .14, CAB_D + .14, M.counter, .02), 0, topY - .07, zc + .05));
  counter.add(at(box(1.7, .02, 1.12, M.steel, 0), sinkX, topY + .01, zc + .1));
  counter.add(at(box(1.5, .025, .94, M.basin, 0), sinkX, topY + .015, zc + .1));
  const fp = new THREE.CatmullRomCurve3([
    new THREE.Vector3(sinkX + .55, topY, zc - .55), new THREE.Vector3(sinkX + .55, topY + 1.05, zc - .55),
    new THREE.Vector3(sinkX + .55, topY + 1.3, zc - .3), new THREE.Vector3(sinkX + .55, topY + 1.15, zc - .02), new THREE.Vector3(sinkX + .55, topY + .95, zc + .02)]);
  const faucet = new THREE.Mesh(new THREE.TubeGeometry(fp, 40, .045, 12), M.black); faucet.castShadow = true;
  counter.add(faucet);
  const board = box(.75, .05, 1.05, M.wood, .02); board.rotation.x = -1.32;
  counter.add(at(board, fridgeX + .3, topY + .5, zc - .78));
  [0, 1].forEach((i) => counter.add(at(cyl(.13, .13, .42 - i * .1, M.steelDim), fridgeX - .35 + i * .3, topY + .21 - i * .05, zc - .55)));
  root.add(counter);

  // Cooking slot appliances (one shown at a time)
  const slot = new THREE.Group(); slot.position.set(bbqX, topY - .02, zc + .08);
  const apps = appliances(NOMINAL.bbq * k, M); apps.forEach((a) => slot.add(a));
  root.add(slot);

  // Hood fan, shelves, Best-only speakers and heaters
  const upper = new THREE.Group();
  if (spec.hood){
    const hy = H - 2.4;
    upper.add(at(box(2.5, .32, 1.45, M.steel, .03), bbqX, hy, -D / 2 + t + .78));
    const taper = new THREE.Mesh(new THREE.CylinderGeometry(.5, 1.25, .55, 4, 1), M.steel);
    taper.rotation.y = Math.PI / 4; taper.scale.set(1.3, 1, .72); taper.castShadow = true;
    upper.add(at(taper, bbqX, hy + .43, -D / 2 + t + .62));
    upper.add(at(box(.95, H - .5 - (hy + .7), .62, M.steel, .02), bbqX, (H - .5 + hy + .7) / 2, -D / 2 + t + .36));
    [-.6, .6].forEach((dx) => upper.add(at(box(.22, .02, .22, M.ledFront, 0), bbqX + dx, hy - .17, -D / 2 + t + 1.1)));
  }
  [sinkX, fridgeX].forEach((sx) => {
    upper.add(at(box(2.2, .07, .6, M.black, .01), sx, topY + 2.0, -D / 2 + t + .34));
    upper.add(at(cyl(.11, .11, .32, M.steelDim), sx - .5, topY + 2.2, -D / 2 + t + .34));
    upper.add(at(cyl(.11, .11, .24, M.wood), sx - .2, topY + 2.16, -D / 2 + t + .34));
  });
  if (spec.best){
    [-1, 1].forEach((s) => {
      upper.add(at(cyl(.02, .02, .35, M.black, 8), s * (W / 2 - 1.2), H - .55, D / 2 - 1.1));
      upper.add(at(cyl(.24, .24, .55, M.rubber, 28), s * (W / 2 - 1.2), H - .98, D / 2 - 1.1));
      upper.add(at(box(1.5, .14, .32, M.black, .02), s * 2.6, H - .48, .2));
      upper.add(at(box(1.3, .02, .22, M.heat, 0), s * 2.6, H - .56, .2));
    });
    const fan = new THREE.Group();
    const disc = cyl(.62, .62, .06, M.black, 40); disc.rotation.x = Math.PI / 2; fan.add(disc);
    for (let i = 0; i < 3; i++){ const b = box(.95, .02, .2, M.black, 0); b.rotation.z = i * 2.094; fan.add(b); }
    fan.position.set(W / 2 - t - .1, H - 2.2, -.4); fan.rotation.y = -Math.PI / 2;
    upper.add(fan);
  }
  root.add(upper);

  // Fixed roof and LED perimeter
  const roof = new THREE.Group();
  roof.add(at(box(W + .3, .26, D + .3, M.frame, .03), 0, H + .13, 0));
  roof.add(at(box(W - .5, .03, .03, M.led, 0), 0, H - .06, D / 2 - .14));
  roof.add(at(box(W - .5, .03, .03, M.led, 0), 0, H - .3, -D / 2 + t + .06));
  [-1, 1].forEach((s) => roof.add(at(box(.03, .03, D - .5, M.led, 0), s * (W / 2 - t - .06), H - .08, 0)));
  root.add(roof);

  // The gate: hinged on the roof's front edge. Closed it covers the kitchen; open it becomes the canopy.
  const gh = H - .52, gw = W - .06;
  const pivot = new THREE.Group(); pivot.position.set(0, H - .02, D / 2 + .09);
  const gate = new THREE.Group(); gate.position.set(0, -gh / 2, .06); pivot.add(gate);
  gate.add(box(gw, gh, .11, M.exterior, .02));
  const flutes = Math.floor(gw / .5);
  const fl = new THREE.InstancedMesh(new THREE.BoxGeometry(.03, gh - .02, .012), M.flute, flutes);
  const d = new THREE.Object3D();
  for (let i = 0; i < flutes; i++){ d.position.set(-gw / 2 + .25 + i * (gw - .5) / (flutes - 1), 0, .058); d.updateMatrix(); fl.setMatrixAt(i, d.matrix); }
  gate.add(fl);
  gate.add(at(box(gw - .3, gh - .3, .02, M.interior, 0), 0, 0, -.065));
  gate.add(at(box(gw - .5, .03, .03, M.ledFront, 0), 0, -gh / 2 + .2, -.08));
  roof.add(pivot);

  // Gas struts between side frame and gate
  const struts = [-1, 1].map((s) => {
    const m = cyl(.035, .035, 1, M.steel, 12); m.castShadow = false; root.add(m);
    return { m, s };
  });
  const tmpA = new THREE.Vector3(), tmpB = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);

  // Interior light that comes on with the LEDs
  const lamp = new THREE.PointLight(0xffc98f, 0, 12, 1.8); lamp.position.set(0, H - 1.1, .6); root.add(lamp);

  // Utility lines, drawn on during the utilities chapter
  const lineDefs = ports.map((p, i) => {
    const dz = 1.2 + i * .12, sx = (i - 2) * .8;
    const c = new THREE.CatmullRomCurve3([
      p.clone(), p.clone().add(new THREE.Vector3(0, 0, -dz * .5)), new THREE.Vector3(p.x + sx * .3, .17, p.z - dz),
      new THREE.Vector3(p.x + sx * 1.4, .17, p.z - dz - 1.2), new THREE.Vector3(p.x + sx * 2.2, .17, p.z - dz - 2.6)]);
    const geo = new THREE.TubeGeometry(c, 80, .035, 8);
    const mesh = new THREE.Mesh(geo, M.lineMat); mesh.visible = false;
    back.add(mesh);
    return { mesh, total: geo.index.count, end: c.getPoint(1) };
  });

  // Explode offsets per part
  const EX = new Map([
    [roof, new THREE.Vector3(0, 4.2, 0)], [back, new THREE.Vector3(0, 0, -3.2)],
    [left, new THREE.Vector3(-3.2, 0, 0)], [right, new THREE.Vector3(3.2, 0, 0)],
    [counter, new THREE.Vector3(0, 1.8, 1.2)], [slot, new THREE.Vector3(0, 3.6, 2.4)], [upper, new THREE.Vector3(0, 1.2, -1.6)]
  ]);
  run.forEach((g) => EX.set(g, new THREE.Vector3(g.userData.base.x * .22, 0, 3.4)));
  const bases = new Map(); EX.forEach((_, o) => bases.set(o, o.position.clone()));

  // Anchors for on-screen callouts (local to root)
  const anchors = {
    roof:    () => roof.localToWorld(new THREE.Vector3(-W * .3, H + .3, 0)),
    sink:    () => run.find((g) => g.userData.kind === 'sink').localToWorld(new THREE.Vector3(0, CAB_H * .5, CAB_D / 2)),
    bbq:     () => slot.localToWorld(new THREE.Vector3(0, .9, 0)),
    fridge:  () => run.find((g) => g.userData.kind === 'fridge').localToWorld(new THREE.Vector3(0, CAB_H * .6, CAB_D / 2)),
    storage: () => (run.find((g) => g.userData.kind === 'storage') || run[run.length - 1]).localToWorld(new THREE.Vector3(0, CAB_H * .45, CAB_D / 2)),
    shell:   () => left.localToWorld(new THREE.Vector3(-W / 2, H * .55, 0)),
    top:     () => root.localToWorld(new THREE.Vector3(0, H + 1.1, 0)),
    slot:    () => slot.localToWorld(new THREE.Vector3(0, .6, 0)),
    lineEnds: () => lineDefs.map((l) => back.localToWorld(l.end.clone()))
  };

  function update(S){
    // gate: 0 closed, 1 open (canopy, slightly raised past horizontal)
    const r = smooth(S.roof);
    pivot.rotation.x = -1.68 * r;
    // explode
    const e = smooth(S.explode);
    EX.forEach((v, o) => o.position.copy(bases.get(o)).addScaledVector(v, e));
    // cooking slot: the active appliance rises, the others drop into the cabinet
    apps.forEach((a, i) => {
      const w = Math.max(0, 1 - Math.abs(S.cook - i) * 1.6);
      a.visible = w > 0.001; a.position.y = -1.6 * (1 - smooth(w));
    });
    // lights
    const L = S.lights;
    M.led.emissiveIntensity = 1.8 * L; M.ledFront.emissiveIntensity = 1.8 * L * r;
    M.cool.emissiveIntensity = .45 * Math.max(L, .3);
    M.fire.emissiveIntensity = 2.2; M.heat.emissiveIntensity = 1.6 * L * r;
    lamp.intensity = 2.4 * L * r;
    // struts follow the gate
    struts.forEach(({ m, s }) => {
      tmpA.set(s * (W / 2 - .3), H - 2.1, D / 2 - .15); root.localToWorld(tmpA);
      tmpB.set(s * (gw / 2 - .35), gh * .45 - gh / 2 + .2, -.08); gate.localToWorld(tmpB);
      const dir = tmpB.clone().sub(tmpA), len = dir.length();
      m.position.copy(tmpA).add(tmpB).multiplyScalar(.5); root.worldToLocal(m.position);
      m.scale.set(1, len, 1); m.quaternion.setFromUnitVectors(up, dir.normalize());
      m.visible = r > .05 && e < .05;
    });
    // utility lines draw on
    lineDefs.forEach((l, i) => {
      const p = Math.max(0, Math.min(1, S.util * 1.4 - i * .08));
      l.mesh.visible = p > 0; l.mesh.geometry.setDrawRange(0, Math.floor(l.total * p / 6) * 6);
    });
  }

  return { root, update, anchors, spec, bbqX };
}
