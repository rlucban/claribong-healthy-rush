import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

// Cache for canvas textures to avoid recreating them
const textureCache = {};

// Helper to generate dynamic canvas textures for the fruit-themed tracks
function getFruitTrackTexture(type) {
  if (textureCache[type]) return textureCache[type];

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (type === 'watermelon' || true) {
    // Pink watermelon pulp background matching the reference image (#ff6595)
    ctx.fillStyle = '#ff6595'; 
    ctx.fillRect(0, 0, 512, 512);

    // Mint green rinds on the outer edges
    ctx.fillStyle = '#52c79f';
    ctx.fillRect(0, 0, 35, 512);
    ctx.fillRect(477, 0, 35, 512);

    // White inner rind borders
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(35, 0, 15, 512);
    ctx.fillRect(462, 0, 15, 512);

    // Scattered dark grey/black teardrop watermelon seeds
    ctx.fillStyle = '#4a4a4a';
    for (let i = 0; i < 28; i++) {
      const x = 70 + Math.random() * 372;
      const y = Math.random() * 512;
      ctx.beginPath();
      ctx.ellipse(x, y, 7, 14, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 1);
  textureCache[type] = texture;
  return texture;
}

// ----------------------------------------------------
// PROCEDURAL 3D FRUIT MODELS
// ----------------------------------------------------

export function createStrawberry() {
  const strawberry = new THREE.Group();

  // 1. Red berry body
  const bodyGeo = new THREE.ConeGeometry(0.35, 0.7, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff1744,
    roughness: 0.15,
    metalness: 0.1,
    emissive: 0xff1744,
    emissiveIntensity: 0.15,
    flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.x = Math.PI; // point downwards
  body.position.y = 0.05;
  strawberry.add(body);

  // 2. Green leafy stem
  const stemGroup = new THREE.Group();
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x00e676,
    roughness: 0.5,
    flatShading: true
  });

  const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.2, 4);
  const stemCap = new THREE.Mesh(stemGeo, stemMat);
  stemCap.position.y = 0.45;
  stemGroup.add(stemCap);

  // Leaves spreading out
  for (let i = 0; i < 5; i++) {
    const leafGeo = new THREE.ConeGeometry(0.12, 0.25, 4);
    const leaf = new THREE.Mesh(leafGeo, stemMat);
    leaf.rotation.x = Math.PI / 2.5;
    leaf.rotation.y = (i * Math.PI * 2) / 5;
    leaf.position.set(
      Math.sin((i * Math.PI * 2) / 5) * 0.1,
      0.38,
      Math.cos((i * Math.PI * 2) / 5) * 0.1
    );
    stemGroup.add(leaf);
  }
  strawberry.add(stemGroup);

  // 3. Gold seeds
  const seedGeo = new THREE.SphereGeometry(0.025, 4, 4);
  const seedMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
  const seedOffsets = [
    [0.15, 0.1, 0.1], [-0.15, 0.1, -0.1],
    [0.0, -0.1, 0.2], [0.0, -0.1, -0.2],
    [0.18, -0.05, -0.1], [-0.18, -0.05, 0.1],
    [0.08, 0.2, 0.15], [-0.08, 0.2, -0.15]
  ];
  seedOffsets.forEach(pos => {
    const seed = new THREE.Mesh(seedGeo, seedMat);
    seed.position.set(pos[0], pos[1], pos[2]);
    strawberry.add(seed);
  });

  strawberry.name = 'strawberry';
  return strawberry;
}

export function createOrange() {
  const orange = new THREE.Group();

  // 1. Orange main body sphere
  const bodyGeo = new THREE.SphereGeometry(0.38, 8, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff9100,
    roughness: 0.3,
    metalness: 0.1,
    emissive: 0xff9100,
    emissiveIntensity: 0.1,
    flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  orange.add(body);

  // 2. Stem
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x6b6b6b, roughness: 0.8 });
  const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.15, 4);
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.y = 0.42;
  stem.rotation.z = -Math.PI / 8;
  orange.add(stem);

  // 3. Leaf
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x00e676, roughness: 0.5, flatShading: true });
  const leafGeo = new THREE.BoxGeometry(0.18, 0.02, 0.08);
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.position.set(0.08, 0.45, 0);
  leaf.rotation.z = Math.PI / 12;
  leaf.rotation.y = Math.PI / 4;
  orange.add(leaf);

  orange.name = 'orange';
  return orange;
}

export function createBanana() {
  const banana = new THREE.Group();

  // Curved tube path for banana
  const curve = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(-0.35, 0.15, 0),
    new THREE.Vector3(0, -0.22, 0),
    new THREE.Vector3(0.35, 0.15, 0)
  );
  
  const bodyGeo = new THREE.TubeGeometry(curve, 8, 0.12, 5, false);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xffea00,
    roughness: 0.2,
    metalness: 0.05,
    emissive: 0xffea00,
    emissiveIntensity: 0.1,
    flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  banana.add(body);

  // Brown tips
  const tipMat = new THREE.MeshStandardMaterial({ color: 0x5c3d2e, roughness: 0.8 });
  const tipGeo = new THREE.SphereGeometry(0.08, 4, 4);
  
  const startTip = new THREE.Mesh(tipGeo, tipMat);
  startTip.position.set(-0.35, 0.16, 0);
  banana.add(startTip);
  
  const endTip = new THREE.Mesh(tipGeo, tipMat);
  endTip.position.set(0.35, 0.16, 0);
  banana.add(endTip);

  banana.name = 'banana';
  return banana;
}

export function createKiwi() {
  const kiwi = new THREE.Group();

  // 1. Brown outer peel
  const outerGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.12, 10);
  const outerMat = new THREE.MeshStandardMaterial({
    color: 0x8d6e50,
    roughness: 0.8,
    flatShading: true
  });
  const outer = new THREE.Mesh(outerGeo, outerMat);
  outer.rotation.x = Math.PI / 2; // face forward
  kiwi.add(outer);

  // 2. Green flesh overlay
  const fleshGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.13, 10);
  const fleshMat = new THREE.MeshStandardMaterial({
    color: 0x00e676,
    roughness: 0.3,
    emissive: 0x00e676,
    emissiveIntensity: 0.1,
    flatShading: true
  });
  const flesh = new THREE.Mesh(fleshGeo, fleshMat);
  flesh.rotation.x = Math.PI / 2;
  kiwi.add(flesh);

  // 3. White center pulp
  const centerGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.14, 8);
  const centerMat = new THREE.MeshStandardMaterial({
    color: 0xf2f2f7,
    roughness: 0.4
  });
  const center = new THREE.Mesh(centerGeo, centerMat);
  center.rotation.x = Math.PI / 2;
  kiwi.add(center);

  // 4. Black seed rings
  const seedMat = new THREE.MeshBasicMaterial({ color: 0x1c1c1e });
  const seedGeo = new THREE.SphereGeometry(0.015, 3, 3);
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const seed = new THREE.Mesh(seedGeo, seedMat);
    seed.position.set(
      Math.sin(angle) * 0.2,
      Math.cos(angle) * 0.2,
      0.075
    );
    kiwi.add(seed);
    
    // Backside seeds too
    const seedBack = seed.clone();
    seedBack.position.z = -0.075;
    kiwi.add(seedBack);
  }

  kiwi.name = 'kiwi';
  return kiwi;
}

