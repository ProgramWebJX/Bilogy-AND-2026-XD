import * as THREE from 'three';

/**
 * Biologji ADN — Motori Proceduror 3D i B-ADN (Three.js)
 * Bazuar në gjeometrinë atomike të B-ADN (Watson-Crick) dhe modelin fizik CPK Indigo Instruments.
 */

export const CPK_COLORS = {
  C: 0x1b1e23, // Karbon (I zi me shkëlqim)
  O: 0xd92626, // Oksigjen (E kuqe)
  N: 0x1d70d8, // Azot (Blu)
  H: 0xf4f6f9, // Hidrogjen (E bardhë)
  P: 0x7e3af2, // Fosfor (Vjollcë)
  BOND: 0x9ca3af,
  HBOND: 0xdbeafe,
  PLATE: 0xcbd5e1,
};

export const EDU_COLORS = {
  A: 0x2563eb, // Adenina - Blu
  T: 0xea580c, // Timina - Portokalli
  G: 0x16a34a, // Guanina - Jeshile
  C_BASE: 0xeab308, // Citozina - E verdhë
  SUGAR: 0xdc2626, // Deoksiriboza - E kuqe
  PHOSPHATE: 0x7c3aed, // Grupi Fosfat - Vjollcë
  HBOND: 0x94a3b8,
};

export const ATOM_RADII = {
  C: 0.42,
  O: 0.39,
  N: 0.40,
  H: 0.27,
  P: 0.50,
};

export const ELEMENT_INFO_SQ = {
  C: { name: 'Karbon (C)', formula: 'C', role: 'Skeleti organik i sheqerit deoksiribozë dhe unazave të bazave azotike.' },
  O: { name: 'Oksigjen (O)', formula: 'O', role: 'Pjesë e grupit fosfat (PO₄³⁻), unazës së sheqerit dhe grupeve karbonil.' },
  N: { name: 'Azot (N)', formula: 'N', role: 'Formon unazat heterociklike të bazave (A, T, G, C) dhe lidhjet hidrogjenore.' },
  H: { name: 'Hidrogjen (H)', formula: 'H', role: 'Plotëson valencat dhe realizon lidhjet hidrogjenore midis dy zinxhirëve.' },
  P: { name: 'Fosfor (P)', formula: 'P', role: 'Qendra tetraedrike e grupit fosfat që krijon lidhjen fosfodiesterike 5′→3′.' },
};

export const PART_INFO_SQ = {
  phosphate: {
    name: 'Grupi Fosfat',
    formula: 'PO₄³⁻',
    role: 'Lidh karbonin 3′ të një deoksiriboze me karbonin 5′ të tjetrës. I jep ADN-së ngarkesë negative dhe qëndrueshmëri hidrofile.',
  },
  sugar: {
    name: '2′-Deoksiriboza',
    formula: 'C₅H₁₀O₄',
    role: 'Sheqer pentozë me 5 atome karboni (i mungon oksigjeni në C2′). Mban bazën azotike në C1′ dhe fosfatet në C3′ e C5′.',
  },
  A: {
    name: 'Adenina (A) — Purinë',
    formula: 'C₅H₅N₅',
    role: 'Bazë azotike me dy unaza (purinë). Çiftohet ekskluzivisht me Timinën (T) përmes 2 lidhjeve hidrogjenore.',
  },
  T: {
    name: 'Timina (T) — Pirimidinë',
    formula: 'C₅H₆N₂O₂',
    role: 'Bazë azotike me një unazë (pirimidinë) dhe grup metil (-CH₃). Çiftohet me Adeninën (A) me 2 lidhje hidrogjenore.',
  },
  G: {
    name: 'Guanina (G) — Purinë',
    formula: 'C₅H₅N₅O',
    role: 'Bazë azotike me dy unaza (purinë). Çiftohet ekskluzivisht me Citozinën (C) përmes 3 lidhjeve hidrogjenore të forta.',
  },
  C: {
    name: 'Citozina (C) — Pirimidinë',
    formula: 'C₄H₅N₃O',
    role: 'Bazë azotike me një unazë (pirimidinë). Çiftohet me Guaninën (G) përmes 3 lidhjeve hidrogjenore.',
  },
  hbond: {
    name: 'Lidhje Hidrogjenore',
    formula: 'N–H···O / N–H···N',
    role: 'Lidhje jo-kovalente që mban bashkë dy zinxhirët komplementarë (2 për A=T, 3 për G≡C) duke lejuar hapjen gjatë replikimit.',
  },
  stand: {
    name: 'Baza e Drurit dhe Boshti Qendror',
    formula: 'Mbështetëse fizike',
    role: 'Strukturë mbajtëse e modelit fizik laboratorik (Indigo Instruments) me bazë druri lisi dhe bosht çeliku.',
  },
};

