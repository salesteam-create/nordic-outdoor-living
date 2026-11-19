/* NOL homepage journey: one sticky WebGL stage, driven by scroll through eight chapters.
   The scroll timeline only moves numbers in S; render() turns S into the picture every frame. */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { buildPod, makeMaterials, SPECS, SHADES } from './pod.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const stage = $('#stage'), canvas = $('#scene');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 820px)').matches;
const C = window.NOL_CATALOG;

function fail(){ document.documentElement.classList.add('no-webgl'); $('#loader')?.remove(); }
let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: !small, powerPreference: 'high-performance' }); }
catch (e){ fail(); throw e; }

renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .95;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34, 1, .5, 600);
const pmrem = new THREE.PMREMGenerator(renderer);
scene.environment = pmrem.fromScene(new RoomEnvironment(renderer), .04).texture;

/* ---------- Dusk sky: a gradient dome with a warm horizon band ---------- */
const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 48, 24), new THREE.ShaderMaterial({
  side: THREE.BackSide, depthWrite: false,
  uniforms: { night: { value: 0 } },
  vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: `uniform float night; varying vec3 vP;
    void main(){
      float h = vP.y;
      vec3 top = mix(vec3(.035,.045,.075), vec3(.012,.014,.022), night);
      vec3 mid = mix(vec3(.11,.09,.1), vec3(.025,.027,.04), night);
      vec3 hor = mix(vec3(.62,.36,.2), vec3(.09,.07,.08), night);
      vec3 c = h > .08 ? mix(mid, top, smoothstep(.08,.55,h)) : mix(hor, mid, smoothstep(-.02,.08,h));
      c = h < -.02 ? vec3(.012,.012,.014) : c;
      float g = exp(-pow((h-.01)*14.,2.)) * (1.-night) * .55;
      gl_FragColor = vec4(c + vec3(.9,.5,.25)*g*.35, 1.);
    }`
}));
scene.add(sky);
scene.fog = new THREE.Fog(0x15110f, 40, 170);

/* ---------- Ground and stone patio ---------- */
const ground = new THREE.Mesh(new THREE.CircleGeometry(260, 64), new THREE.MeshStandardMaterial({ color: 0x0b0b0c, roughness: .96 }));
ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
function stoneTexture(){
  const c = document.createElement('canvas'); c.width = c.height = 1024;
  const g = c.getContext('2d');
  g.fillStyle = '#5b5752'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 9000; i++){ g.fillStyle = `rgba(${Math.random() > .5 ? 255 : 0},${Math.random() > .5 ? 255 : 0},${Math.random() > .5 ? 255 : 0},.025)`; g.fillRect(Math.random() * 1024, Math.random() * 1024, 2, 2); }
  g.strokeStyle = 'rgba(20,18,16,.55)'; g.lineWidth = 3;
  for (let i = 0; i <= 4; i++){ g.beginPath(); g.moveTo(i * 256, 0); g.lineTo(i * 256, 1024); g.stroke(); g.beginPath(); g.moveTo(0, i * 256); g.lineTo(1024, i * 256); g.stroke(); }
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}
const stone = stoneTexture(); stone.repeat.set(52 / 8, 22 / 8);
const patio = new THREE.Mesh(new THREE.BoxGeometry(52, .12, 22), new THREE.MeshStandardMaterial({ map: stone, roughness: .82, metalness: 0, color: 0x6c6862 }));
patio.position.set(0, .06, 1); patio.receiveShadow = true; scene.add(patio);

/* ---------- Light ---------- */
const hemi = new THREE.HemisphereLight(0x5a6888, 0x120d0a, .55); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffc694, 2.4);
sun.position.set(-18, 11, 16); sun.castShadow = true;
sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 18, bottom: -12, near: 1, far: 70 });
sun.shadow.bias = -.0004; sun.shadow.normalBias = .03;
scene.add(sun);
const rim = new THREE.DirectionalLight(0x8aa2d8, .9); rim.position.set(14, 9, -18); scene.add(rim);