export function createBlueberry() {
  const blueberry = new THREE.Group();

  // 1. Berry body
  const bodyGeo = new THREE.SphereGeometry(0.34, 8, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x2979ff,
    roughness: 0.2,
    metalness: 0.1,
    emissive: 0x2979ff,
    emissiveIntensity: 0.1,
    flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  blueberry.add(body);

  // 2. Crown (top crest)
  const crownGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.06, 6, 1, true);
  const crownMat = new THREE.MeshStandardMaterial({
    color: 0x1a3b6b,
    roughness: 0.5,
    flatShading: true
  });
  const crown = new THREE.Mesh(crownGeo, crownMat);
  crown.position.y = 0.32;
  crown.rotation.x = Math.PI; // point down
  blueberry.add(crown);

  blueberry.name = 'blueberry';
  return blueberry;
}

// ----------------------------------------------------
// PROCEDURAL 3D JUNK FOOD MODELS
// ----------------------------------------------------

export function createBurger() {
  const burger = new THREE.Group();

  // Bun bottom
  const bunBottomGeo = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 8);
  const bunMat = new THREE.MeshStandardMaterial({ color: 0xb87333, roughness: 0.7, flatShading: true });
  const bunBottom = new THREE.Mesh(bunBottomGeo, bunMat);
  bunBottom.position.y = -0.16;
  burger.add(bunBottom);

  // Patty (meat)
  const pattyGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.12, 8);
  const pattyMat = new THREE.MeshStandardMaterial({ color: 0x3d1c02, roughness: 0.9, flatShading: true });
  const patty = new THREE.Mesh(pattyGeo, pattyMat);
  patty.position.y = -0.06;
  burger.add(patty);

  // Cheese slice (rotated yellow box)
  const cheeseGeo = new THREE.BoxGeometry(0.72, 0.015, 0.72);
  const cheeseMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, roughness: 0.5 });
  const cheese = new THREE.Mesh(cheeseGeo, cheeseMat);
  cheese.position.y = 0.01;
  cheese.rotation.y = Math.PI / 4; // rotate to make points hang out
  burger.add(cheese);

  // Lettuce
  const lettuceGeo = new THREE.CylinderGeometry(0.45, 0.45, 0.04, 8);
  const lettuceMat = new THREE.MeshStandardMaterial({ color: 0x388e3c, roughness: 0.7, flatShading: true });
  const lettuce = new THREE.Mesh(lettuceGeo, lettuceMat);
  lettuce.position.y = 0.04;
  burger.add(lettuce);

  // Bun top (hemisphere)
  const bunTopGeo = new THREE.SphereGeometry(0.42, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  const bunTop = new THREE.Mesh(bunTopGeo, bunMat);
  bunTop.position.y = 0.06;
  burger.add(bunTop);

  // Sesame seeds
  const seedGeo = new THREE.BoxGeometry(0.02, 0.01, 0.05);
  const seedMat = new THREE.MeshBasicMaterial({ color: 0xfff8e7 });
  const seedPositions = [
    [0.15, 0.44, 0.1], [-0.1, 0.46, -0.15],
    [0.05, 0.47, -0.02], [-0.15, 0.44, 0.1],
    [0.0, 0.46, 0.18], [0.18, 0.42, -0.12]
  ];
  seedPositions.forEach(pos => {
    const seed = new THREE.Mesh(seedGeo, seedMat);
    seed.position.set(pos[0], pos[1], pos[2]);
    seed.rotation.set(Math.random(), Math.random(), Math.random());
    burger.add(seed);
  });

  burger.name = 'burger';
  return burger;
}

export function createSoda() {
  const soda = new THREE.Group();

  // Can Body
  const canGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.7, 8);
  const canMat = new THREE.MeshStandardMaterial({
    color: 0xdc143c,
    roughness: 0.15,
    emissive: 0xdc143c,
    emissiveIntensity: 0.08,
    metalness: 0.7
  });
  const can = new THREE.Mesh(canGeo, canMat);
  soda.add(can);

  // Slanted white brand stripe
  const stripeGeo = new THREE.CylinderGeometry(0.245, 0.245, 0.16, 8);
  const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
  const stripe = new THREE.Mesh(stripeGeo, stripeMat);
  stripe.position.y = -0.02;
  stripe.rotation.z = Math.PI / 12; // tilt it
  soda.add(stripe);

  // Silver metal top & bottom rims
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xd1d1d6, metalness: 0.9, roughness: 0.1 });
  const rimGeo = new THREE.CylinderGeometry(0.242, 0.242, 0.04, 8);
  
  const rimTop = new THREE.Mesh(rimGeo, rimMat);
  rimTop.position.y = 0.35;
  soda.add(rimTop);

  const rimBottom = new THREE.Mesh(rimGeo, rimMat);
  rimBottom.position.y = -0.35;
  soda.add(rimBottom);

  // Pull tab
  const tabGeo = new THREE.BoxGeometry(0.06, 0.015, 0.12);
  const tab = new THREE.Mesh(tabGeo, rimMat);
  tab.position.set(0, 0.37, 0.06);
  tab.rotation.x = Math.PI / 20;
  soda.add(tab);

  soda.name = 'soda';
  return soda;
}

export function createDonut() {
  const donut = new THREE.Group();

  // Dough Ring
  const doughGeo = new THREE.TorusGeometry(0.24, 0.12, 6, 12);
  const doughMat = new THREE.MeshStandardMaterial({
    color: 0xb87333,
    roughness: 0.7,
    flatShading: true
  });
  const dough = new THREE.Mesh(doughGeo, doughMat);
  dough.rotation.x = Math.PI / 2; // flat
  donut.add(dough);

  // Pink Frosting Layer (slightly offset upwards)
  const frostingGeo = new THREE.TorusGeometry(0.25, 0.08, 6, 12);
  const frostingMat = new THREE.MeshStandardMaterial({
    color: 0xe91e63,
    roughness: 0.1,
    metalness: 0.0,
    emissive: 0xe91e63,
    emissiveIntensity: 0.05,
    flatShading: true
  });
  const frosting = new THREE.Mesh(frostingGeo, frostingMat);
  frosting.rotation.x = Math.PI / 2;
  frosting.position.y = 0.055;
  frosting.scale.set(1.02, 1.02, 1);
  donut.add(frosting);

  // Tiny colorful sprinkles
  const sprinkleColours = [0xffea00, 0x2979ff, 0x00e676, 0xffffff, 0xce3a8a];
  const sprinkleGeo = new THREE.BoxGeometry(0.02, 0.02, 0.06);

  for (let i = 0; i < 10; i++) {
    const angle = (i * Math.PI * 2) / 10 + Math.random() * 0.2;
    const dist = 0.22 + Math.random() * 0.06;
    const sprinkleMat = new THREE.MeshBasicMaterial({
      color: sprinkleColours[Math.floor(Math.random() * sprinkleColours.length)]
    });
    const sprinkle = new THREE.Mesh(sprinkleGeo, sprinkleMat);
    
    sprinkle.position.set(
      Math.sin(angle) * dist,
      0.13, // sit on top of frosting
      Math.cos(angle) * dist
    );
    sprinkle.rotation.set(Math.PI / 2, angle + Math.PI / 2, Math.random());
    donut.add(sprinkle);
  }

  donut.name = 'donut';
  return donut;
}

