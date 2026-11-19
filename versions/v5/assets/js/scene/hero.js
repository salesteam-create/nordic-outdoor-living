/* NOL hero: a sunny garden, the Better POD, and a short scroll journey (closed, opening, inside).
   The scroll timeline only moves numbers in S; render() turns S into the picture every frame. */
import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { buildPod, makeMaterials, SPECS, SHADES } from './pod.js';
import * as TX from './textures.js';

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const stage = $('#stage'), canvas = $('#scene');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 820px)').matches;

let renderer;
try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' }); }
catch (e){ document.documentElement.classList.add('no-webgl'); $('#loader')?.remove(); throw e; }
renderer.setPixelRatio(Math.min(devicePixelRatio, small ? 1.5 : 1.75));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = .62;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(32, 1, .5, 2000);

/* ---------- Sky and sun ---------- */
const sunDir = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 42), THREE.MathUtils.degToRad(-38));
const sky = new Sky(); sky.scale.setScalar(1500);
sky.material.uniforms.turbidity.value = 3.2;
sky.material.uniforms.rayleigh.value = 1.1;
sky.material.uniforms.mieCoefficient.value = .004;
sky.material.uniforms.mieDirectionalG.value = .8;
sky.material.uniforms.sunPosition.value.copy(sunDir);
scene.add(sky);

// Image-based light from the same sky, so steel and glass reflect a real daylight sky
const pmrem = new THREE.PMREMGenerator(renderer);
const envScene = new THREE.Scene();
const envSky = new Sky(); envSky.scale.setScalar(1000); envSky.material.uniforms.sunPosition.value.copy(sunDir);
envSky.material.uniforms.turbidity.value = 3.2; envSky.material.uniforms.rayleigh.value = 1.1;
envScene.add(envSky);
const envGround = new THREE.Mesh(new THREE.CircleGeometry(900, 32), new THREE.MeshBasicMaterial({ color: 0x5f6f45 }));
envGround.rotation.x = -Math.PI / 2; envGround.position.y = -2; envScene.add(envGround);
scene.environment = pmrem.fromScene(envScene, .02).texture;

scene.fog = new THREE.Fog(0xdfe6ee, 90, 420);

const sun = new THREE.DirectionalLight(0xfff1dd, 3.4);
sun.position.copy(sunDir).multiplyScalar(60);
sun.castShadow = true;
sun.shadow.mapSize.set(small ? 2048 : 4096, small ? 2048 : 4096);
Object.assign(sun.shadow.camera, { left: -30, right: 30, top: 26, bottom: -22, near: 10, far: 140 });
sun.shadow.bias = -.00025; sun.shadow.normalBias = .035;
scene.add(sun);
scene.add(new THREE.HemisphereLight(0xe4ebf2, 0x7a7a5c, .32));

/* ---------- Garden ---------- */
const box = (w, h, d, mat, r = .04) => { const m = new THREE.Mesh(r ? new RoundedBoxGeometry(w, h, d, 3, r) : new THREE.BoxGeometry(w, h, d), mat); m.castShadow = m.receiveShadow = true; return m; };
const at = (o, x, y, z) => { o.position.set(x, y, z); return o; };
const std = (o) => new THREE.MeshStandardMaterial(o);

// Lawn
const grassMap = TX.grass(); grassMap.repeat.set(70, 70);
const lawn = new THREE.Mesh(new THREE.CircleGeometry(500, 64), std({ map: grassMap, bumpMap: grassMap, bumpScale: .6, roughness: .95, envMapIntensity: .3 }));
lawn.rotation.x = -Math.PI / 2; lawn.receiveShadow = true; scene.add(lawn);

// Limestone terrace with a coping edge
const pave = TX.paving(); pave.repeat.set(40 / 8, 22 / 8);
const terraceMat = std({ map: pave, roughness: .78, envMapIntensity: .5 });
scene.add(at(box(40, .3, 22, terraceMat, 0), 0, .15, 2));
const coping = std({ color: 0xcfc7b9, roughness: .7 });
scene.add(at(box(40.4, .32, .4, coping, .03), 0, .16, 13.1));

