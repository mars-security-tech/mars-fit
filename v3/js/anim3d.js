// Animaciones 3D procedurales avanzadas.
// Muñeco con musculatura aproximada (cilindros y biseles), equipamiento (barra, mancuernas, kettlebell),
// cámara con leve órbita, luces ambient + key roja MARS.
import * as THREE from "three";

const MARS_RED = 0xDA0704;
const MARS_DARK = 0x7D0604;
const SKIN = 0xd9c9b8;
const MUSCLE = 0xe6d5c1;
const SUIT = 0x1a1a1a;
const METAL = 0x444444;
const METAL_DARK = 0x222222;

export class ExerciseAnim {
  constructor(container, animKey) {
    this.container = container;
    this.animKey = animKey;
    this._disposed = false;
    this._t = 0;
    this.init();
    this.loop();
  }

  init() {
    const w = this.container.clientWidth || 400;
    const h = this.container.clientHeight || 250;

    // Detect light theme by checking computed background color
    const bodyBg = getComputedStyle(document.body).backgroundColor;
    const rgbMatch = bodyBg.match(/\d+/g);
    const isLightTheme = rgbMatch && parseInt(rgbMatch[0]) > 200;

    this.scene = new THREE.Scene();
    this.scene.background = null;

    this.camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 100);
    this.camera.position.set(2.8, 1.7, 4.4);
    this.camera.lookAt(0, 1.05, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(w, h, false);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // Luces - adapt key light for light theme
    const amb = new THREE.AmbientLight(0xffffff, isLightTheme ? 0.55 : 0.35);
    this.scene.add(amb);
    const key = new THREE.DirectionalLight(isLightTheme ? 0xfff5ee : MARS_RED, isLightTheme ? 1.2 : 1.4);
    key.position.set(3, 5, 2);
    key.castShadow = true;
    key.shadow.mapSize.set(512, 512);
    this.scene.add(key);
    const fill = new THREE.DirectionalLight(0xffffff, isLightTheme ? 0.9 : 0.7);
    fill.position.set(-3, 3, 3);
    this.scene.add(fill);
    const rim = new THREE.DirectionalLight(isLightTheme ? 0xffccbb : 0xff4422, isLightTheme ? 0.4 : 0.6);
    rim.position.set(0, 2, -4);
    this.scene.add(rim);

    // Suelo + rejilla - adapt for light theme
    const floorColor = isLightTheme ? 0xE8EAEE : 0x0a0a0a;
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(14, 14),
      new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.9 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const gridColor1 = isLightTheme ? 0xD1D5DB : MARS_DARK;
    const gridColor2 = isLightTheme ? 0xF0F2F5 : 0x1a1a1a;
    const grid = new THREE.GridHelper(10, 20, gridColor1, gridColor2);
    grid.position.y = 0.01;
    this.scene.add(grid);

    // Muñeco musculoso
    this.figure = buildFigure();
    this.scene.add(this.figure.root);

    // Equipamiento (se muestra/oculta por animación)
    this.gear = buildGear();
    this.scene.add(this.gear.root);

    // Resize
    this._resizeHandler = () => this.resize();
    window.addEventListener("resize", this._resizeHandler);

    // Observe container size for tab switches
    if ("ResizeObserver" in window) {
      this._ro = new ResizeObserver(() => this.resize());
      this._ro.observe(this.container);
    }
  }

  resize() {
    if (!this.renderer || !this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    if (w === 0 || h === 0) return;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h, false);
  }

  loop() {
    if (this._disposed) return;
    this._t += 0.016;
    applyAnimation(this.animKey, this.figure, this.gear, this._t);
    // cámara en leve órbita
    const orbit = Math.sin(this._t * 0.25) * 0.3;
    this.camera.position.x = 2.8 + orbit;
    this.camera.position.z = 4.4 - Math.abs(orbit) * 0.5;
    this.camera.lookAt(0, 1.05, 0);
    this.renderer.render(this.scene, this.camera);
    this._raf = requestAnimationFrame(() => this.loop());
  }