export function createFries() {
  const friesGroup = new THREE.Group();

  // Red box container
  const boxGeo = new THREE.BoxGeometry(0.4, 0.42, 0.28);
  const boxMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.4, flatShading: true });
  const box = new THREE.Mesh(boxGeo, boxMat);
  box.position.y = -0.05;
  friesGroup.add(box);

  // Fry sticks - dull yellow, processed look
  const fryMat = new THREE.MeshStandardMaterial({ color: 0xd4a017, roughness: 0.7, flatShading: true });
  const fryGeo = new THREE.BoxGeometry(0.05, 0.48, 0.05);

  const positions = [
    [-0.12, 0.15, 0.04, -0.15],
    [0.12, 0.14, 0.02, 0.18],
    [0.0, 0.18, 0.05, 0.05],
    [-0.05, 0.17, -0.05, -0.05],
    [0.06, 0.16, -0.04, 0.12],
    [-0.14, 0.10, -0.06, -0.22],
    [0.13, 0.11, -0.05, 0.24],
    [-0.03, 0.21, 0.02, -0.08],
    [0.05, 0.20, 0.06, 0.09],
    [-0.08, 0.12, 0.04, -0.02]
  ];

  positions.forEach(pos => {
    const fry = new THREE.Mesh(fryGeo, fryMat);
    fry.position.set(pos[0], pos[1], pos[2]);
    fry.rotation.z = pos[3]; // skew angles
    fry.rotation.y = Math.random() * 0.4;
    friesGroup.add(fry);
  });

  friesGroup.name = 'fries';
  return friesGroup;
}

// ----------------------------------------------------
// LOCAL HEALTHY FRUIT & VEGGIE MODELS
// ----------------------------------------------------

export function createWatermelon() {
  const melon = new THREE.Group();

  // Green outer rind (dome pointing down, flat cut face up)
  const rindMat = new THREE.MeshStandardMaterial({
    color: 0x2e7d32, roughness: 0.6, flatShading: true
  });
  const rind = new THREE.Mesh(new THREE.SphereGeometry(0.4, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), rindMat);
  rind.rotation.x = Math.PI;
  melon.add(rind);

  // White inner rind
  const whiteMat = new THREE.MeshStandardMaterial({
    color: 0xf0f8ea, roughness: 0.5, flatShading: true
  });
  const white = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), whiteMat);
  white.rotation.x = Math.PI;
  melon.add(white);

  // Pink pulp
  const pulpMat = new THREE.MeshStandardMaterial({
    color: 0xff6595, roughness: 0.2, emissive: 0xff6595, emissiveIntensity: 0.08, flatShading: true
  });
  const pulp = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2), pulpMat);
  pulp.rotation.x = Math.PI;
  melon.add(pulp);

  // Dark teardrop seeds scattered on the cut face
  const seedMat = new THREE.MeshBasicMaterial({ color: 0x3a3a3a });
  const seedGeo = new THREE.SphereGeometry(0.025, 4, 4);
  const seedPositions = [
    [0.12, 0.03, 0.08], [-0.12, 0.03, -0.08],
    [0.0, 0.03, 0.2], [0.0, 0.03, -0.2],
    [0.18, 0.03, -0.05], [-0.18, 0.03, 0.05],
    [0.05, 0.03, -0.16], [-0.05, 0.03, 0.16]
  ];
  seedPositions.forEach(pos => {
    const seed = new THREE.Mesh(seedGeo, seedMat);
    seed.scale.set(1, 0.6, 1);
    seed.position.set(pos[0], pos[1], pos[2]);
    melon.add(seed);
  });

  melon.name = 'watermelon';
  return melon;
}

export function createPapaya() {
  const papaya = new THREE.Group();

  // Elongated oval body
  const bodyGeo = new THREE.SphereGeometry(0.3, 8, 6);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff9847, roughness: 0.45, emissive: 0xff9847, emissiveIntensity: 0.06, flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.scale.set(1, 1.35, 1);
  body.position.y = -0.02;
  papaya.add(body);

  // Little stem on top
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, roughness: 0.6, flatShading: true });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.05, 0.1, 5), stemMat);
  stem.position.y = 0.4;
  papaya.add(stem);

  // Cluster of black seeds peeking out
  const seedMat = new THREE.MeshBasicMaterial({ color: 0x1c1c1e });
  const seedGeo = new THREE.SphereGeometry(0.03, 4, 4);
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const seed = new THREE.Mesh(seedGeo, seedMat);
    seed.position.set(Math.sin(angle) * 0.1, 0.33, Math.cos(angle) * 0.1);
    papaya.add(seed);
  }

  papaya.name = 'papaya';
  return papaya;
}

export function createCalamansi() {
  const calamansi = new THREE.Group();

  // Small green citrus body
  const bodyGeo = new THREE.SphereGeometry(0.22, 8, 6);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x8bc34a, roughness: 0.35, emissive: 0x8bc34a, emissiveIntensity: 0.06, flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.scale.y = 0.95;
  calamansi.add(body);

  // Tiny stem + leaf
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x558b2f, roughness: 0.6, flatShading: true });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 4), stemMat);
  stem.position.y = 0.23;
  calamansi.add(stem);

  const leafGeo = new THREE.BoxGeometry(0.14, 0.015, 0.06);
  const leaf = new THREE.Mesh(leafGeo, stemMat);
  leaf.position.set(0.05, 0.26, 0);
  leaf.rotation.z = -0.4;
  calamansi.add(leaf);

  calamansi.name = 'calamansi';
  return calamansi;
}

export function createCarrot() {
  const carrot = new THREE.Group();

  // Orange tapered body (pointing down)
  const bodyGeo = new THREE.ConeGeometry(0.16, 0.55, 6);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xff7f27, roughness: 0.4, emissive: 0xff7f27, emissiveIntensity: 0.08, flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.rotation.x = Math.PI;
  body.position.y = 0.02;
  carrot.add(body);

  // Green leafy top
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x2e9e44, roughness: 0.5, flatShading: true });
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    const leafGeo = new THREE.ConeGeometry(0.05, 0.24, 4);
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.rotation.x = Math.PI / 4.5;
    leaf.rotation.y = angle;
    leaf.position.set(
      Math.sin(angle) * 0.05,
      0.32,
      Math.cos(angle) * 0.05
    );
    carrot.add(leaf);
  }

  carrot.name = 'carrot';
  return carrot;
}