// House to the left: white render, black-framed glazing, flat roof
const renderMat = std({ map: TX.render(), roughness: .9, envMapIntensity: .4 });
const frameMat = std({ color: 0x151617, roughness: .4, metalness: .6 });
const glazing = new THREE.MeshPhysicalMaterial({ color: 0x2a3640, roughness: .04, metalness: .1, envMapIntensity: 1.6 });
const house = new THREE.Group();
house.add(at(box(26, 13, 18, renderMat, .05), 0, 6.5, 0));
house.add(at(box(27.5, .7, 19.5, frameMat, .04), 0, 13.2, 0));
for (let i = 0; i < 3; i++){
  const pane = box(.2, 9, 5.2, glazing, 0); house.add(at(pane, 13.05, 4.8, -4.2 + i * 5.4));
  house.add(at(box(.3, 9.3, .3, frameMat, .02), 13.1, 4.8, -6.9 + i * 5.4));
}
house.add(at(box(.3, 9.3, .3, frameMat, .02), 13.1, 4.8, 9.3));
house.add(at(box(.3, .3, 16.4, frameMat, .02), 13.1, 9.4, 1.2));
house.position.set(-44, 0, -16); scene.add(house);

// Clipped hedge and Italian cypress behind the POD
const leafMap = TX.leaves(); leafMap.repeat.set(6, 1.5);
const hedgeMat = std({ map: leafMap, bumpMap: leafMap, bumpScale: 2.2, roughness: .95, envMapIntensity: .35 });
scene.add(at(box(46, 5.5, 2.6, hedgeMat, .6), 6, 2.75, -11.5));
const cypMap = TX.leaves('#24391c'); cypMap.repeat.set(2, 5);
const cypMat = std({ map: cypMap, bumpMap: cypMap, bumpScale: 2.5, roughness: .95, envMapIntensity: .3 });
[[-8, -15], [-3.5, -16], [11, -15.5], [16, -16.5], [24, -14]].forEach(([x, z], i) => {
  const c = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 22), cypMat); c.scale.set(1.5, 7.5 + (i % 3) * 1.2, 1.5);
  c.castShadow = true; scene.add(at(c, x, c.scale.y, z));
});

// Planters with boxwood, flanking the POD
const planterMat = std({ color: 0x2f3134, roughness: .55, metalness: .3 });
const boxMap = TX.leaves('#34502a'); boxMap.repeat.set(2, 2);
const boxwood = std({ map: boxMap, bumpMap: boxMap, bumpScale: 2, roughness: .95, envMapIntensity: .3 });
[-9.6, 9.6].forEach((x) => {
  scene.add(at(box(2.4, 2.2, 2.4, planterMat, .06), x, 1.4, 2.6));
  const b = new THREE.Mesh(new THREE.SphereGeometry(1.25, 32, 24), boxwood); b.castShadow = true; scene.add(at(b, x, 3.55, 2.6));
});

// Olive tree in a large planter, front left
const olive = new THREE.Group();
olive.add(at(box(4.2, 2.6, 4.2, planterMat, .08), 0, 1.6, 0));
const barkMat = std({ color: 0x6b5f50, roughness: .95 });
const trunkPath = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 2.8, 0), new THREE.Vector3(.4, 5, .2), new THREE.Vector3(-.3, 7.2, -.1), new THREE.Vector3(.2, 9, .3)]);
const trunk = new THREE.Mesh(new THREE.TubeGeometry(trunkPath, 30, .28, 10), barkMat); trunk.castShadow = true; olive.add(trunk);
const oliveMap = TX.leaves('#5d6b4f'); oliveMap.repeat.set(2, 2);
const oliveMat = std({ map: oliveMap, bumpMap: oliveMap, bumpScale: 2, roughness: .9, envMapIntensity: .35 });
[[0, 9.6, 0, 2.6], [1.8, 8.7, .6, 1.9], [-1.7, 8.9, -.4, 2], [.6, 10.8, -.5, 1.7], [-.8, 8, 1.4, 1.5], [1.2, 9.4, -1.6, 1.6]].forEach(([x, y, z, r]) => {
  const c = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 2), oliveMat); c.scale.y = .72; c.castShadow = true; olive.add(at(c, x, y, z));
});
olive.position.set(21, 0, -6.5); scene.add(olive);

