/**
 * Gjeneruesi i skedarëve 3D .glb për projektin Biologji ADN
 * Ekzekuton Three.js GLTFExporter në Node.js për të krijuar modelin e plotë dhe pjesët modulare.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import {
  buildFullDNA,
  buildPhosphateGroup,
  buildDeoxyribose,
  buildBase,
  buildBasePair,
  buildNucleotide,
  buildWoodenStand,
} from '../src/dnaBuilder.js';

// Polyfill minimal FileReader për GLTFExporter në Node.js
if (typeof globalThis.FileReader === 'undefined') {
  globalThis.FileReader = class FileReader {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then((buf) => {
        this.result = buf;
        if (typeof this.onloadend === 'function') this.onloadend();
      });
    }
    readAsDataURL(blob) {
      blob.arrayBuffer().then((buf) => {
        const b64 = Buffer.from(buf).toString('base64');
        this.result = `data:${blob.type || 'application/octet-stream'};base64,${b64}`;
        if (typeof this.onloadend === 'function') this.onloadend();
      });
    }
  };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = path.resolve(__dirname, '..', 'models');
fs.mkdirSync(MODELS_DIR, { recursive: true });

const exporter = new GLTFExporter();

function exportGLB(object3D, filename) {
  return new Promise((resolve, reject) => {
    exporter.parse(
      object3D,
      (result) => {
        const outPath = path.join(MODELS_DIR, filename);
        const buffer = Buffer.from(result);
        fs.writeFileSync(outPath, buffer);
        const kb = (buffer.length / 1024).toFixed(1);
        console.log(`  ✓ ${filename.padEnd(24)} (${kb} KB)`);
        resolve({ filename, bytes: buffer.length, kb: Number(kb) });
      },
      (err) => reject(err),
      { binary: true }
    );
  });
}

async function main() {
  console.log('\n🧬 Duke gjeneruar skedarët 3D .glb të ADN-së me Three.js...\n');

  const manifest = [];

  // 1. Modeli i plotë i ADN-së me bazë druri (si në foton Indigo Instruments)
  const fullDNA = buildFullDNA({ includeStand: true, colorMode: 'cpk', detail: 'standard' });
  manifest.push({
    ...(await exportGLB(fullDNA.group, 'adn_full.glb')),
    title: 'Modeli i Plotë i ADN-së (22 bp + Bazë Druri)',
    category: 'complete',
    stats: fullDNA.stats,
  });

  // 2. Heliksi i plotë i ADN-së pa bazën fizike
  const helixOnly = buildFullDNA({ includeStand: false, colorMode: 'cpk', detail: 'standard' });
  manifest.push({
    ...(await exportGLB(helixOnly.group, 'adn_helix_only.glb')),
    title: 'Heliksi i Dyfishtë i B-ADN (Pa Bazë)',
    category: 'complete',
    stats: helixOnly.stats,
  });

  // 3. Pjesët modulare atomike (të shkallëzuara mirë për inspektim)
  const modularParts = [
    { file: 'grup_fosfat.glb', title: 'Grupi Fosfat (PO₄³⁻)', obj: buildPhosphateGroup({ detail: 'high' }) },
    { file: 'deoksiriboze.glb', title: 'Sheqeri 2′-Deoksiribozë (C₅H₁₀O₄)', obj: buildDeoxyribose({ detail: 'high' }) },
    { file: 'adenine.glb', title: 'Baza Azotike Adenina (A)', obj: buildBase('A', { detail: 'high' }) },
    { file: 'timine.glb', title: 'Baza Azotike Timina (T)', obj: buildBase('T', { detail: 'high' }) },
    { file: 'guanine.glb', title: 'Baza Azotike Guanina (G)', obj: buildBase('G', { detail: 'high' }) },
    { file: 'citozine.glb', title: 'Baza Azotike Citozina (C)', obj: buildBase('C', { detail: 'high' }) },
    { file: 'nukleotid_A.glb', title: 'Nukleotid i Plotë (dAMP)', obj: buildNucleotide('A', { detail: 'high' }) },
    { file: 'cift_AT.glb', title: 'Çifti Komplementar A=T (2 Lidhje H)', obj: buildBasePair('A', { detail: 'high' }) },
    { file: 'cift_GC.glb', title: 'Çifti Komplementar G≡C (3 Lidhje H)', obj: buildBasePair('G', { detail: 'high' }) },
    { file: 'baza_druri.glb', title: 'Baza e Drurit dhe Boshti i Çelikut', obj: buildWoodenStand(76) },
  ];

  for (const part of modularParts) {
    part.obj.scale.setScalar(0.35);
    manifest.push({
      ...(await exportGLB(part.obj, part.file)),
      title: part.title,
      category: 'part',
    });
  }

  fs.writeFileSync(
    path.join(MODELS_DIR, 'manifest.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), models: manifest }, null, 2),
    'utf8'
  );

  console.log(`\n✅ U gjeneruan ${manifest.length} skedarë .glb dhe manifest.json në ./models/\n`);
}

main().catch((err) => {
  console.error('Gabim gjatë gjenerimit të .glb:', err);
  process.exit(1);
});