/* ---------- PODs: Better in the middle, Good and Best rise for the line-up ---------- */
const M = makeMaterials();
const better = buildPod(SPECS.better, M), good = buildPod(SPECS.good, M), best = buildPod(SPECS.best, M);
scene.add(better.root, good.root, best.root);
const LINE = { good: -14.6, best: 16.2 };
good.root.position.x = LINE.good; best.root.position.x = LINE.best;

/* ---------- Post-processing: gentle bloom for the LEDs and flame ---------- */
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), small ? .3 : .42, .5, .9);
composer.addPass(bloom);
composer.addPass(new OutputPass());

/* ---------- State the scroll timeline animates ---------- */
const S = { ox: 0, oy: 0, cx: 0, cy: 0, cz: 0, tx: 0, ty: 0, tz: 0, roof: 0, lights: .2, explode: 0, cook: 0, util: 0, lineup: 0, night: 0, faces: 0, ext: 1, int: 1, intro: reduceMotion ? 1 : 0 };
const bbq = better.bbqX;
const K = {
  closed:  { cam: [13.5, 5.3, 22],  tgt: [0, 3.9, 0] },
  open:    { cam: [9.5, 5.4, 20.5], tgt: [0, 4.1, 0] },
  explode: { cam: [20, 12.5, 27],   tgt: [0, 4.2, 1] },
  cook:    { cam: [bbq + 2.6, 5.1, 6.6], tgt: [bbq, 3.7, .2] },
  util:    { cam: [-4, 6.4, -17.5], tgt: [4, .9, -4.6] },
  lineup:  { cam: [0.8, 12, 47],    tgt: [0.8, 3.6, 0] },
  color:   { cam: [-12.5, 5.8, 19.5], tgt: [.4, 3.8, 0] },
  close:   { cam: [17, 6, 32],      tgt: [0, 3.6, 0] }
};
// ox / oy shift the picture on screen (fraction of the viewport) so the POD sits beside the copy, not under it
// positive ox moves the POD right of centre (copy on the left), negative moves it left (copy on the right)
const FRAME = { closed: [.17, .02], open: [.2, .03], explode: [-.08, -.04], cook: [.18, 0], util: [-.16, 0], lineup: [0, .07], color: [.21, .02], close: [0, .17] };
const camOf = (k) => ({ cx: K[k].cam[0], cy: K[k].cam[1], cz: K[k].cam[2], tx: K[k].tgt[0], ty: K[k].tgt[1], tz: K[k].tgt[2], ox: small ? 0 : FRAME[k][0], oy: small ? .2 : FRAME[k][1] });
Object.assign(S, camOf('closed'));

/* ---------- Colours: the chapter animates them; a click on a swatch takes over ---------- */
const user = {};
const tmpC = new THREE.Color();
function applyColors(){
  [['faces', M.faces], ['ext', M.exterior], ['int', M.interior]].forEach(([k, mat]) => {
    const v = k in user ? user[k] : S[k];
    mat.color.copy(tmpC.copy(SHADES.white).lerp(SHADES.grey, v));
  });
}
$$('[data-swatch]').forEach((b) => b.addEventListener('click', () => {
  const [k, v] = b.dataset.swatch.split(':');
  user[k] = v === 'grey' ? 1 : 0;
  $$(`[data-swatch^="${k}:"]`).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  window.NOL_track && window.NOL_track('option_select', { option: k, value: v, location: 'journey' });
}));