export function createBroccoli() {
  const broccoli = new THREE.Group();

  // Pale green stalk
  const stalkMat = new THREE.MeshStandardMaterial({ color: 0x9ccb6b, roughness: 0.5, flatShading: true });
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, 0.32, 6), stalkMat);
  stalk.position.y = -0.08;
  broccoli.add(stalk);

  // Main dark green floret dome
  const floretMat = new THREE.MeshStandardMaterial({
    color: 0x2e9e44, roughness: 0.45, emissive: 0x2e9e44, emissiveIntensity: 0.05, flatShading: true
  });
  const dome = new THREE.Mesh(new THREE.SphereGeometry(0.28, 6, 4), floretMat);
  dome.position.y = 0.16;
  dome.scale.y = 0.8;
  broccoli.add(dome);

  // Smaller floret bumps
  const bumpMat = new THREE.MeshStandardMaterial({ color: 0x237a35, roughness: 0.5, flatShading: true });
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI * 2) / 6;
    const bump = new THREE.Mesh(new THREE.SphereGeometry(0.1, 5, 4), bumpMat);
    bump.position.set(Math.sin(angle) * 0.16, 0.3, Math.cos(angle) * 0.16);
    broccoli.add(bump);
  }

  broccoli.name = 'broccoli';
  return broccoli;
}

export function createSquash() {
  const squash = new THREE.Group();

  // Round kalabasa body
  const bodyGeo = new THREE.SphereGeometry(0.3, 8, 6);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xe67e22, roughness: 0.45, emissive: 0xe67e22, emissiveIntensity: 0.06, flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.scale.set(1.25, 0.9, 1.25);
  squash.add(body);

  // Dark green stem
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x33691e, roughness: 0.6, flatShading: true });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 0.14, 5), stemMat);
  stem.position.y = 0.28;
  stem.rotation.z = 0.3;
  squash.add(stem);

  squash.name = 'squash';
  return squash;
}

export function createEggplant() {
  const eggplant = new THREE.Group();

  // Long purple teardrop body
  const bodyGeo = new THREE.SphereGeometry(0.2, 8, 6);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x6c2c91, roughness: 0.3, emissive: 0x6c2c91, emissiveIntensity: 0.06, flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.scale.set(1, 2.3, 1);
  eggplant.add(body);

  // Green calyx leaves on top
  const calyxMat = new THREE.MeshStandardMaterial({ color: 0x2e9e44, roughness: 0.5, flatShading: true });
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI * 2) / 4;
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.12, 4), calyxMat);
    leaf.rotation.x = Math.PI / 2.8;
    leaf.rotation.y = angle;
    leaf.position.set(Math.sin(angle) * 0.05, 0.46, Math.cos(angle) * 0.05);
    eggplant.add(leaf);
  }

  // Tiny stem
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x33691e, roughness: 0.6 });
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.1, 4), stemMat);
  stem.position.y = 0.53;
  eggplant.add(stem);

  eggplant.name = 'eggplant';
  return eggplant;
}

export function createWater() {
  const bottle = new THREE.Group();

  // Translucent blue bottle body
  const bodyGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.6, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x42a5f5, roughness: 0.15, metalness: 0.1,
    transparent: true, opacity: 0.55,
    emissive: 0x42a5f5, emissiveIntensity: 0.08,
    flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  bottle.add(body);

  // Blue label band
  const labelMat = new THREE.MeshStandardMaterial({
    color: 0x1e88e5, roughness: 0.3, flatShading: true
  });
  const label = new THREE.Mesh(new THREE.CylinderGeometry(0.165, 0.185, 0.16, 8), labelMat);
  label.position.y = 0.05;
  bottle.add(label);

  // White cap
  const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.09, 8), capMat);
  cap.position.y = 0.34;
  bottle.add(cap);

  bottle.name = 'water';
  return bottle;
}

// ----------------------------------------------------
// EXTRA LOCAL JUNK FOOD MODELS
// ----------------------------------------------------

export function createHotdog() {
  const hotdog = new THREE.Group();

  // Bun bottom
  const bunMat = new THREE.MeshStandardMaterial({ color: 0xd9a35f, roughness: 0.6, flatShading: true });
  const bunBottom = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.14, 0.32), bunMat);
  bunBottom.position.y = -0.16;
  hotdog.add(bunBottom);

  // Bun top
  const bunTop = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.14, 0.32), bunMat);
  bunTop.position.y = 0.16;
  hotdog.add(bunTop);

  // Sausage lying between the buns
  const sausageGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.58, 8);
  const sausageMat = new THREE.MeshStandardMaterial({
    color: 0xb23a2e, roughness: 0.4, emissive: 0xb23a2e, emissiveIntensity: 0.05, flatShading: true
  });
  const sausage = new THREE.Mesh(sausageGeo, sausageMat);
  sausage.rotation.z = Math.PI / 2;
  hotdog.add(sausage);

  // Mustard squiggle on the sausage
  const mustardMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.3 });
  for (let i = 0; i < 5; i++) {
    const blob = new THREE.Mesh(new THREE.SphereGeometry(0.035, 4, 4), mustardMat);
    blob.position.set(-0.2 + i * 0.1, 0.05, 0);
    blob.scale.set(1.4, 1, 1);
    hotdog.add(blob);
  }

  hotdog.name = 'hotdog';
  return hotdog;
}

export function createChips() {
  const chips = new THREE.Group();

  // Red bag body
  const bagMat = new THREE.MeshStandardMaterial({
    color: 0xd32f2f, roughness: 0.5, emissive: 0xd32f2f, emissiveIntensity: 0.05, flatShading: true
  });
  const bag = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.5, 0.13), bagMat);
  bag.position.y = 0.05;
  chips.add(bag);

  // Gold foil bottom band
  const foilMat = new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.4, flatShading: true });
  const foil = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.18, 0.14), foilMat);
  foil.position.y = -0.18;
  chips.add(foil);

  // Crimped top seal
  const sealMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.6, flatShading: true });
  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.12, 5), sealMat);
  seal.rotation.x = Math.PI / 2;
  seal.position.y = 0.34;
  chips.add(seal);

  // A golden chip sticking out of the bag
  const chipMat = new THREE.MeshStandardMaterial({
    color: 0xe8c25b, roughness: 0.35, emissive: 0xe8c25b, emissiveIntensity: 0.06, flatShading: true
  });
  const chip = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.14, 4), chipMat);
  chip.rotation.z = Math.PI;
  chip.position.set(0.05, 0.45, 0);
  chip.rotation.y = 0.4;
  chips.add(chip);

  chips.name = 'chips';
  return chips;
}

// ----------------------------------------------------
// FACTORY DISPATCHERS FOR SPAWN LOGIC
// ----------------------------------------------------

export function createFruit(type) {
  switch (type) {
    case 'mango': return createMango();
    case 'banana': return createBanana();
    case 'watermelon': return createWatermelon();
    case 'papaya': return createPapaya();
    case 'calamansi': return createCalamansi();
    default: return createMango();
  }
}

export function createVeggie(type) {
  switch (type) {
    case 'carrot': return createCarrot();
    case 'broccoli': return createBroccoli();
    case 'squash': return createSquash();
    case 'eggplant': return createEggplant();
    default: return createCarrot();
  }
}

export function createJunk(type) {
  switch (type) {
    case 'burger': return createBurger();
    case 'soda': return createSoda();
    case 'donut': return createDonut();
    case 'fries': return createFries();
    case 'hotdog': return createHotdog();
    case 'chips': return createChips();
    default: return createSoda();
  }
}

// ----------------------------------------------------
// SCENIC TRACK SEGMENTS AND HAZARDS
// ----------------------------------------------------