// Dining set: oak table, black frame chairs with linen seats
const oak = std({ map: TX.wood(), roughness: .6 });
const metal = std({ color: 0x18191b, roughness: .45, metalness: .5 });
const linen = std({ color: 0xd9d2c4, roughness: .95 });
const dine = new THREE.Group();
dine.add(at(box(7, .18, 3.2, oak, .05), 0, 2.45, 0));
[[-3.1, -1.3], [3.1, -1.3], [-3.1, 1.3], [3.1, 1.3]].forEach(([x, z]) => dine.add(at(box(.14, 2.36, .14, metal, .02), x, 1.18, z)));
[[-1.8, -2.4, 0], [1.8, -2.4, 0], [-1.8, 2.4, Math.PI], [1.8, 2.4, Math.PI]].forEach(([x, z, ry]) => {
  const c = new THREE.Group();
  c.add(at(box(1.6, .22, 1.5, linen, .08), 0, 1.5, 0));
  c.add(at(box(1.6, 1.4, .1, metal, .02), 0, 2.35, -.75));
  [[-.72, -.68], [.72, -.68], [-.72, .68], [.72, .68]].forEach(([lx, lz]) => c.add(at(box(.08, 1.4, .08, metal, .02), lx, .7, lz)));
  c.rotation.y = ry; dine.add(at(c, x, 0, z));
});
dine.position.set(14.5, .3, 6.5); dine.rotation.y = -.25; scene.add(dine);

/* ---------- The POD ---------- */
const M = makeMaterials();
const pod = buildPod(SPECS.better, M);
pod.root.position.y = .3; scene.add(pod.root);

/* ---------- Post-processing: MSAA, ambient occlusion on desktop, tone mapping ---------- */
const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: 4 });
const composer = new EffectComposer(renderer, rt);
composer.addPass(new RenderPass(scene, camera));
let ao = null;
if (!small){
  ao = new GTAOPass(scene, camera, 1, 1);
  ao.updateGtaoMaterial({ radius: .9, distanceExponent: 1.4, thickness: 2, scale: 1, samples: 16 });
  ao.updatePdMaterial({ lumaPhi: 10, depthPhi: 2, normalPhi: 3, radius: 6, rings: 2, samples: 16 });
  ao.blendIntensity = .85;
  composer.addPass(ao);
}
composer.addPass(new OutputPass());

/* ---------- State the scroll timeline animates ---------- */
const S = { ox: 0, oy: 0, cx: 0, cy: 0, cz: 0, tx: 0, ty: 0, tz: 0, roof: 0, lights: 0, call: 0, intro: reduceMotion ? 1 : 0 };
const K = {
  closed: { cam: [21, 6.2, 37],   tgt: [-.6, 4.1, 0], f: [.2, .02] },
  open:   { cam: [15, 6.2, 34], tgt: [-.3, 5, 0], f: [.21, .01] },
  inside: { cam: [8.5, 5.4, 22], tgt: [.3, 4.1, 0], f: [.13, .03] }
};
// Portrait screens are narrow, so the camera pulls back further on the closer shots
const PULL = { closed: 1, open: 1.12, inside: 1.38 };
const camOf = (k) => {
  const c = K[k].cam, t = K[k].tgt, m = small ? PULL[k] : 1;
  return { cx: t[0] + (c[0] - t[0]) * m, cy: t[1] + (c[1] - t[1]) * m, cz: t[2] + (c[2] - t[2]) * m, tx: t[0], ty: t[1], tz: t[2], ox: small ? 0 : K[k].f[0], oy: small ? .17 : K[k].f[1] };
};
Object.assign(S, camOf('closed'));

/* ---------- Callouts pinned to the model ---------- */
const calls = $$('.co[data-anchor]').map((el) => ({ el, key: el.dataset.anchor }));
const v = new THREE.Vector3();
function updateCallouts(){
  const op = Math.max(0, Math.min(1, S.call));
  calls.forEach(({ el, key }) => {
    v.copy(pod.anchors[key]()).project(camera);
    const vis = op > .01 && v.z < 1;
    el.style.opacity = vis ? op : 0; el.style.visibility = vis ? 'visible' : 'hidden';
    if (!vis) return;
    const x = (v.x * .5 + .5) * stage.clientWidth, y = (-v.y * .5 + .5) * stage.clientHeight;
    el.classList.toggle('below', y < 170); el.classList.toggle('left', key === 'sink' || x > stage.clientWidth - 230);
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  });
}