  dispose() {
    this._disposed = true;
    cancelAnimationFrame(this._raf);
    window.removeEventListener("resize", this._resizeHandler);
    this._ro?.disconnect();
    this.scene?.traverse(obj => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    });
    this.renderer?.dispose();
    if (this.renderer?.domElement?.parentNode)
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
  }
}

// ---------- Construcción del muñeco musculoso ----------
function buildFigure() {
  const root = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: MUSCLE, metalness: 0.1, roughness: 0.6 });
  const suitMat = new THREE.MeshStandardMaterial({ color: SUIT, metalness: 0.4, roughness: 0.4 });
  const accent  = new THREE.MeshStandardMaterial({ color: MARS_RED, metalness: 0.5, roughness: 0.25, emissive: 0x330000 });

  const muscle = (r, h, m = skinMat) => {
    const g = new THREE.CylinderGeometry(r, r * 0.85, h, 16);
    const mesh = new THREE.Mesh(g, m);
    mesh.castShadow = true;
    return mesh;
  };

  const sphere = (r, m = skinMat) => {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 18), m);
    mesh.castShadow = true;
    return mesh;
  };

  // Jerarquía
  const hips = new THREE.Group(); hips.position.y = 0.95; root.add(hips);

  // Pelvis (short en color traje)
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.18, 0.28), suitMat);
  pelvis.castShadow = true;
  pelvis.position.y = -0.03;
  hips.add(pelvis);
  // Cinturón rojo
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.04, 0.3), accent);
  belt.position.y = 0.07;
  pelvis.add(belt);

  // Torso
  const torso = new THREE.Group(); hips.add(torso);
  // Abdomen
  const abdomen = muscle(0.22, 0.26);
  abdomen.position.y = 0.22;
  torso.add(abdomen);
  // Pecho
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.34, 0.3), skinMat);
  chest.castShadow = true;
  chest.position.y = 0.5;
  torso.add(chest);
  // Pectorales (dos montículos)
  const pecL = sphere(0.14); pecL.position.set( 0.12, 0.5, 0.14); torso.add(pecL);
  const pecR = sphere(0.14); pecR.position.set(-0.12, 0.5, 0.14); torso.add(pecR);
  // Trapecio
  const trap = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.22, 8), skinMat);
  trap.position.set(0, 0.72, -0.02);
  trap.rotation.z = Math.PI;
  torso.add(trap);

  // Cuello + cabeza
  const neck = new THREE.Group(); neck.position.y = 0.78; torso.add(neck);
  const neckMesh = muscle(0.09, 0.12);
  neckMesh.position.y = 0.06;
  neck.add(neckMesh);
  const head = sphere(0.16);
  head.position.y = 0.22;
  neck.add(head);

  // Brazos musculosos
  const makeArm = (side) => {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.28, 0.64, 0);
    torso.add(shoulder);
    // Deltoides
    const delt = sphere(0.14);
    delt.position.y = 0;
    shoulder.add(delt);
    // Bíceps (cilindro + esfera arriba)
    const upper = muscle(0.095, 0.38);
    upper.position.y = -0.2;
    shoulder.add(upper);
    const biceps = sphere(0.11);
    biceps.position.set(side * 0.02, -0.12, 0.05);
    shoulder.add(biceps);

    const elbow = new THREE.Group();
    elbow.position.y = -0.4;
    shoulder.add(elbow);
    // Antebrazo
    const fore = muscle(0.085, 0.32);
    fore.position.y = -0.16;
    elbow.add(fore);
    // Mano (con guante rojo cuando operativo)
    const hand = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.13, 0.09), accent);
    hand.position.y = -0.38;
    hand.castShadow = true;
    elbow.add(hand);
    return { shoulder, elbow, hand };
  };
  const armL = makeArm(1);
  const armR = makeArm(-1);

  // Piernas musculosas
  const makeLeg = (side) => {
    const hip = new THREE.Group();
    hip.position.set(side * 0.12, -0.12, 0);
    hips.add(hip);
    // Cuádriceps
    const thigh = muscle(0.14, 0.46, skinMat);
    thigh.position.y = -0.23;
    hip.add(thigh);
    // Rodilla
    const kneeCap = sphere(0.1);
    kneeCap.position.y = -0.46;
    hip.add(kneeCap);

    const knee = new THREE.Group();
    knee.position.y = -0.46;
    hip.add(knee);
    // Gemelo
    const shin = muscle(0.11, 0.44);
    shin.position.y = -0.22;
    knee.add(shin);
    // Pie (bota táctica)
    const foot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.28), suitMat);
    foot.position.set(0, -0.46, 0.05);
    foot.castShadow = true;
    knee.add(foot);
    // Puntera roja
    const toe = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.06), accent);
    toe.position.set(0, -0.46, 0.18);
    knee.add(toe);
    return { hip, knee };
  };
  const legL = makeLeg(1);
  const legR = makeLeg(-1);

  return { root, hips, torso, neck, armL, armR, legL, legR };
}