export function createTrackSegment(width, length, theme) {
  const segment = new THREE.Group();

  // Main road slab
  const slabGeo = new THREE.BoxGeometry(width, 0.35, length);
  
  // Use a canvas texture mapped to the top face
  const texture = getFruitTrackTexture(theme);
  const materials = [
    new THREE.MeshStandardMaterial({ color: 0xe0e8f0, roughness: 0.7 }), // side-left
    new THREE.MeshStandardMaterial({ color: 0xe0e8f0, roughness: 0.7 }), // side-right
    new THREE.MeshStandardMaterial({ map: texture, roughness: 0.4 }),     // TOP face (fruit pattern)
    new THREE.MeshStandardMaterial({ color: 0xb0c0d0, roughness: 0.9 }), // bottom face
    new THREE.MeshStandardMaterial({ color: 0xe0e8f0, roughness: 0.7 }), // front
    new THREE.MeshStandardMaterial({ color: 0xe0e8f0, roughness: 0.7 })  // back
  ];
  
  const slab = new THREE.Mesh(slabGeo, materials);
  segment.add(slab);

  // Glowing translucent edges for that futuristic sci-fi visual wow
  const edgeGeo = new THREE.BoxGeometry(0.18, 0.45, length);
  let edgeColor = 0x69ffb4; // Default healthy green bright
  
  if (theme === 'orange') edgeColor = 0xffab00;
  else if (theme === 'watermelon') edgeColor = 0xff5252;
  else if (theme === 'kiwi') edgeColor = 0x69f0ae;
  else if (theme === 'mango') edgeColor = 0xffb74d;
  else if (theme === 'papaya') edgeColor = 0xff8a50;

  const edgeMat = new THREE.MeshBasicMaterial({
    color: edgeColor,
    transparent: true,
    opacity: 0.9
  });

  const leftEdge = new THREE.Mesh(edgeGeo, edgeMat);
  leftEdge.position.set(-width / 2 - 0.08, 0.05, 0);
  segment.add(leftEdge);

  const rightEdge = new THREE.Mesh(edgeGeo, edgeMat);
  rightEdge.position.set(width / 2 + 0.08, 0.05, 0);
  segment.add(rightEdge);

  segment.name = `track_${theme}`;
  return segment;
}

export function createSlimeObstacle() {
  const slime = new THREE.Group();

  // Puddle base
  const baseGeo = new THREE.CylinderGeometry(0.85, 0.95, 0.03, 8);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0xce3a8a,
    roughness: 0.05,
    metalness: 0.1,
    transparent: true,
    opacity: 0.95,
    emissive: 0x9c27b0,
    emissiveIntensity: 0.5
  });
  const puddle = new THREE.Mesh(baseGeo, baseMat);
  puddle.scale.set(1, 1, 1.4); // stretch it along Z
  slime.add(puddle);

  // Tiny raising slime bubbles
  const bubbleGeo = new THREE.SphereGeometry(0.12, 6, 6);
  for (let i = 0; i < 4; i++) {
    const bubble = new THREE.Mesh(bubbleGeo, baseMat);
    const angle = (i * Math.PI * 2) / 4 + Math.random() * 0.3;
    const dist = 0.3 + Math.random() * 0.3;
    bubble.position.set(
      Math.sin(angle) * dist,
      0.03,
      Math.cos(angle) * dist * 1.3
    );
    bubble.scale.y = 0.6; // flat bottom dome
    slime.add(bubble);
  }

  slime.name = 'slime';
  return slime;
}

// ----------------------------------------------------
// PARTICLE TRAIL AND HIT EFFECT SYSTEMS
// ----------------------------------------------------

export class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.geometry = new THREE.BoxGeometry(0.08, 0.08, 0.08); // simple low-poly box particles
  }

  spawnTrail(position, colorHex, count = 2) {
    const material = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.geometry, material);
      
      // Spawn near player bottom/back
      mesh.position.copy(position);
      mesh.position.x += (Math.random() - 0.5) * 0.5;
      mesh.position.y += (Math.random() - 0.7) * 0.3; // slightly down
      mesh.position.z += (Math.random() - 0.2) * 0.3 + 0.3; // slightly behind

      // Random velocities
      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        (Math.random() * 0.5) + 0.2, // always drift up
        (Math.random() * 0.5) + 1.0  // drift backwards relative to moving player
      );

      const life = 1.0; // seconds
      const scaleSpeed = 1.8;

      this.particles.push({ mesh, velocity, life, maxLife: life, scaleSpeed });
      this.scene.add(mesh);
    }
  }

  spawnExplosion(position, colorHex, count = 12) {
    const material = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 1.0
    });

    for (let i = 0; i < count; i++) {
      const mesh = new THREE.Mesh(this.geometry, material);
      mesh.position.copy(position);

      // Random spherical blast velocity
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const speed = 1.5 + Math.random() * 2.5;

      const velocity = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta) * speed,
        Math.sin(phi) * Math.sin(theta) * speed + 1.0, // slight upward bias
        Math.cos(phi) * speed
      );

      const life = 0.5 + Math.random() * 0.5; // lifespan
      const scaleSpeed = 2.0;

      this.particles.push({ mesh, velocity, life, maxLife: life, scaleSpeed });
      this.scene.add(mesh);
    }
  }

  spawnToxicSmoke(position, count = 2) {
    // Warning purple/magenta smoke particles
    const colors = [0x8a0a3c, 0xce3a8a, 0x3a0a1e];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const material = new THREE.MeshStandardMaterial({
      color: color,
      transparent: true,
      opacity: 0.65,
      roughness: 0.9
    });

    for (let i = 0; i < count; i++) {
      const smokeGeo = new THREE.SphereGeometry(0.1 + Math.random() * 0.1, 4, 4);
      const mesh = new THREE.Mesh(smokeGeo, material);
      
      mesh.position.copy(position);
      mesh.position.x += (Math.random() - 0.5) * 0.4;
      mesh.position.y += (Math.random() - 0.3) * 0.4;
      mesh.position.z += 0.4; // behind

      const velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 0.4,
        (Math.random() * 0.8) + 0.3,
        (Math.random() * 0.6) + 0.8
      );

      const life = 0.8 + Math.random() * 0.6;
      const scaleSpeed = -0.5; // grow slightly before fading

      this.particles.push({ mesh, velocity, life, maxLife: life, scaleSpeed });
      this.scene.add(mesh);
    }
  }

  update(deltaTime) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Update life
      p.life -= deltaTime;
      
      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
        continue;
      }

      // Physics motion
      p.mesh.position.addScaledVector(p.velocity, deltaTime);
      
      // Gravity slow down on Y axis
      p.velocity.y -= 1.8 * deltaTime;

      // Scale changes based on life
      const ratio = p.life / p.maxLife;
      if (p.scaleSpeed > 0) {
        // shrink
        const scaleVal = Math.max(0.001, ratio);
        p.mesh.scale.set(scaleVal, scaleVal, scaleVal);
      } else {
        // expand (for smoke)
        const scaleVal = 1 + (1 - ratio) * Math.abs(p.scaleSpeed);
        p.mesh.scale.set(scaleVal, scaleVal, scaleVal);
      }

      // Fade opacity
      p.mesh.material.opacity = ratio * 0.8;
    }
  }

  clear() {
    this.particles.forEach(p => {
      this.scene.remove(p.mesh);
      p.mesh.geometry.dispose();
      p.mesh.material.dispose();
    });
    this.particles = [];
  }
}