/* ---------- Callouts pinned to parts of the model ---------- */
const calls = $$('.co[data-layer]').map((el) => ({ el, key: el.dataset.anchor, pod: el.dataset.pod, layer: el.dataset.layer, i: +el.dataset.i || 0 }));
const pods = { better, good, best };
const v3 = new THREE.Vector3();
function place(el, p, op){
  v3.copy(p).project(camera);
  const vis = op > .01 && v3.z < 1;
  el.style.opacity = vis ? op : 0;
  el.style.visibility = vis ? 'visible' : 'hidden';
  if (!vis) return;
  el.style.transform = `translate3d(${(v3.x * .5 + .5) * stage.clientWidth}px, ${(-v3.y * .5 + .5) * stage.clientHeight}px, 0)`;
}
const clamp01 = (x) => Math.max(0, Math.min(1, x));
function updateCallouts(){
  calls.forEach((c) => {
    const pod = pods[c.pod || 'better'];
    let p, op = 0;
    if (c.layer === 'explode'){ op = clamp01((S.explode - .7) / .3); p = pod.anchors[c.key](); }
    else if (c.layer === 'util'){ op = clamp01((S.util - .55) / .35); p = pod.anchors.lineEnds()[c.i]; }
    else if (c.layer === 'lineup'){ op = clamp01((S.lineup - .75) / .25); p = pod.anchors.top(); }
    place(c.el, p, op);
  });
  // Cooking chapter: highlight the appliance in the slot
  const ci = Math.round(S.cook);
  $$('[data-cook]').forEach((el) => el.classList.toggle('on', +el.dataset.cook === ci));
}