// 22 çifte bazash (rreth 2.1 rrotullime të plota të B-ADN)
export const DEFAULT_SEQUENCE = [
  'A', 'T', 'G', 'C', 'G', 'A', 'T', 'C', 'A', 'G', 'C',
  'T', 'A', 'C', 'G', 'T', 'G', 'A', 'C', 'T', 'G', 'A'
];

export const COMPLEMENT = { A: 'T', T: 'A', G: 'C', C: 'G' };

// Material cache factory
function createMaterialSet(colorMode = 'cpk') {
  const mkGlossy = (hex, roughness = 0.24, metalness = 0.08) =>
    new THREE.MeshStandardMaterial({ color: hex, roughness, metalness });

  const mats = {
    atoms: {
      C: mkGlossy(CPK_COLORS.C, 0.22, 0.14),
      O: mkGlossy(CPK_COLORS.O, 0.22, 0.08),
      N: mkGlossy(CPK_COLORS.N, 0.22, 0.08),
      H: mkGlossy(CPK_COLORS.H, 0.18, 0.05),
      P: mkGlossy(CPK_COLORS.P, 0.24, 0.10),
    },
    edu: {
      A: mkGlossy(EDU_COLORS.A, 0.28, 0.06),
      T: mkGlossy(EDU_COLORS.T, 0.28, 0.06),
      G: mkGlossy(EDU_COLORS.G, 0.28, 0.06),
      C: mkGlossy(EDU_COLORS.C_BASE, 0.28, 0.06),
      sugar: mkGlossy(EDU_COLORS.SUGAR, 0.28, 0.06),
      phosphate: mkGlossy(EDU_COLORS.PHOSPHATE, 0.28, 0.06),
    },
    bond: new THREE.MeshStandardMaterial({ color: 0xb0b8c4, roughness: 0.35, metalness: 0.25 }),
    hbond: new THREE.MeshStandardMaterial({
      color: 0xcbd5e1,
      roughness: 0.2,
      metalness: 0.15,
      transparent: true,
      opacity: 0.78,
    }),
    plate: new THREE.MeshStandardMaterial({
      color: 0xd8e0ea,
      roughness: 0.35,
      metalness: 0.05,
      transparent: true,
      opacity: 0.38,
    }),
    steel: new THREE.MeshStandardMaterial({ color: 0xcbd2da, roughness: 0.22, metalness: 0.88 }),
    wood: new THREE.MeshStandardMaterial({ color: 0x9b6236, roughness: 0.42, metalness: 0.04 }),
    woodDark: new THREE.MeshStandardMaterial({ color: 0x734422, roughness: 0.48, metalness: 0.04 }),
    colorMode,
  };
  return mats;
}

// Shared low-poly-enough yet smooth geometries (optimal .glb file size + crisp look)
function createGeometrySet(detail = 'standard') {
  const segs = detail === 'high' ? 20 : 12;
  const bondSegs = detail === 'high' ? 10 : 7;
  return {
    spheres: {
      C: new THREE.SphereGeometry(ATOM_RADII.C, segs, segs),
      O: new THREE.SphereGeometry(ATOM_RADII.O, segs, segs),
      N: new THREE.SphereGeometry(ATOM_RADII.N, segs, segs),
      H: new THREE.SphereGeometry(ATOM_RADII.H, segs, segs),
      P: new THREE.SphereGeometry(ATOM_RADII.P, segs, segs),
    },
    bond: new THREE.CylinderGeometry(0.11, 0.11, 1, bondSegs),
    hbond: new THREE.CylinderGeometry(0.065, 0.065, 1, bondSegs),
  };
}

function addAtom(parent, element, pos, mats, geoms, meta = {}) {
  const useEdu = mats.colorMode === 'educational' && meta.eduKey && mats.edu[meta.eduKey];
  const mat = useEdu ? mats.edu[meta.eduKey] : mats.atoms[element];
  const mesh = new THREE.Mesh(geoms.spheres[element], mat);
  mesh.position.set(pos[0], pos[1], pos[2]);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.userData = {
    isAtom: true,
    element,
    eduKey: meta.eduKey || null,
    partType: meta.partType || 'atom',
    bpIndex: meta.bpIndex ?? null,
    strand: meta.strand || null,
    label: meta.label || ELEMENT_INFO_SQ[element]?.name || element,
  };
  parent.add(mesh);
  return mesh;
}