// ----------------------------------------------------
// SKIN MATERIAL GENERATORS
// ----------------------------------------------------

function createCanvasTexture(drawFn) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  drawFn(ctx, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createKiwiFusionMaterial() {
  const map = createCanvasTexture((ctx, w, h) => {
    // Green flesh base
    ctx.fillStyle = '#30d158';
    ctx.fillRect(0, 0, w, h);
    // White core streaks
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI * 2) / 12;
      ctx.beginPath();
      ctx.moveTo(w / 2, h / 2);
      ctx.lineTo(w / 2 + Math.cos(angle) * w * 0.45, h / 2 + Math.sin(angle) * h * 0.45);
      ctx.stroke();
    }
    // Black seeds in a ring
    ctx.fillStyle = '#1c1c1e';
    for (let i = 0; i < 16; i++) {
      const angle = (i * Math.PI * 2) / 16;
      const r = w * 0.28;
      ctx.beginPath();
      ctx.arc(w / 2 + Math.cos(angle) * r, h / 2 + Math.sin(angle) * r, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  return new THREE.MeshPhysicalMaterial({
    map: map,
    color: 0x00e676,
    emissive: 0x00c853,
    emissiveIntensity: 0.3,
    roughness: 0.35,
    metalness: 0.0,
    clearcoat: 0.8,
    clearcoatRoughness: 0.2
  });
}

function createLiquidGoldMaterial() {
  return new THREE.MeshPhysicalMaterial({
    color: 0xffd700,
    emissive: 0xb8860b,
    emissiveIntensity: 0.5,
    roughness: 0.05,
    metalness: 1.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.0,
    reflectivity: 1.0
  });
}

function createRetroMatrixMaterial() {
  const map = createCanvasTexture((ctx, w, h) => {
    // Dark purple base
    ctx.fillStyle = '#1a0030';
    ctx.fillRect(0, 0, w, h);
    // Cyan grid lines
    ctx.strokeStyle = '#00f0ff';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 6;
    const gridSize = 20;
    for (let x = 0; x <= w; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    // Bright intersection dots
    ctx.fillStyle = '#00f0ff';
    for (let x = 0; x <= w; x += gridSize) {
      for (let y = 0; y <= h; y += gridSize) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });

  return new THREE.MeshPhysicalMaterial({
    map: map,
    color: 0x6600cc,
    emissive: 0x00f0ff,
    emissiveIntensity: 0.6,
    roughness: 0.15,
    metalness: 0.3,
    clearcoat: 0.9,
    clearcoatRoughness: 0.1
  });
}

function createToxicOozeMaterial() {
  const map = createCanvasTexture((ctx, w, h) => {
    // Dark murky green base
    ctx.fillStyle = '#0d1a0d';
    ctx.fillRect(0, 0, w, h);
    // Bubbles and splotches
    const colors = ['#1f4a1f', '#2d6a2d', '#3d8a3d', '#0a300a'];
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = 0.4 + Math.random() * 0.4;
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = 8 + Math.random() * 25;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
    // Toxic glowing veins
    ctx.strokeStyle = '#39ff14';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#39ff14';
    ctx.shadowBlur = 8;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath();
      let cx = Math.random() * w, cy = Math.random() * h;
      ctx.moveTo(cx, cy);
      for (let j = 0; j < 5; j++) {
        cx += (Math.random() - 0.5) * 60;
        cy += (Math.random() - 0.5) * 60;
        ctx.lineTo(cx, cy);
      }
      ctx.stroke();
    }
  });

  return new THREE.MeshPhysicalMaterial({
    map: map,
    color: 0x1f4a1f,
    emissive: 0x39ff14,
    emissiveIntensity: 0.4,
    roughness: 0.6,
    metalness: 0.0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.5
  });
}

// Skin Registry: defines all available skins
export const SKINS = [
  {
    id: 'default',
    name: 'Classic Glow',
    color: '#ffffff',
    requirement: null, // always unlocked
    requirementLabel: 'Default',
    createMaterial: () => new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 0.6,
      roughness: 0.1,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1
    })
  },
  {
    id: 'kiwi_fusion',
    name: 'Kiwi Fusion',
    color: '#00e676',
    requirement: { type: 'highscore', value: 4000 },
    requirementLabel: 'Score 4,000 to Unlock',
    createMaterial: createKiwiFusionMaterial
  },
  {
    id: 'liquid_gold',
    name: 'Liquid Gold',
    color: '#ffd700',
    requirement: { type: 'highscore', value: 6000 },
    requirementLabel: 'Score 6,000 to Unlock',
    createMaterial: createLiquidGoldMaterial
  },
  {
    id: 'retro_matrix',
    name: 'Retro Matrix',
    color: '#00f0ff',
    requirement: { type: 'highscore', value: 8000 },
    requirementLabel: 'Score 8,000 to Unlock',
    createMaterial: createRetroMatrixMaterial
  },
  {
    id: 'toxic_ooze',
    name: 'Toxic Ooze',
    color: '#39ff14',
    requirement: { type: 'highscore', value: 10000, or: { type: 'level', value: 10 } },
    requirementLabel: 'Score 10,000 or Level 10 to Unlock',
    createMaterial: createToxicOozeMaterial
  }
];

export function createFinishLine(trackWidth) {
  const finishLine = new THREE.Group();

  // Left Pillar
  const pillarGeo = new THREE.CylinderGeometry(0.18, 0.18, 4.0, 8);
  const pillarMat = new THREE.MeshPhysicalMaterial({
    color: 0x4da6ff,
    emissive: 0x4da6ff,
    emissiveIntensity: 0.7,
    roughness: 0.1,
    metalness: 0.8
  });
  const leftPillar = new THREE.Mesh(pillarGeo, pillarMat);
  leftPillar.position.set(-trackWidth / 2 - 0.25, 2.0, 0);
  finishLine.add(leftPillar);

  // Right Pillar
  const rightPillar = leftPillar.clone();
  rightPillar.position.set(trackWidth / 2 + 0.25, 2.0, 0);
  finishLine.add(rightPillar);

  // Banner Arch Crossbar
  const barGeo = new THREE.BoxGeometry(trackWidth + 0.8, 0.4, 0.4);
  const barMat = new THREE.MeshPhysicalMaterial({
    color: 0xff0055,
    emissive: 0xff0055,
    emissiveIntensity: 0.6,
    roughness: 0.2
  });
  const crossbar = new THREE.Mesh(barGeo, barMat);
  crossbar.position.set(0, 4.0, 0);
  finishLine.add(crossbar);

  // Checkered Banner Board hanging from crossbar
  const bannerGeo = new THREE.BoxGeometry(trackWidth, 0.8, 0.05);
  // Create Checkered Canvas texture
  const map = createCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#000000';
    const rows = 4;
    const cols = 20;
    const cw = w / cols;
    const ch = h / rows;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if ((r + c) % 2 === 0) {
          ctx.fillRect(c * cw, r * ch, cw, ch);
        }
      }
    }
  });
  const bannerMat = new THREE.MeshStandardMaterial({
    map: map,
    roughness: 0.5
  });
  const banner = new THREE.Mesh(bannerGeo, bannerMat);
  banner.position.set(0, 3.2, 0);
  finishLine.add(banner);

  // "FINISH" text sign
  const signGeo = new THREE.BoxGeometry(3.0, 0.5, 0.08);
  const signMap = createCanvasTexture((ctx, w, h) => {
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 64px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.strokeStyle = '#ff0055';
    ctx.lineWidth = 6;
    ctx.strokeText('FINISH', w / 2, h / 2);
    ctx.fillText('FINISH', w / 2, h / 2);
  });
  const signMat = new THREE.MeshBasicMaterial({
    map: signMap,
    transparent: true,
    side: THREE.DoubleSide
  });
  const sign = new THREE.Mesh(signGeo, signMat);
  sign.position.set(0, 3.2, 0.05);
  finishLine.add(sign);

  return finishLine;
}