/* ---------- Resize, framing for tall screens ---------- */
let aspect = 1;
function resize(){
  const w = stage.clientWidth, h = stage.clientHeight;
  aspect = w / h;
  renderer.setSize(w, h, false); composer.setSize(w, h);
  bloom.resolution.set(w, h);
  camera.aspect = aspect; camera.fov = aspect < 1 ? 46 : 34; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

/* ---------- Render loop ---------- */
const intro = { cam: [34, 22, 62], tgt: [0, 2, 0] };
const clock = new THREE.Clock();
let visible = true;
new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(stage);
function render(){
  requestAnimationFrame(render);
  if (!visible) return;
  const t = clock.getElapsedTime();
  // pods
  good.root.position.y = -9.5 * (1 - easeOut(S.lineup)); best.root.position.y = good.root.position.y;
  good.root.visible = best.root.visible = S.lineup > .001;
  const lineState = { ...S, explode: 0, util: 0, cook: 0 };
  better.update(S); good.update(lineState); best.update(lineState);
  applyColors();
  // light and sky
  sky.material.uniforms.night.value = S.night;
  sun.intensity = 2.4 * (1 - S.night * .82);
  M.flute.color.copy(M.exterior.color).multiplyScalar(.74); hemi.intensity = .55 * (1 - S.night * .6);
  sun.color.setHSL(.07, .9, .74 - S.night * .2);
  renderer.toneMappingExposure = .95 - S.night * .1;
  // camera: scroll position, eased intro, a slow idle drift so the scene breathes
  const k = easeInOut(S.intro);
  const fit = aspect < 1 ? 1 + (1 / aspect - 1) * .62 : 1;
  const tx = lerp(intro.tgt[0], S.tx, k), ty = lerp(intro.tgt[1], S.ty, k), tz = lerp(intro.tgt[2], S.tz, k);
  let cx = lerp(intro.cam[0], S.cx, k), cy = lerp(intro.cam[1], S.cy, k), cz = lerp(intro.cam[2], S.cz, k);
  cx = tx + (cx - tx) * fit; cy = ty + (cy - ty) * Math.min(fit, 1.25); cz = tz + (cz - tz) * fit;
  const drift = reduceMotion ? 0 : 1;
  camera.position.set(cx + Math.sin(t * .17) * .35 * drift, cy + Math.sin(t * .23) * .12 * drift, cz + Math.cos(t * .13) * .3 * drift);
  camera.lookAt(tx, ty, tz);
  const vw = stage.clientWidth, vh = stage.clientHeight;
  camera.setViewOffset(vw, vh, -S.ox * vw * k, S.oy * vh * k, vw, vh);
  updateCallouts();
  composer.render();
}
const lerp = (a, b, k) => a + (b - a) * k;
const easeInOut = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const easeOut = (x) => 1 - Math.pow(1 - clamp01(x), 3);
render();

/* ---------- Scroll timeline ---------- */
const gsap = window.gsap, ST = window.ScrollTrigger;
gsap.registerPlugin(ST);
const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
const chapters = $$('.chapter');
function show(i, at){ tl.fromTo(chapters[i], { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, at); }
function hide(i, at){ tl.to(chapters[i], { autoAlpha: 0, y: -18, duration: .35, ease: 'power1.in' }, at); }

tl.addLabel('closed', 0); hide(0, 1.1);
tl.addLabel('open', 1.4).to(S, { ...camOf('open'), roof: 1, lights: 1, duration: 1.6 }, 'open'); show(1, 'open+=1.2'); hide(1, 'open+=2.8');
tl.addLabel('explode', 4.4).to(S, { ...camOf('explode'), explode: 1, duration: 1.6 }, 'explode'); show(2, 'explode+=1.0'); hide(2, 'explode+=3.0');
tl.addLabel('cook', 7.6).to(S, { ...camOf('cook'), explode: 0, duration: 1.4 }, 'cook-=.2'); show(3, 'cook+=1.0');
tl.to(S, { cook: 1, duration: .6 }, 'cook+=1.8').to(S, { cook: 2, duration: .6 }, 'cook+=2.8').to(S, { cook: 3, duration: .6 }, 'cook+=3.8').to(S, { cook: 0, duration: .5 }, 'cook+=4.8');
hide(3, 'cook+=5.0');
tl.addLabel('util', 13).to(S, { ...camOf('util'), duration: 1.6 }, 'util'); tl.to(S, { util: 1, duration: 1.2 }, 'util+=1.2'); show(4, 'util+=1.3'); hide(4, 'util+=3.3'); tl.to(S, { util: 0, duration: .5 }, 'util+=3.4');
tl.addLabel('lineup', 17).to(S, { ...camOf('lineup'), lineup: 1, duration: 1.8 }, 'lineup'); show(5, 'lineup+=1.5'); hide(5, 'lineup+=3.6');
tl.addLabel('color', 21).to(S, { ...camOf('color'), lineup: 0, duration: 1.6 }, 'color'); show(6, 'color+=1.2');
tl.to(S, { faces: 1, duration: .7 }, 'color+=1.8').to(S, { ext: 0, duration: .7 }, 'color+=2.6').to(S, { faces: 0, ext: 1, duration: .7 }, 'color+=3.5'); hide(6, 'color+=4.4');
tl.addLabel('close', 25.6).to(S, { ...camOf('close'), roof: 0, night: 1, lights: .55, duration: 1.8 }, 'close'); show(7, 'close+=1.4');
tl.to({}, { duration: .8 });

const total = tl.duration();
ST.create({ trigger: '#journey', start: 'top top', end: 'bottom bottom', scrub: reduceMotion ? true : .9, animation: tl,
  onUpdate: (self) => updateRail(self.progress) });

/* ---------- Chapter rail: where you are, and a way to jump ---------- */
const marks = ['closed', 'open', 'explode', 'cook', 'util', 'lineup', 'color', 'close'].map((l) => tl.labels[l] / total);
const railItems = $$('#rail li');
function updateRail(p){
  let a = 0; marks.forEach((m, i) => { if (p >= m - .002) a = i; });
  railItems.forEach((li, i) => li.classList.toggle('on', i === a));
  $('#rail .fill').style.transform = `scaleY(${p})`;
  document.body.classList.toggle('past-hero', p > .04);
}
railItems.forEach((li, i) => li.addEventListener('click', () => {
  const st = ST.getAll().find((s) => s.trigger && s.trigger.id === 'journey');
  const target = st.start + (st.end - st.start) * (marks[i] + (i ? (i === 3 ? .025 : .045) : 0));
  window.scrollTo({ top: target, behavior: reduceMotion ? 'auto' : 'smooth' });
}));

/* ---------- Intro: the camera arrives from a distance, then hands over to scroll ---------- */
$('#loader')?.classList.add('done');
setTimeout(() => $('#loader')?.remove(), 900);
if (!reduceMotion) gsap.to(S, { intro: 1, duration: 3.2, ease: 'power3.inOut', delay: .2 });
gsap.fromTo('.chapter[data-ch="0"] > *', { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: .12, ease: 'power3.out', delay: reduceMotion ? 0 : 1.6 });
window.NOL_journey = { S, tl, renderer, scene, camera };