// ---------- Equipamiento ----------
function buildGear() {
  const root = new THREE.Group();
  const metal = new THREE.MeshStandardMaterial({ color: METAL, metalness: 0.9, roughness: 0.3 });
  const dark  = new THREE.MeshStandardMaterial({ color: METAL_DARK, metalness: 0.8, roughness: 0.4 });
  const accent = new THREE.MeshStandardMaterial({ color: MARS_RED, metalness: 0.4, roughness: 0.3 });

  // Barra olímpica
  const barbell = new THREE.Group();
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2.0, 16), metal);
  bar.rotation.z = Math.PI / 2;
  barbell.add(bar);
  for (const x of [-0.88, 0.88]) {
    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.08, 24), dark);
    plate.rotation.z = Math.PI / 2;
    plate.position.x = x;
    barbell.add(plate);
    const plateB = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.08, 24), accent);
    plateB.rotation.z = Math.PI / 2;
    plateB.position.x = x * 1.08;
    barbell.add(plateB);
  }
  barbell.visible = false;
  root.add(barbell);

  // Mancuerna doble
  const dumbbellL = makeDumbbell(metal, dark);
  const dumbbellR = makeDumbbell(metal, dark);
  dumbbellL.visible = false; dumbbellR.visible = false;
  root.add(dumbbellL); root.add(dumbbellR);

  // Kettlebell
  const kb = new THREE.Group();
  const kbBall = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 18), dark);
  kb.add(kbBall);
  const kbHandle = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 10, 20, Math.PI), metal);
  kbHandle.position.y = 0.16;
  kbHandle.rotation.x = Math.PI / 2;
  kb.add(kbHandle);
  kb.visible = false;
  root.add(kb);

  // Banco plano
  const bench = new THREE.Group();
  const pad = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.35), accent);
  pad.position.y = 0.45;
  bench.add(pad);
  for (const x of [-0.4, 0.4]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.45, 0.2), dark);
    leg.position.set(x, 0.22, 0);
    bench.add(leg);
  }
  bench.visible = false;
  root.add(bench);

  return { root, barbell, dumbbellL, dumbbellR, kb, bench };
}

function makeDumbbell(metal, dark) {
  const g = new THREE.Group();
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 12), metal);
  handle.rotation.z = Math.PI / 2;
  g.add(handle);
  for (const x of [-0.12, 0.12]) {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 20), dark);
    w.rotation.z = Math.PI / 2;
    w.position.x = x;
    g.add(w);
  }
  return g;
}