export function createGermMesh() {
  const germ = new THREE.Group();
  // Central blob
  const bodyGeo = new THREE.SphereGeometry(0.08, 6, 6);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x8a0a3c,
    roughness: 0.7,
    emissive: 0x8a0a3c,
    emissiveIntensity: 0.2,
    flatShading: true
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  germ.add(body);

  // Spikes
  const spikeGeo = new THREE.ConeGeometry(0.02, 0.08, 4);
  const spikeMat = new THREE.MeshBasicMaterial({ color: 0xce3a8a });
  for (let i = 0; i < 8; i++) {
    const spike = new THREE.Mesh(spikeGeo, spikeMat);
    const angle1 = Math.random() * Math.PI * 2;
    const angle2 = Math.random() * Math.PI;
    spike.position.set(
      0.08 * Math.sin(angle2) * Math.cos(angle1),
      0.08 * Math.sin(angle2) * Math.sin(angle1),
      0.08 * Math.cos(angle2)
    );
    spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), spike.position.clone().normalize());
    germ.add(spike);
  }
  return germ;
}

export function createMagnet() {
  const group = new THREE.Group();
  
  // Base blue horseshoe
  const baseGeo = new THREE.TorusGeometry(0.3, 0.12, 8, 16, Math.PI);
  const baseMat = new THREE.MeshStandardMaterial({
    color: 0x0055ff,
    roughness: 0.2,
    metalness: 0.6,
    emissive: 0x0055ff,
    emissiveIntensity: 0.2
  });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.rotation.z = Math.PI; // Point down
  base.position.y = 0.2;
  group.add(base);

  // Silver tips
  const tipGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.2, 8);
  const tipMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    metalness: 0.9,
    roughness: 0.1
  });
  const tip1 = new THREE.Mesh(tipGeo, tipMat);
  tip1.position.set(-0.3, 0.1, 0);
  group.add(tip1);

  const tip2 = new THREE.Mesh(tipGeo, tipMat);
  tip2.position.set(0.3, 0.1, 0);
  group.add(tip2);

  // Simple animation placeholder wrapper
  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

export function createShield() {
  const group = new THREE.Group();
  
  // Golden glowing sphere
  const sphereGeo = new THREE.SphereGeometry(0.4, 16, 16);
  const sphereMat = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    metalness: 0.8,
    roughness: 0.2,
    transparent: true,
    opacity: 0.8,
    emissive: 0xffea00,
    emissiveIntensity: 0.5
  });
  const sphere = new THREE.Mesh(sphereGeo, sphereMat);
  sphere.position.y = 0.2;
  group.add(sphere);

  // Simple animation placeholder wrapper
  const wrapper = new THREE.Group();
  wrapper.add(group);
  return wrapper;
}

// ─────────────────────────────────────────────
// NEW FRUIT MODELS
// ─────────────────────────────────────────────

export function createDalandan() {
  const group = new THREE.Group();

  // Green bumpy body (icosahedron for bumpy feel)
  const bodyGeo = new THREE.IcosahedronGeometry(0.37, 1);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x7cb518,
    flatShading: true,
    roughness: 0.8,
    metalness: 0.0
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Brown stem
  const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.12, 5);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x795548, flatShading: true });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.43, 0);
  group.add(stem);

  // Small green leaf
  const leafGeo = new THREE.BoxGeometry(0.18, 0.02, 0.08);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, flatShading: true });
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.position.set(0.1, 0.48, 0);
  leaf.rotation.z = 0.4;
  group.add(leaf);

  group.name = 'dalandan';
  return group;
}

export function createApple() {
  const group = new THREE.Group();

  // Main red body
  const bodyGeo = new THREE.SphereGeometry(0.36, 8, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xe74c3c,
    flatShading: true,
    roughness: 0.6
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Top indent (dark blush pushed into top)
  const indentGeo = new THREE.SphereGeometry(0.12, 6, 6);
  const indentMat = new THREE.MeshStandardMaterial({
    color: 0xc0392b,
    flatShading: true
  });
  const indent = new THREE.Mesh(indentGeo, indentMat);
  indent.position.set(0, 0.3, 0);
  group.add(indent);

  // Brown stem
  const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.18, 4);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x795548, flatShading: true });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.46, 0);
  group.add(stem);

  // Green leaf
  const leafGeo = new THREE.BoxGeometry(0.2, 0.02, 0.09);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, flatShading: true });
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  leaf.position.set(0.12, 0.52, 0);
  leaf.rotation.z = 0.45;
  group.add(leaf);

  group.name = 'apple';
  return group;
}

export function createMango() {
  const group = new THREE.Group();

  // Yellow-orange elongated body
  const bodyGeo = new THREE.SphereGeometry(0.4, 8, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf39c12,
    flatShading: true,
    roughness: 0.6
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Red blush patch (semi-transparent overlay)
  const blushGeo = new THREE.SphereGeometry(0.25, 6, 6);
  const blushMat = new THREE.MeshStandardMaterial({
    color: 0xe74c3c,
    flatShading: true,
    transparent: true,
    opacity: 0.5
  });
  const blush = new THREE.Mesh(blushGeo, blushMat);
  blush.position.set(0.18, 0.1, 0.1);
  group.add(blush);

  // Small green stem
  const stemGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.14, 4);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, flatShading: true });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.46, 0);
  group.add(stem);

  // Elongate/flatten the whole group to give mango oval shape
  group.scale.set(1, 1.3, 0.8);

  group.name = 'mango';
  return group;
}

export function createPineapple() {
  const group = new THREE.Group();

  // Yellow body
  const bodyGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.65, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xf1c40f,
    flatShading: true,
    roughness: 0.8
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Brown base stub
  const baseGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.1, 6);
  const baseMat = new THREE.MeshStandardMaterial({ color: 0x795548, flatShading: true });
  const base = new THREE.Mesh(baseGeo, baseMat);
  base.position.set(0, -0.375, 0);
  group.add(base);

  // Crown leaves (5 cone leaves fanning outward)
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, flatShading: true });
  const leafAngles = [0, 72, 144, 216, 288];
  leafAngles.forEach((angleDeg) => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const leafGeo = new THREE.ConeGeometry(0.06, 0.35, 4);
    const leaf = new THREE.Mesh(leafGeo, leafMat);
    leaf.position.set(
      Math.sin(angleRad) * 0.12,
      0.52,
      Math.cos(angleRad) * 0.12
    );
    leaf.rotation.z = Math.sin(angleRad) * 0.45;
    leaf.rotation.x = Math.cos(angleRad) * 0.45;
    group.add(leaf);
  });

  group.name = 'pineapple';
  return group;
}