/* ---------- Colour (shared with the swatches further down the page) ---------- */
window.NOL_setColor = (part, shade) => {
  const map = { faces: M.faces, exterior: M.exterior, interior: M.interior };
  if (map[part]) map[part].color.copy(SHADES[part][shade]);
};

/* ---------- Resize ---------- */
let aspect = 1;
function resize(){
  const w = stage.clientWidth, h = stage.clientHeight; aspect = w / h;
  renderer.setSize(w, h, false); composer.setSize(w, h); if (ao) ao.setSize(w, h);
  camera.aspect = aspect; camera.fov = aspect < 1 ? 44 : 32; camera.updateProjectionMatrix();
}
addEventListener('resize', resize); resize();

/* ---------- Render loop (paused when the hero is off screen) ---------- */
const intro = { cam: [30, 11, 46] };
const clock = new THREE.Clock();
let visible = true;
new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(stage);
const lerp = (a, b, k) => a + (b - a) * k;
const ease = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
function render(){
  requestAnimationFrame(render);
  if (!visible) return;
  const t = clock.getElapsedTime(), k = ease(S.intro);
  pod.update(S);
  const fit = aspect < 1 ? 1 + (1 / aspect - 1) * .6 : 1;
  let cx = lerp(intro.cam[0], S.cx, k), cy = lerp(intro.cam[1], S.cy, k), cz = lerp(intro.cam[2], S.cz, k);
  cx = S.tx + (cx - S.tx) * fit; cz = S.tz + (cz - S.tz) * fit; cy = S.ty + (cy - S.ty) * Math.min(fit, 1.2);
  const drift = reduceMotion ? 0 : 1;
  camera.position.set(cx + Math.sin(t * .15) * .3 * drift, cy + Math.sin(t * .21) * .1 * drift, cz + Math.cos(t * .12) * .25 * drift);
  camera.lookAt(S.tx, S.ty, S.tz);
  const vw = stage.clientWidth, vh = stage.clientHeight;
  camera.setViewOffset(vw, vh, -S.ox * vw, S.oy * vh, vw, vh);
  updateCallouts();
  composer.render();
}
render();

/* ---------- Scroll journey: three beats, then the page scrolls on normally ---------- */
const gsap = window.gsap, ST = window.ScrollTrigger;
gsap.registerPlugin(ST);
const beats = $$('.beat');
const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
tl.to(beats[0], { autoAlpha: 0, y: -16, duration: .4, ease: 'power1.in' }, .35)
  .addLabel('open', .5).to(S, { ...camOf('open'), roof: 1, lights: 1, duration: 1.6 }, 'open')
  .fromTo(beats[1], { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, 'open+=1.1')
  .to(beats[1], { autoAlpha: 0, y: -16, duration: .35, ease: 'power1.in' }, 'open+=2.4')
  .addLabel('inside', 3).to(S, { ...camOf('inside'), duration: 1.5 }, 'inside')
  .to(S, { call: 1, duration: .6 }, 'inside+=1.1')
  .fromTo(beats[2], { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: .45, ease: 'power2.out' }, 'inside+=1.1')
  .to({}, { duration: 1 });
ST.create({ trigger: '#hero', start: 'top top', end: 'bottom bottom', scrub: reduceMotion ? true : .9, animation: tl,
  onUpdate: (self) => { $('#heroProgress').style.transform = `scaleX(${self.progress})`; } });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ST.refresh());

/* ---------- Intro ---------- */
$('#loader')?.classList.add('done'); setTimeout(() => $('#loader')?.remove(), 900);
if (!reduceMotion) gsap.to(S, { intro: 1, duration: 3, ease: 'power3.inOut', delay: .15 });
gsap.fromTo('.beat[data-beat="0"] > *', { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1, stagger: .1, ease: 'power3.out', delay: reduceMotion ? 0 : 1.2 });
window.NOL_hero = { S, tl, scene, camera, renderer };