// ---------- Animaciones ----------
function applyAnimation(key, f, g, t) {
  const s = Math.sin(t * 2);
  const s2 = Math.sin(t * 2 + Math.PI);
  const phase = (Math.sin(t * 1.5) + 1) / 2;
  // Reset
  f.armL.shoulder.rotation.set(0,0,0); f.armL.elbow.rotation.set(0,0,0);
  f.armR.shoulder.rotation.set(0,0,0); f.armR.elbow.rotation.set(0,0,0);
  f.legL.hip.rotation.set(0,0,0); f.legL.knee.rotation.set(0,0,0);
  f.legR.hip.rotation.set(0,0,0); f.legR.knee.rotation.set(0,0,0);
  f.torso.rotation.set(0,0,0);
  f.hips.position.y = 0.95;
  f.hips.rotation.set(0,0,0);
  f.neck.rotation.set(0,0,0);

  // Ocultar todo el gear por defecto
  g.barbell.visible = false;
  g.dumbbellL.visible = false;
  g.dumbbellR.visible = false;
  g.kb.visible = false;
  g.bench.visible = false;

  // Rotación sutil del personaje
  f.root.rotation.y = Math.sin(t * 0.3) * 0.15;

  switch (key) {
    case "push": { // press de banca
      g.bench.visible = true;
      g.bench.position.set(0, 0, 0);
      g.barbell.visible = true;
      const barY = 1.25 + phase * 0.35;
      g.barbell.position.set(0, barY, 0);
      // Tumbado boca arriba
      f.torso.rotation.x = -Math.PI/2.1;
      f.hips.position.y = 0.55;
      f.hips.rotation.x = -Math.PI/2.1;
      f.armL.shoulder.rotation.x = 0;
      f.armR.shoulder.rotation.x = 0;
      f.armL.shoulder.rotation.z = -Math.PI/2 + 0.2;
      f.armR.shoulder.rotation.z =  Math.PI/2 - 0.2;
      f.armL.elbow.rotation.x = (1 - phase) * 1.6;
      f.armR.elbow.rotation.x = (1 - phase) * 1.6;
      break;
    }
    case "pushup": {
      f.torso.rotation.x = -Math.PI/2.2;
      f.hips.position.y = 0.55 + (1-phase) * 0.1;
      f.hips.rotation.x = -Math.PI/2.2;
      f.armL.shoulder.rotation.x = Math.PI/2;
      f.armR.shoulder.rotation.x = Math.PI/2;
      f.armL.elbow.rotation.x = phase * 0.8;
      f.armR.elbow.rotation.x = phase * 0.8;
      f.legL.hip.rotation.x = Math.PI/2;
      f.legR.hip.rotation.x = Math.PI/2;
      break;
    }
    case "pull": { // dominadas
      g.barbell.visible = true;
      g.barbell.position.set(0, 2.4, 0);
      const lift = phase * 0.4;
      f.hips.position.y = 0.7 + lift;
      f.armL.shoulder.rotation.x = -Math.PI + 0.1;
      f.armR.shoulder.rotation.x = -Math.PI + 0.1;
      f.armL.shoulder.rotation.z = -0.3;
      f.armR.shoulder.rotation.z =  0.3;
      f.armL.elbow.rotation.x = -phase * 1.5;
      f.armR.elbow.rotation.x = -phase * 1.5;
      break;
    }
    case "row": {
      g.barbell.visible = true;
      const barY = 0.7 + phase * 0.3;
      g.barbell.position.set(0, barY, 0.35);
      f.torso.rotation.x = -0.7;
      f.hips.position.y = 0.85;
      f.armL.shoulder.rotation.x = -Math.PI/2 - 0.4;
      f.armR.shoulder.rotation.x = -Math.PI/2 - 0.4;
      f.armL.elbow.rotation.x = -phase * 1.2;
      f.armR.elbow.rotation.x = -phase * 1.2;
      break;
    }
    case "squat": {
      g.barbell.visible = true;
      const crouch = phase;
      g.barbell.position.set(0, 1.6 - crouch * 0.35, -0.05);
      f.hips.position.y = 0.95 - crouch * 0.4;
      f.legL.hip.rotation.x = -crouch * 1.1;
      f.legR.hip.rotation.x = -crouch * 1.1;
      f.legL.knee.rotation.x = crouch * 1.8;
      f.legR.knee.rotation.x = crouch * 1.8;
      f.torso.rotation.x = -crouch * 0.3;
      f.armL.shoulder.rotation.x = -Math.PI;
      f.armR.shoulder.rotation.x = -Math.PI;
      f.armL.shoulder.rotation.z = -0.3;
      f.armR.shoulder.rotation.z =  0.3;
      break;
    }
    case "lunge": {
      g.dumbbellL.visible = true;
      g.dumbbellR.visible = true;
      g.dumbbellL.position.set( 0.4, 0.55, 0);
      g.dumbbellR.position.set(-0.4, 0.55, 0);
      const swap = Math.sin(t * 0.8);
      f.legL.hip.rotation.x = -0.6 - swap * 0.3;
      f.legR.hip.rotation.x =  0.6 + swap * 0.3;
      f.legL.knee.rotation.x = 1.1;
      f.legR.knee.rotation.x = 0.4;
      f.hips.position.y = 0.85 - Math.abs(s) * 0.1;
      f.armL.shoulder.rotation.x = -0.1;
      f.armR.shoulder.rotation.x = -0.1;
      break;
    }
    case "hinge": { // peso muerto / hip thrust
      g.barbell.visible = true;
      g.barbell.position.set(0, 0.25 + (1-phase) * 0.3, 0.2);
      f.torso.rotation.x = -0.4 - (1-phase) * 0.5;
      f.hips.position.y = 0.9 - (1-phase) * 0.15;
      f.legL.hip.rotation.x = (1-phase) * 0.3;
      f.legR.hip.rotation.x = (1-phase) * 0.3;
      f.legL.knee.rotation.x = (1-phase) * 0.5;
      f.legR.knee.rotation.x = (1-phase) * 0.5;
      f.armL.shoulder.rotation.x = Math.PI/5;
      f.armR.shoulder.rotation.x = Math.PI/5;
      break;
    }
    case "push_up_vert": { // press militar
      g.barbell.visible = true;
      g.barbell.position.set(0, 1.8 + phase * 0.5, 0);
      f.armL.shoulder.rotation.x = Math.PI;
      f.armR.shoulder.rotation.x = Math.PI;
      f.armL.shoulder.rotation.z = -0.2;
      f.armR.shoulder.rotation.z =  0.2;
      f.armL.elbow.rotation.x = -phase * 1.4;
      f.armR.elbow.rotation.x = -phase * 1.4;
      break;
    }
    case "lateral": {
      g.dumbbellL.visible = true;
      g.dumbbellR.visible = true;
      const angle = Math.abs(s) * Math.PI/2;
      g.dumbbellL.position.set( Math.sin(angle) * 0.7, 0.95 + Math.cos(angle - Math.PI/2) * 0.5, 0);
      g.dumbbellR.position.set(-Math.sin(angle) * 0.7, 0.95 + Math.cos(angle - Math.PI/2) * 0.5, 0);
      f.armL.shoulder.rotation.z = -angle;
      f.armR.shoulder.rotation.z =  angle;
      break;
    }
    case "curl": {
      g.dumbbellL.visible = true;
      g.dumbbellR.visible = true;
      g.dumbbellL.position.set( 0.3, 0.55 + phase * 0.4, 0.1);
      g.dumbbellR.position.set(-0.3, 0.55 + phase * 0.4, 0.1);
      f.armL.shoulder.rotation.x = -0.05;
      f.armR.shoulder.rotation.x = -0.05;
      f.armL.elbow.rotation.x = -phase * 1.7;
      f.armR.elbow.rotation.x = -phase * 1.7;
      break;
    }
    case "dip": {
      g.bench.visible = true;
      g.bench.position.set(0, 0, -0.2);
      f.armL.shoulder.rotation.x = 0.3;
      f.armR.shoulder.rotation.x = 0.3;
      f.armL.elbow.rotation.x = phase * 1.4;
      f.armR.elbow.rotation.x = phase * 1.4;
      f.hips.position.y = 0.9 - phase * 0.2;
      break;
    }
    case "plank": {
      f.torso.rotation.x = -Math.PI/2.2;
      f.hips.position.y = 0.55;
      f.hips.rotation.x = -Math.PI/2.2;
      f.armL.shoulder.rotation.x = Math.PI/2;
      f.armR.shoulder.rotation.x = Math.PI/2;
      f.armL.elbow.rotation.x = Math.PI/2;
      f.armR.elbow.rotation.x = Math.PI/2;
      f.legL.hip.rotation.x = Math.PI/2;
      f.legR.hip.rotation.x = Math.PI/2;
      // respiración sutil
      f.hips.position.y = 0.55 + Math.sin(t * 1.2) * 0.01;
      break;
    }
    case "crunch": {
      f.torso.rotation.x = -phase * 0.8 - 0.2;
      f.legL.hip.rotation.x = 1.3;
      f.legR.hip.rotation.x = 1.3;
      f.legL.knee.rotation.x = 1.3;
      f.legR.knee.rotation.x = 1.3;
      f.hips.position.y = 0.55;
      f.armL.shoulder.rotation.z = -Math.PI;
      f.armR.shoulder.rotation.z =  Math.PI;
      break;
    }
    case "burpee": {
      const p = phase;
      f.hips.position.y = 0.4 + p * 0.6;
      f.torso.rotation.x = -p * 0.9;
      f.hips.rotation.x = -p * 0.4;
      f.armL.shoulder.rotation.x = p * Math.PI/2;
      f.armR.shoulder.rotation.x = p * Math.PI/2;
      f.legL.hip.rotation.x = p * 0.8;
      f.legR.hip.rotation.x = p * 0.8;
      f.legL.knee.rotation.x = p * 0.8;
      f.legR.knee.rotation.x = p * 0.8;
      break;
    }
    case "swing": {
      g.kb.visible = true;
      const angle = Math.sin(t * 2);
      g.kb.position.set(angle * 0.8, 0.7 + Math.abs(angle) * 0.5, 0);
      f.torso.rotation.x = -0.3 + angle * 0.35;
      f.armL.shoulder.rotation.x = -Math.PI/2 + angle * 1.3;
      f.armR.shoulder.rotation.x = -Math.PI/2 + angle * 1.3;
      break;
    }
    case "walk": {
      g.dumbbellL.visible = true;
      g.dumbbellR.visible = true;
      g.dumbbellL.position.set( 0.38, 0.55 + Math.abs(s) * 0.02, 0);
      g.dumbbellR.position.set(-0.38, 0.55 + Math.abs(s2) * 0.02, 0);
      f.legL.hip.rotation.x = s * 0.5;
      f.legR.hip.rotation.x = s2 * 0.5;
      f.legL.knee.rotation.x = Math.max(0, s2) * 0.8;
      f.legR.knee.rotation.x = Math.max(0, s) * 0.8;
      f.armL.shoulder.rotation.x = -0.05;
      f.armR.shoulder.rotation.x = -0.05;
      f.hips.position.y = 0.95 + Math.abs(s) * 0.03;
      break;
    }
    case "run": {
      f.legL.hip.rotation.x = s * 0.9;
      f.legR.hip.rotation.x = s2 * 0.9;
      f.legL.knee.rotation.x = Math.max(0, s2) * 1.5;
      f.legR.knee.rotation.x = Math.max(0, s) * 1.5;
      f.armL.shoulder.rotation.x = s2 * 0.9;
      f.armR.shoulder.rotation.x = s * 0.9;
      f.armL.elbow.rotation.x = 1.3;
      f.armR.elbow.rotation.x = 1.3;
      f.hips.position.y = 0.95 + Math.abs(s) * 0.06;
      f.torso.rotation.x = -0.15;
      break;
    }
    default:
      f.armL.shoulder.rotation.x = s * 0.3;
      f.armR.shoulder.rotation.x = -s * 0.3;
  }
}