function addBond(parent, p1, p2, mats, geoms, isHBond = false, meta = {}) {
  const v1 = new THREE.Vector3(...p1);
  const v2 = new THREE.Vector3(...p2);
  const dir = new THREE.Vector3().subVectors(v2, v1);
  const len = dir.length();
  if (len < 0.001) return null;

  const mesh = new THREE.Mesh(
    isHBond ? geoms.hbond : geoms.bond,
    isHBond ? mats.hbond : mats.bond
  );
  mesh.position.copy(v1).add(v2).multiplyScalar(0.5);
  mesh.scale.set(1, len, 1);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  mesh.userData = {
    isBond: true,
    isHBond,
    partType: isHBond ? 'hbond' : (meta.partType || 'bond'),
    bpIndex: meta.bpIndex ?? null,
    strand: meta.strand || null,
  };
  parent.add(mesh);
  return mesh;
}

/**
 * Koordinata lokale atomike (në Ångström) për bazat azotike.
 * Origjina e bazës është e orientuar me lidhjen glikozidike nga +X (ana e sheqerit)
 * drejt -X (boshti qendror / lidhjet hidrogjenore).
 */
function getBaseTemplate(type) {
  if (type === 'A') {
    // Adenina (Purinë: unazë 5-she + 6-she)
    const atoms = [
      ['N', 2.8, 0.0, 0.0],    // 0: N9 (lidhet me C1')
      ['C', 2.1, 1.1, 0.0],    // 1: C8
      ['N', 0.8, 1.0, 0.0],    // 2: N7
      ['C', 0.6, -0.3, 0.0],   // 3: C5
      ['C', 1.8, -0.9, 0.0],   // 4: C4
      ['C', -0.6, -0.9, 0.0],  // 5: C6
      ['N', -0.7, -2.2, 0.0],  // 6: N1 (H-bond acceptor)
      ['C', 0.4, -2.9, 0.0],   // 7: C2
      ['N', 1.6, -2.3, 0.0],   // 8: N3
      ['N', -1.7, -0.2, 0.0],  // 9: N6 (exocyclic -NH2)
      ['H', -2.6, -0.6, 0.0],  // 10: H6a (H-bond donor)
      ['H', -1.6, 0.8, 0.0],   // 11: H6b
      ['H', 2.5, 2.0, 0.0],    // 12: H8
      ['H', 0.3, -3.9, 0.0],   // 13: H2
    ];
    const bonds = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
      [3, 5], [5, 6], [6, 7], [7, 8], [8, 4],
      [5, 9], [9, 10], [9, 11], [1, 12], [7, 13],
    ];
    return { atoms, bonds, glycosidic: [2.8, 0.0, 0.0], hAnchors: [[-1.7, -0.2, 0.0], [-0.7, -2.2, 0.0]] };
  }
  if (type === 'G') {
    // Guanina (Purinë: me =O në C6 dhe -NH2 në C2)
    const atoms = [
      ['N', 2.8, 0.0, 0.0],    // 0: N9
      ['C', 2.1, 1.1, 0.0],    // 1: C8
      ['N', 0.8, 1.0, 0.0],    // 2: N7
      ['C', 0.6, -0.3, 0.0],   // 3: C5
      ['C', 1.8, -0.9, 0.0],   // 4: C4
      ['C', -0.6, -0.9, 0.0],  // 5: C6
      ['N', -0.7, -2.2, 0.0],  // 6: N1 (donor)
      ['C', 0.4, -2.9, 0.0],   // 7: C2
      ['N', 1.6, -2.3, 0.0],   // 8: N3
      ['O', -1.7, -0.3, 0.0],  // 9: O6 (acceptor)
      ['N', 0.2, -4.2, 0.0],   // 10: N2 (exocyclic -NH2)
      ['H', -1.6, -2.6, 0.0],  // 11: H1
      ['H', -0.7, -4.6, 0.0],  // 12: H2a
      ['H', 1.0, -4.8, 0.0],   // 13: H2b
      ['H', 2.5, 2.0, 0.0],    // 14: H8
    ];
    const bonds = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
      [3, 5], [5, 6], [6, 7], [7, 8], [8, 4],
      [5, 9], [7, 10], [6, 11], [10, 12], [10, 13], [1, 14],
    ];
    return { atoms, bonds, glycosidic: [2.8, 0.0, 0.0], hAnchors: [[-1.7, -0.3, 0.0], [-0.7, -2.2, 0.0], [0.2, -4.2, 0.0]] };
  }
  if (type === 'T') {
    // Timina (Pirimidinë: 1 unazë + 2 Oksigjene + grup metil -CH3)
    const atoms = [
      ['N', 2.4, 0.0, 0.0],    // 0: N1 (lidhet me C1')
      ['C', 1.7, -1.2, 0.0],   // 1: C2
      ['N', 0.4, -1.2, 0.0],   // 2: N3
      ['C', -0.3, 0.0, 0.0],   // 3: C4
      ['C', 0.4, 1.2, 0.0],    // 4: C5
      ['C', 1.7, 1.2, 0.0],    // 5: C6
      ['O', 2.3, -2.3, 0.0],   // 6: O2
      ['O', -1.5, 0.0, 0.0],   // 7: O4
      ['C', -0.2, 2.5, 0.0],   // 8: C5-Methyl
      ['H', -0.2, -2.0, 0.0],  // 9: H3
      ['H', 0.4, 3.2, 0.5],    // 10: H methyl
      ['H', -1.2, 2.5, 0.3],   // 11: H methyl
      ['H', -0.2, 2.8, -0.9],  // 12: H methyl
      ['H', 2.3, 2.1, 0.0],    // 13: H6
    ];
    const bonds = [
      [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
      [1, 6], [3, 7], [4, 8], [2, 9],
      [8, 10], [8, 11], [8, 12], [5, 13],
    ];
    return { atoms, bonds, glycosidic: [2.4, 0.0, 0.0], hAnchors: [[-1.5, 0.0, 0.0], [0.4, -1.2, 0.0]] };
  }
  // Citozina (Pirimidinë: 1 unazë + =O në C2 + -NH2 në C4)
  const atoms = [
    ['N', 2.4, 0.0, 0.0],    // 0: N1
    ['C', 1.7, -1.2, 0.0],   // 1: C2
    ['N', 0.4, -1.2, 0.0],   // 2: N3
    ['C', -0.3, 0.0, 0.0],   // 3: C4
    ['C', 0.4, 1.2, 0.0],    // 4: C5
    ['C', 1.7, 1.2, 0.0],    // 5: C6
    ['O', 2.3, -2.3, 0.0],   // 6: O2
    ['N', -1.6, 0.0, 0.0],   // 7: N4 (-NH2)
    ['H', -2.1, -0.8, 0.0],  // 8: H4a
    ['H', -2.0, 0.9, 0.0],   // 9: H4b
    ['H', -0.1, 2.1, 0.0],   // 10: H5
    ['H', 2.3, 2.1, 0.0],    // 11: H6
  ];
  const bonds = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
    [1, 6], [3, 7], [7, 8], [7, 9], [4, 10], [5, 11],
  ];
  return { atoms, bonds, glycosidic: [2.4, 0.0, 0.0], hAnchors: [[-1.6, 0.0, 0.0], [0.4, -1.2, 0.0], [2.3, -2.3, 0.0]] };
}