export function createLanzones() {
  const group = new THREE.Group();

  // Cluster of small yellow oval fruits
  const fruitMat = new THREE.MeshStandardMaterial({
    color: 0xfdeaa7,
    flatShading: true,
    roughness: 0.7
  });
  const positions = [
    [0, 0, 0],
    [0.18, 0.1, 0],
    [-0.15, 0.12, 0.05],
    [0.05, 0.22, 0.1],
    [-0.08, -0.1, 0.12],
    [0.1, -0.15, -0.05]
  ];
  positions.forEach(([x, y, z]) => {
    const fruitGeo = new THREE.SphereGeometry(0.14, 6, 6);
    const fruit = new THREE.Mesh(fruitGeo, fruitMat);
    fruit.position.set(x, y, z);
    group.add(fruit);
  });

  // Small brown stem on top
  const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.1, 4);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x795548, flatShading: true });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.4, 0);
  group.add(stem);

  group.name = 'lanzones';
  return group;
}

export function createSantol() {
  const group = new THREE.Group();

  // Large pinkish-white round body
  const bodyGeo = new THREE.SphereGeometry(0.38, 8, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xfad7a0,
    flatShading: true,
    roughness: 0.7
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Thick green stem
  const stemGeo = new THREE.CylinderGeometry(0.035, 0.035, 0.18, 5);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, flatShading: true });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.47, 0);
  group.add(stem);

  // 4 pointed green sepals at the base
  const sepalMat = new THREE.MeshStandardMaterial({ color: 0x27ae60, flatShading: true });
  for (let i = 0; i < 4; i++) {
    const angle = (i / 4) * Math.PI * 2;
    const sepalGeo = new THREE.ConeGeometry(0.1, 0.3, 4);
    const sepal = new THREE.Mesh(sepalGeo, sepalMat);
    sepal.position.set(Math.sin(angle) * 0.22, -0.28, Math.cos(angle) * 0.22);
    sepal.rotation.z = Math.sin(angle) * 0.7;
    sepal.rotation.x = Math.cos(angle) * 0.7;
    group.add(sepal);
  }

  group.name = 'santol';
  return group;
}

export function createMangosteen() {
  const group = new THREE.Group();

  // Deep purple body
  const bodyGeo = new THREE.SphereGeometry(0.35, 8, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x6c2c91,
    flatShading: true,
    roughness: 0.7
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // Crown bumps on top (5 small green rounded bumps in a circle)
  const bumpMat = new THREE.MeshStandardMaterial({ color: 0x2ecc71, flatShading: true });
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const bumpGeo = new THREE.SphereGeometry(0.06, 4, 4);
    const bump = new THREE.Mesh(bumpGeo, bumpMat);
    bump.position.set(Math.sin(angle) * 0.14, 0.32, Math.cos(angle) * 0.14);
    group.add(bump);
  }

  // Short thick brown stem
  const stemGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.12, 5);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, flatShading: true });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.44, 0);
  group.add(stem);

  group.name = 'mangosteen';
  return group;
}

export function createRambutan() {
  const group = new THREE.Group();

  // Red main body
  const bodyGeo = new THREE.SphereGeometry(0.32, 8, 8);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0xc0392b,
    flatShading: true,
    roughness: 0.8
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // 16 hair spines distributed around the body using sunflower spherical spread
  const spineMat = new THREE.MeshStandardMaterial({ color: 0xe74c3c, flatShading: true });
  for (let i = 0; i < 16; i++) {
    const phi = Math.acos(-1 + (2 * i) / 16);
    const theta = Math.sqrt(16 * Math.PI) * phi;

    const spineGeo = new THREE.CylinderGeometry(0.018, 0.006, 0.28, 3);
    const spine = new THREE.Mesh(spineGeo, spineMat);

    const nx = Math.sin(phi) * Math.cos(theta);
    const ny = Math.cos(phi);
    const nz = Math.sin(phi) * Math.sin(theta);

    spine.position.set(nx * 0.32, ny * 0.32, nz * 0.32);

    const axis = new THREE.Vector3(0, 1, 0);
    const normal = new THREE.Vector3(nx, ny, nz).normalize();
    spine.quaternion.setFromUnitVectors(axis, normal);

    group.add(spine);
  }

  group.name = 'rambutan';
  return group;
}

export function createAtis() {
  const group = new THREE.Group();

  // Bumpy pale green body (icosahedron)
  const bodyGeo = new THREE.IcosahedronGeometry(0.36, 1);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x82c872,
    flatShading: true,
    roughness: 0.85
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  group.add(body);

  // ~12 surface bumps arranged around the body
  const bumpMat = new THREE.MeshStandardMaterial({ color: 0x6ab04c, flatShading: true });
  for (let i = 0; i < 12; i++) {
    const phi = Math.acos(-1 + (2 * i) / 12);
    const theta = (i / 12) * Math.PI * 4;

    const nx = Math.sin(phi) * Math.cos(theta);
    const ny = Math.cos(phi);
    const nz = Math.sin(phi) * Math.sin(theta);

    const bumpGeo = new THREE.SphereGeometry(0.1, 4, 4);
    const bump = new THREE.Mesh(bumpGeo, bumpMat);
    bump.position.set(nx * 0.34, ny * 0.34, nz * 0.34);
    group.add(bump);
  }

  // Short brown stem
  const stemGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.12, 5);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x795548, flatShading: true });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.44, 0);
  group.add(stem);

  group.name = 'atis';
  return group;
}

export function createChico() {
  const group = new THREE.Group();

  // Brown oval body
  const bodyGeo = new THREE.SphereGeometry(0.35, 7, 7);
  const bodyMat = new THREE.MeshStandardMaterial({
    color: 0x795548,
    flatShading: true,
    roughness: 0.8,
    metalness: 0.0
  });
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.scale.set(1, 1.15, 1);
  group.add(body);

  // Short brown stem
  const stemGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.14, 5);
  const stemMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, flatShading: true });
  const stem = new THREE.Mesh(stemGeo, stemMat);
  stem.position.set(0, 0.49, 0);
  group.add(stem);

  // 3 small green calyx cones at base
  const calyxMat = new THREE.MeshStandardMaterial({ color: 0x4caf50, flatShading: true });
  for (let i = 0; i < 3; i++) {
    const angle = (i / 3) * Math.PI * 2;
    const calyxGeo = new THREE.ConeGeometry(0.06, 0.12, 3);
    const calyx = new THREE.Mesh(calyxGeo, calyxMat);
    calyx.position.set(Math.sin(angle) * 0.18, -0.38, Math.cos(angle) * 0.18);
    calyx.rotation.z = Math.sin(angle) * 0.6;
    calyx.rotation.x = Math.cos(angle) * 0.6;
    group.add(calyx);
  }

  group.name = 'chico';
  return group;
}
