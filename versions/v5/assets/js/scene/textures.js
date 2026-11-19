/* Procedural surface textures, drawn once on canvases. Seeded, so every visit looks the same. */
import * as THREE from 'three';

function rng(seed){ let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
function canvas(w, h = w){ const c = document.createElement('canvas'); c.width = w; c.height = h; return [c, c.getContext('2d')]; }
function tex(c, repeat = [1, 1], color = true){
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8; if (color) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function noise(g, w, h, r, n, alpha, light = .5){
  for (let i = 0; i < n; i++){
    const v = r() < light ? 255 : 0;
    g.fillStyle = `rgba(${v},${v},${v},${alpha * r()})`;
    g.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2);
  }
}

/* Brushed stainless: fine horizontal grain */
export function brushed(){
  const [c, g] = canvas(512); const r = rng(7);
  g.fillStyle = '#b9bdc2'; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++){
    const y = r() * 512, v = 150 + r() * 105 | 0;
    g.strokeStyle = `rgba(${v},${v + 2},${v + 5},${.08 + r() * .18})`; g.lineWidth = r() * 1.2 + .2;
    g.beginPath(); g.moveTo(r() * 512 - 100, y); g.lineTo(r() * 512 + 200, y + (r() - .5) * 1.5); g.stroke();
  }
  return tex(c, [1, 1]);
}

/* Honed dark stone for the countertop */
export function stone(){
  const [c, g] = canvas(1024); const r = rng(21);
  g.fillStyle = '#2b2b2c'; g.fillRect(0, 0, 1024, 1024);
  noise(g, 1024, 1024, r, 60000, .16, .45);
  for (let i = 0; i < 26; i++){
    g.strokeStyle = `rgba(200,198,194,${.03 + r() * .05})`; g.lineWidth = .6 + r() * 1.4;
    g.beginPath(); let x = r() * 1024, y = r() * 1024; g.moveTo(x, y);
    for (let k = 0; k < 8; k++){ x += (r() - .3) * 140; y += (r() - .5) * 90; g.lineTo(x, y); }
    g.stroke();
  }
  return tex(c, [2, 1]);
}

/* Oak for shelves and the cutting board */
export function wood(){
  const [c, g] = canvas(512, 256); const r = rng(5);
  const grd = g.createLinearGradient(0, 0, 0, 256); grd.addColorStop(0, '#9c6b43'); grd.addColorStop(1, '#8a5c37');
  g.fillStyle = grd; g.fillRect(0, 0, 512, 256);
  for (let i = 0; i < 140; i++){
    const y = r() * 256; g.strokeStyle = `rgba(${60 + r() * 40},${35 + r() * 25},${18},${.15 + r() * .25})`; g.lineWidth = .5 + r() * 2;
    g.beginPath(); g.moveTo(0, y);
    for (let x = 0; x <= 512; x += 32) g.lineTo(x, y + Math.sin(x * .02 + i) * 3 * r());
    g.stroke();
  }
  return tex(c, [1, 1]);
}

/* Large-format limestone paving with tight joints */
export function paving(){
  const [c, g] = canvas(1024); const r = rng(13);
  g.fillStyle = '#d7d0c3'; g.fillRect(0, 0, 1024, 1024);
  // slight tone change per slab (2 x 4 ft slabs, 4 x 2 per tile)
  for (let row = 0; row < 4; row++) for (let col = 0; col < 2; col++){
    const off = row % 2 ? 256 : 0, v = (r() - .5) * 14;
    g.fillStyle = `rgba(${v > 0 ? 255 : 0},${v > 0 ? 250 : 0},${v > 0 ? 240 : 0},${Math.abs(v) / 120})`;
    g.fillRect(col * 512 + off - (off && col ? 1024 : 0), row * 256, 512, 256);
  }
  noise(g, 1024, 1024, r, 50000, .1, .5);
  for (let i = 0; i < 900; i++){ g.fillStyle = `rgba(150,140,120,${r() * .25})`; g.beginPath(); g.arc(r() * 1024, r() * 1024, r() * 1.8, 0, 7); g.fill(); }
  g.strokeStyle = 'rgba(120,112,100,.75)'; g.lineWidth = 2.5;
  for (let row = 0; row <= 4; row++){ g.beginPath(); g.moveTo(0, row * 256); g.lineTo(1024, row * 256); g.stroke(); }
  for (let row = 0; row < 4; row++){
    const off = row % 2 ? 256 : 0;
    for (let x = off; x <= 1024; x += 512){ g.beginPath(); g.moveTo(x, row * 256); g.lineTo(x, row * 256 + 256); g.stroke(); }
  }
  return tex(c, [1, 1]);
}

/* Lawn */
export function grass(){
  const [c, g] = canvas(1024); const r = rng(3);
  g.fillStyle = '#5d7a37'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 120000; i++){
    const h = 75 + r() * 30, s = 40 + r() * 20, l = 26 + r() * 22;
    g.strokeStyle = `hsla(${h},${s}%,${l}%,.55)`; g.lineWidth = 1;
    const x = r() * 1024, y = r() * 1024; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (r() - .5) * 3, y - 3 - r() * 4); g.stroke();
  }
  return tex(c, [1, 1]);
}

/* Clipped foliage for hedges, boxwood and cypress */
export function leaves(base = '#2f4a23'){
  const [c, g] = canvas(512); const r = rng(11);
  g.fillStyle = base; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 9000; i++){
    const l = 14 + r() * 26, h = 85 + r() * 25;
    g.fillStyle = `hsla(${h},${35 + r() * 20}%,${l}%,${.5 + r() * .5})`;
    g.beginPath(); g.ellipse(r() * 512, r() * 512, 2 + r() * 4, 1 + r() * 2.2, r() * 3.14, 0, 7); g.fill();
  }
  return tex(c, [1, 1]);
}

/* Smooth white render for the house */
export function render(){
  const [c, g] = canvas(512); const r = rng(17);
  g.fillStyle = '#efece6'; g.fillRect(0, 0, 512, 512);
  noise(g, 512, 512, r, 30000, .05, .5);
  return tex(c, [1, 1]);
}

/* Fridge contents: a row of labels for bottles and cans */
export function labels(){
  const [c, g] = canvas(256, 64); const cols = ['#f3efe6', '#c2382f', '#1f3d73', '#e3b341', '#2f6b45', '#ece6d8'];
  cols.forEach((col, i) => { g.fillStyle = col; g.fillRect(i * 42, 0, 42, 64); });
  return tex(c, [1, 1]);
}