/**
 * Ndërton Grupin Fosfat (PO4^3-) si grup modular 3D
 */
export function buildPhosphateGroup(options = {}) {
  const mats = options.mats || createMaterialSet(options.colorMode || 'cpk');
  const geoms = options.geoms || createGeometrySet(options.detail || 'standard');
  const group = new THREE.Group();
  group.name = 'Grup_Fosfat';

  const meta = { eduKey: 'phosphate', partType: 'phosphate', bpIndex: options.bpIndex, strand: options.strand };
  const p = [0, 0, 0];
  const o1 = [1.25, 0.72, 0.72];   // OP1 (jashtë)
  const o2 = [1.25, -0.72, -0.72]; // OP2 (jashtë)
  const o3 = [-0.95, 1.05, -0.45]; // O5'
  const o4 = [-0.95, -1.05, 0.45]; // O3'

  addAtom(group, 'P', p, mats, geoms, { ...meta, label: 'Fosfor (P) — Grup Fosfat' });
  addAtom(group, 'O', o1, mats, geoms, { ...meta, label: 'Oksigjen OP1 — Grup Fosfat' });
  addAtom(group, 'O', o2, mats, geoms, { ...meta, label: 'Oksigjen OP2 — Grup Fosfat' });
  addAtom(group, 'O', o3, mats, geoms, { ...meta, label: 'Oksigjen O5′ — Lidhje Fosfodiesterike' });
  addAtom(group, 'O', o4, mats, geoms, { ...meta, label: 'Oksigjen O3′ — Lidhje Fosfodiesterike' });

  addBond(group, p, o1, mats, geoms, false, meta);
  addBond(group, p, o2, mats, geoms, false, meta);
  addBond(group, p, o3, mats, geoms, false, meta);
  addBond(group, p, o4, mats, geoms, false, meta);

  return group;
}

/**
 * Ndërton 2'-Deoksiribozën (sheqer pentozë C5H10O4)
 */
export function buildDeoxyribose(options = {}) {
  const mats = options.mats || createMaterialSet(options.colorMode || 'cpk');
  const geoms = options.geoms || createGeometrySet(options.detail || 'standard');
  const group = new THREE.Group();
  group.name = 'Deoksiriboze';

  const meta = { eduKey: 'sugar', partType: 'sugar', bpIndex: options.bpIndex, strand: options.strand };

  // Unaza furanozike me konformacion C2'-endo
  const c1 = [-1.15, -0.20, 0.15];
  const c2 = [-0.45, -1.25, 0.85];
  const c3 = [0.95, -0.85, 0.55];
  const c4 = [0.95, 0.55, -0.05];
  const o4 = [-0.35, 0.90, -0.25];
  const c5 = [1.95, 1.45, -0.65];

  // Hidrogjenet karakteristike (C2' ka dy H sepse është DEOKSI-ribozë!)
  const h1 = [-1.85, -0.55, -0.55];
  const h2a = [-0.75, -1.45, 1.85];
  const h2b = [-0.55, -2.15, 0.35];
  const h3 = [1.55, -1.55, 0.05];
  const h4 = [1.05, 0.55, -1.10];

  const atoms = [
    ['C', c1, 'Karbon C1′ (Lidhja glikozidike)'],
    ['C', c2, 'Karbon C2′ (Pa oksigjen — Deoksi)'],
    ['C', c3, 'Karbon C3′ (Drejt 3′ fosfat)'],
    ['C', c4, 'Karbon C4′'],
    ['O', o4, 'Oksigjen O4′ (Unaza pentozë)'],
    ['C', c5, 'Karbon C5′ (Drejt 5′ fosfat)'],
    ['H', h1, 'Hidrogjen H1′'],
    ['H', h2a, 'Hidrogjen H2′a'],
    ['H', h2b, 'Hidrogjen H2′b'],
    ['H', h3, 'Hidrogjen H3′'],
    ['H', h4, 'Hidrogjen H4′'],
  ];

  for (const [el, pos, label] of atoms) {
    addAtom(group, el, pos, mats, geoms, { ...meta, label });
  }

  const bonds = [
    [c1, c2], [c2, c3], [c3, c4], [c4, o4], [o4, c1], [c4, c5],
    [c1, h1], [c2, h2a], [c2, h2b], [c3, h3], [c4, h4],
  ];
  for (const [a, b] of bonds) {
    addBond(group, a, b, mats, geoms, false, meta);
  }

  return group;
}

/**
 * Ndërton një bazë azotike (A, T, G, ose C)
 */
export function buildBase(type, options = {}) {
  const mats = options.mats || createMaterialSet(options.colorMode || 'cpk');
  const geoms = options.geoms || createGeometrySet(options.detail || 'standard');
  const group = new THREE.Group();
  group.name = `Baza_${type}`;

  const tpl = getBaseTemplate(type);
  const meta = { eduKey: type, partType: type, bpIndex: options.bpIndex, strand: options.strand };

  for (const [el, x, y, z] of tpl.atoms) {
    addAtom(group, el, [x, y, z], mats, geoms, {
      ...meta,
      label: `${ELEMENT_INFO_SQ[el].name} — ${PART_INFO_SQ[type].name}`,
    });
  }
  for (const [i, j] of tpl.bonds) {
    const a = tpl.atoms[i];
    const b = tpl.atoms[j];
    addBond(group, [a[1], a[2], a[3]], [b[1], b[2], b[3]], mats, geoms, false, meta);
  }
  return group;
}

/**
 * Ndërton një çift komplementar bazash (A=T ose G≡C) me lidhje hidrogjenore në planin XZ
 */
export function buildBasePair(leftType = 'A', options = {}) {
  const mats = options.mats || createMaterialSet(options.colorMode || 'cpk');
  const geoms = options.geoms || createGeometrySet(options.detail || 'standard');
  const rightType = COMPLEMENT[leftType];
  const group = new THREE.Group();
  group.name = `Cift_${leftType}${rightType}`;

  const isLeftPurine = leftType === 'A' || leftType === 'G';

  // Pozicionimi në planin horizontal XZ (Y = 0)
  const leftBase = buildBase(leftType, { ...options, mats, geoms, strand: '5→3' });
  leftBase.rotation.x = Math.PI / 2;
  leftBase.position.set(isLeftPurine ? 1.85 : 2.35, 0, isLeftPurine ? 0.55 : -0.35);
  group.add(leftBase);

  const rightBase = buildBase(rightType, { ...options, mats, geoms, strand: '3→5' });
  rightBase.rotation.x = -Math.PI / 2;
  rightBase.rotation.z = Math.PI;
  rightBase.position.set(isLeftPurine ? -2.35 : -1.85, 0, isLeftPurine ? -0.35 : 0.55);
  group.add(rightBase);

  // Lidhjet hidrogjenore: 2 për A=T, 3 për G≡C
  const isGC = leftType === 'G' || leftType === 'C';
  const zOffsets = isGC ? [-1.05, 0.0, 1.05] : [-0.65, 0.75];
  for (const zOff of zOffsets) {
    addBond(group, [-1.05, 0, zOff], [0.75, 0, zOff], mats, geoms, true, {
      bpIndex: options.bpIndex,
      partType: 'hbond',
    });
  }

  return group;
}

/**
 * Ndërton një nukleotid të plotë (Fosfat + Deoksiribozë + Bazë Azotike)
 */
export function buildNucleotide(baseType = 'A', options = {}) {
  const mats = options.mats || createMaterialSet(options.colorMode || 'cpk');
  const geoms = options.geoms || createGeometrySet(options.detail || 'standard');
  const group = new THREE.Group();
  group.name = `Nukleotid_${baseType}`;

  const base = buildBase(baseType, { ...options, mats, geoms });
  base.rotation.x = Math.PI / 2;
  base.position.set(-1.5, 0, 0);
  group.add(base);

  const sugar = buildDeoxyribose({ ...options, mats, geoms });
  sugar.position.set(2.8, 0, 0.2);
  group.add(sugar);

  const phos = buildPhosphateGroup({ ...options, mats, geoms });
  phos.position.set(5.4, 1.8, -0.5);
  group.add(phos);

  // Lidhja glikozidike (Base -> C1') dhe Lidhja esterike (C5' -> P)
  addBond(group, [1.2, 0, 0], [1.7, -0.2, 0.3], mats, geoms, false, { partType: 'sugar' });
  addBond(group, [4.75, 1.45, -0.45], [5.4, 1.8, -0.5], mats, geoms, false, { partType: 'phosphate' });

  return group;
}

/**
 * Ndërton bazën fizike prej druri lisi dhe boshtin metalik qendror (si në foton Indigo Instruments)
 */
export function buildWoodenStand(helixHeight = 76, options = {}) {
  const mats = options.mats || createMaterialSet(options.colorMode || 'cpk');
  const group = new THREE.Group();
  group.name = 'Baza_Druri_Dhe_Boshti';

  // Baza rrethore prej druri me buzë të skalitur (turned oak base)
  const baseBottom = new THREE.Mesh(new THREE.CylinderGeometry(14.5, 15.0, 2.2, 48), mats.wood);
  baseBottom.position.y = -4.2;
  baseBottom.castShadow = true;
  baseBottom.receiveShadow = true;
  baseBottom.userData = { partType: 'stand', label: 'Bazë druri lisi (Mbështetëse fizike)' };
  group.add(baseBottom);

  const baseTopLip = new THREE.Mesh(new THREE.CylinderGeometry(13.2, 14.3, 0.9, 48), mats.woodDark);
  baseTopLip.position.y = -2.65;
  baseTopLip.receiveShadow = true;
  baseTopLip.userData = { partType: 'stand', label: 'Korniza e sipërme e bazës së drurit' };
  group.add(baseTopLip);

  const collar = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.4, 1.4, 24), mats.steel);
  collar.position.y = -1.6;
  collar.userData = { partType: 'stand', label: 'Mbeshtetësja metalike e boshtit' };
  group.add(collar);

  // Boshti qendror vertikal i çelikut
  const rodHeight = helixHeight + 5.5;
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, rodHeight, 20), mats.steel);
  rod.position.y = rodHeight / 2 - 2.2;
  rod.castShadow = true;
  rod.userData = { partType: 'stand', label: 'Boshti qendror i çelikut (Boshti i heliksit)' };
  group.add(rod);

  // Kapaku i vogël në majë të boshtit
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.58, 16, 16), mats.steel);
  cap.position.y = rodHeight - 2.2;
  cap.userData = { partType: 'stand', label: 'Maja e boshtit qendror' };
  group.add(cap);

  return group;
}

/**
 * Ndërton modelin e plotë 3D të B-ADN me 22 çifte bazash (~2.1 rrotullime të plota).
 * Struktura hierarkike lejon izolimin, shpërthimin (exploded view), dhe animimin sipas hapave të roadmap-it.
 */
export function buildFullDNA(options = {}) {
  const sequence = options.sequence || DEFAULT_SEQUENCE;
  const colorMode = options.colorMode || 'cpk';
  const includeStand = options.includeStand !== false;
  const detail = options.detail || 'standard';
  const scale = options.scale ?? 0.16;

  const mats = createMaterialSet(colorMode);
  const geoms = createGeometrySet(detail);

  const root = new THREE.Group();
  root.name = 'ADN_B_Double_Helix';

  const helixGroup = new THREE.Group();
  helixGroup.name = 'Heliksi_Dyfish';
  root.add(helixGroup);

  // Parametrat e saktë të B-ADN (në Ångström)
  const RISE = 3.4; // 3.4 Å për çift bazash
  const TWIST_RAD = (34.3 * Math.PI) / 180; // ~10.5 bp për rrotullim (360° / 10.5 = 34.3°)
  const BACKBONE_R = 9.4; // Rrezja e shtyllës fosfat-sheqer (~20 Å diametër total)
  const SUGAR_R = 7.4;
  // Këndi asimetrik midis dy zinxhirëve (~140° në vend të 180°) krijon Hullinë e Madhe dhe të Vogël!
  const GROOVE_ASYMMETRY = (142 * Math.PI) / 180;

  const totalHeight = sequence.length * RISE;

  const bpGroups = [];
  const prevPhosA = [];
  const prevPhosB = [];
  const prevSugarA = [];
  const prevSugarB = [];

  const backboneBondsGroup = new THREE.Group();
  backboneBondsGroup.name = 'Lidhjet_Fosfodiesterike';
  helixGroup.add(backboneBondsGroup);

  const platesGroup = new THREE.Group();
  platesGroup.name = 'Pllakat_Stabilizuese';
  helixGroup.add(platesGroup);

  let atomCount = 0;

  sequence.forEach((baseA, idx) => {
    const baseB = COMPLEMENT[baseA];
    const y = idx * RISE + 3.2;
    const angle = idx * TWIST_RAD;

    const bpGroup = new THREE.Group();
    bpGroup.name = `Cifti_${idx + 1}_${baseA}${baseB}`;
    bpGroup.position.set(0, y, 0);
    bpGroup.rotation.y = angle;
    helixGroup.add(bpGroup);

    // 1. Çifti i bazave + Lidhjet hidrogjenore në qendër
    const pairGroup = buildBasePair(baseA, { mats, geoms, bpIndex: idx });
    // Rrotullojmë pak bazat që lidhjet glikozidike të shkojnë drejt krahëve asimetrikë të hullisë
    pairGroup.rotation.y = -0.22;
    bpGroup.add(pairGroup);

    // 2. Pllaka e tejdukshme stabilizuese (si tek modeli Indigo Instruments në foto)
    const plate = new THREE.Mesh(new THREE.BoxGeometry(10.5, 0.24, 2.2), mats.plate);
    plate.position.set(0, y - 0.55, 0);
    plate.rotation.y = angle - 0.22;
    plate.userData = { partType: 'stand', label: 'Pllakë akrilike stabilizuese e nivelit' };
    platesGroup.add(plate);

    // 3. Zinxhiri A (5' -> 3') — Deoksiriboza & Fosfati
    const angA = 0;
    const sugarA = buildDeoxyribose({ mats, geoms, bpIndex: idx, strand: '5→3' });
    const sxA = Math.cos(angA) * SUGAR_R;
    const szA = Math.sin(angA) * SUGAR_R;
    sugarA.position.set(sxA, 0.1, szA);
    sugarA.rotation.set(0.25, -angA + 0.2, 0.15);
    bpGroup.add(sugarA);

    const phosA = buildPhosphateGroup({ mats, geoms, bpIndex: idx, strand: '5→3' });
    const pxA = Math.cos(angA - 0.26) * BACKBONE_R;
    const pzA = Math.sin(angA - 0.26) * BACKBONE_R;
    phosA.position.set(pxA, 1.55, pzA);
    phosA.rotation.set(0, -angA + 0.26, 0);
    bpGroup.add(phosA);

    // Lidhja glikozidike & esterike në Zinxhirin A
    addBond(bpGroup, [4.4, 0, 0.4], [sxA - 0.9, 0.0, szA], mats, geoms, false, { partType: 'sugar', bpIndex: idx, strand: '5→3' });
    addBond(bpGroup, [sxA + 0.6, 0.8, szA - 0.3], [pxA, 1.55, pzA], mats, geoms, false, { partType: 'phosphate', bpIndex: idx, strand: '5→3' });

    // 4. Zinxhiri B (3' -> 5' antiparalel!) — vendosur në këndin asimetrik GROOVE_ASYMMETRY
    const angB = GROOVE_ASYMMETRY;
    const sugarB = buildDeoxyribose({ mats, geoms, bpIndex: idx, strand: '3→5' });
    const sxB = Math.cos(angB) * SUGAR_R;
    const szB = Math.sin(angB) * SUGAR_R;
    sugarB.position.set(sxB, -0.1, szB);
    // Antiparalel: e rrotulluar me 180° (Math.PI) përgjatë boshtit radial!
    sugarB.rotation.set(Math.PI - 0.25, -angB + 0.2, -0.15);
    bpGroup.add(sugarB);

    const phosB = buildPhosphateGroup({ mats, geoms, bpIndex: idx, strand: '3→5' });
    const pxB = Math.cos(angB + 0.26) * BACKBONE_R;
    const pzB = Math.sin(angB + 0.26) * BACKBONE_R;
    phosB.position.set(pxB, -1.55, pzB);
    phosB.rotation.set(Math.PI, -angB - 0.26, 0);
    bpGroup.add(phosB);

    // Lidhja glikozidike & esterike në Zinxhirin B
    const bGlycX = Math.cos(angB) * 4.4;
    const bGlycZ = Math.sin(angB) * 4.4;
    addBond(bpGroup, [bGlycX, 0, bGlycZ], [sxB - Math.cos(angB) * 0.9, -0.1, szB - Math.sin(angB) * 0.9], mats, geoms, false, { partType: 'sugar', bpIndex: idx, strand: '3→5' });
    addBond(bpGroup, [sxB + Math.cos(angB) * 0.5, -0.8, szB + Math.sin(angB) * 0.5], [pxB, -1.55, pzB], mats, geoms, false, { partType: 'phosphate', bpIndex: idx, strand: '3→5' });

    // Ruajmë pozicionet botërore të fosfateve & sheqernave për lidhjen fosfodiesterike midis niveleve
    const worldPos = (lx, ly, lz) => {
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      return [lx * cos + lz * sin, y + ly, -lx * sin + lz * cos];
    };

    const wPhosA = worldPos(pxA, 1.55, pzA);
    const wSugarA = worldPos(sxA, -0.6, szA);
    const wPhosB = worldPos(pxB, -1.55, pzB);
    const wSugarB = worldPos(sxB, 0.6, szB);

    if (idx > 0) {
      // Lidhja fosfodiesterike 3' -> 5' në Zinxhirin A
      addBond(backboneBondsGroup, prevPhosA[idx - 1], wSugarA, mats, geoms, false, { partType: 'phosphate', bpIndex: idx, strand: '5→3' });
      // Lidhja fosfodiesterike antiparalele në Zinxhirin B
      addBond(backboneBondsGroup, prevSugarB[idx - 1], wPhosB, mats, geoms, false, { partType: 'phosphate', bpIndex: idx, strand: '3→5' });
    }

    prevPhosA.push(wPhosA);
    prevSugarA.push(wSugarA);
    prevPhosB.push(wPhosB);
    prevSugarB.push(wSugarB);

    bpGroups.push({
      group: bpGroup,
      baseA,
      baseB,
      index: idx,
      baseY: y,
      baseAngle: angle,
      pairGroup,
      sugarA,
      sugarB,
      phosA,
      phosB,
    });
  });

  // 5. Baza prej druri & boshti i çelikut
  let standGroup = null;
  if (includeStand) {
    standGroup = buildWoodenStand(totalHeight, { mats });
    root.add(standGroup);
  }

  root.scale.setScalar(scale);

  // Numërojmë atomet dhe lidhjet
  let bondCount = 0;
  root.traverse((obj) => {
    if (obj.isMesh && obj.userData?.isAtom) atomCount++;
    if (obj.isMesh && obj.userData?.isBond) bondCount++;
  });

  return {
    group: root,
    helixGroup,
    standGroup,
    platesGroup,
    backboneBondsGroup,
    bpGroups,
    materials: mats,
    stats: {
      basePairs: sequence.length,
      turns: +(sequence.length / 10.5).toFixed(2),
      atoms: atomCount,
      bonds: bondCount,
      heightAngstroms: +(sequence.length * RISE).toFixed(1),
      diameterAngstroms: 20.0,
    },
  };
}
