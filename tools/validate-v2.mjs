import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const errors = [];
const required = [
  'COFantasy-V2.0.0.js', 'CoFItem-V2.0.0.js', 'COAlaric-V2.0.0.js',
  'ChroniquesOubliees-Sheet.html', 'ChroniquesOubliees-Sheet.css',
  'Catalogue_Objets_Magiques_V2.xlsx', 'Catalogue_pricing_model.json', 'Monster_Creator_V2.xlsx',
  'README.md', 'docs/COMMANDES_REFERENCE.md', 'docs/PREDICATS_REFERENCE.md',
  'docs/AFFIXES_REFERENCE.md', 'docs/MONSTER_CREATOR.md'
];
for (const file of required) if (!fs.existsSync(path.join(root, file))) errors.push(`Fichier absent: ${file}`);

const scripts = ['COFantasy-V2.0.0.js', 'CoFItem-V2.0.0.js', 'COAlaric-V2.0.0.js'];
for (const file of scripts) {
  try { new vm.Script(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file }); }
  catch (error) { errors.push(`${file}: ${error.message}`); }
}

let model;
try { model = JSON.parse(fs.readFileSync(path.join(root, 'Catalogue_pricing_model.json'), 'utf8')); }
catch (error) { errors.push(`Catalogue_pricing_model.json: ${error.message}`); }

if (model) {
  if (!model.bases || !model.affixes || !model.qualityReferencePO || !model.powerReferencePO) errors.push('Modèle de prix incomplet.');
  if (model.affixes?.A112?.p !== 2) errors.push('A112 doit être P2.');
  const qExpected = [3,10,30,90,300], pExpected = [4,15,50,180,600];
  if (JSON.stringify(Object.values(model.qualityReferencePO).map(Number)) !== JSON.stringify(qExpected)) errors.push('Courbe Q inattendue.');
  if (JSON.stringify(Object.values(model.powerReferencePO).map(Number)) !== JSON.stringify(pExpected)) errors.push('Courbe P inattendue.');

  const source = fs.readFileSync(path.join(root, 'CoFItem-V2.0.0.js'), 'utf8');
  const marker = 'var COI_ECONOMY_20261003 =';
  const index = source.indexOf(marker);
  if (index < 0) errors.push('Modèle embarqué CoFItem introuvable.');
  else {
    let start = source.indexOf('{', index), depth = 0, string = null, escaped = false, end = -1;
    for (let i = start; i < source.length; i++) {
      const c = source[i];
      if (string) {
        if (escaped) { escaped = false; continue; }
        if (c === '\\') { escaped = true; continue; }
        if (c === string) string = null;
        continue;
      }
      if (c === '"' || c === "'" || c === '`') { string = c; continue; }
      if (c === '{') depth++;
      else if (c === '}' && --depth === 0) { end = i + 1; break; }
    }
    try {
      const embedded = vm.runInNewContext(`(${source.slice(start, end)})`);
      const compare = (a, b) => JSON.stringify(a) === JSON.stringify(b);
      const qPA=[0,...Object.values(model.qualityReferencePO).map(v=>Number(v)*100)], pPA=[0,...Object.values(model.powerReferencePO).map(v=>Number(v)*100)];
      if (!compare(embedded.qPA, qPA) || !compare(embedded.pPA, pPA)) errors.push('Dérive des courbes Q/P embarquées.');
      for (const [id, base] of Object.entries(model.bases)) {
        const e = embedded.bases[id];
        if (!e || Math.abs(e[0] - base.basePA) > 1e-12 || Math.abs(e[1] - base.difficulty) > 1e-12 || e[2] !== (base.qualityAllowed ? 1 : 0)) { errors.push(`Dérive base: ${id}`); break; }
      }
      for (const [id, affix] of Object.entries(model.affixes)) {
        const e = embedded.affixes[id];
        if (!e || e[0] !== affix.p || Math.abs(e[1] - affix.coef) > 1e-12 || Math.abs(e[2] - affix.noise) > 1e-12) { errors.push(`Dérive affixe: ${id}`); break; }
      }
    } catch (error) { errors.push(`Lecture modèle embarqué: ${error.message}`); }
  }
}

// Smoke-load the three scripts in a minimal Roll20-like sandbox. This executes top-level initialization
// without running a campaign or a ready handler and catches missing globals introduced by refactoring.
try {
  const underscore = {
    reduce(o, f, init) { let a = init; if (Array.isArray(o)) o.forEach((v, i) => { a = f(a, v, i); }); else Object.keys(o || {}).forEach(k => { a = f(a, o[k], k); }); return a; },
    each(o, f) { if (Array.isArray(o)) o.forEach(f); else Object.keys(o || {}).forEach(k => f(o[k], k)); },
    map(o, f) { return Array.isArray(o) ? o.map(f) : Object.keys(o || {}).map(k => f(o[k], k)); },
    has(o, k) { return Object.prototype.hasOwnProperty.call(o || {}, k); },
    isEmpty(o) { return !o || (Array.isArray(o) ? o.length === 0 : Object.keys(o).length === 0); },
    size(o) { return Array.isArray(o) || typeof o === 'string' ? o.length : Object.keys(o || {}).length; },
    allKeys(o) { return Object.getOwnPropertyNames(o || {}); },
    bind(fn, self, ...args) { return fn.bind(self, ...args); },
    delay() { return 0; }, unescape(s) { return s; }
  };
  underscore.forEach = underscore.each;
  underscore.chain = o => ({ map(fn) { o = underscore.map(o, fn); return this; }, reduce(fn, init) { o = underscore.reduce(o, fn, init); return this; }, value() { return o; } });
  const sandbox = {
    console, _: underscore, log() {}, on() {}, sendChat() {}, state: {}, randomInteger() { return 1; }, playerIsGM() { return true; },
    findObjs() { return []; }, filterObjs() { return []; }, getObj() { return null; },
    createObj() { return { get() { return ''; }, set() {}, remove() {} }; }, Campaign() { return { get() { return ''; }, set() {} }; },
    getAttrByName() { return ''; }, setDefaultTokenForCharacter() {}, toFront() {}, toBack() {}, spawnFx() {}, spawnFxBetweenPoints() {}, sendPing() {},
    setTimeout() { return 0; }, clearTimeout() {}, setInterval() { return 0; }, clearInterval() {}, Date, Math, JSON
  };
  vm.createContext(sandbox);
  for (const file of scripts) new vm.Script(fs.readFileSync(path.join(root, file), 'utf8'), { filename: file }).runInContext(sandbox);
  if (!sandbox.COFantasy || !sandbox.COFantasyItems || !sandbox.COAlaric) errors.push('Exports globaux COFantasy/CoFItem/COAlaric incomplets après smoke-load.');
} catch (error) { errors.push(`Smoke-load Roll20: ${error.message}`); }

const coi = fs.existsSync(path.join(root, 'CoFItem-V2.0.0.js')) ? fs.readFileSync(path.join(root, 'CoFItem-V2.0.0.js'), 'utf8') : '';
if (!coi.includes('✅ <b>Transfert effectué.</b>')) errors.push('Confirmation de transfert CoFItem absente.');

for (const suffix of ['.raw', '.tmp.js', '.bak', '.old']) {
  const hits = fs.readdirSync(root).filter(name => name.endsWith(suffix));
  if (hits.length) errors.push(`Fichiers temporaires présents: ${hits.join(', ')}`);
}

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`Roll20Projet V2: validation OK (${Object.keys(model?.bases || {}).length} bases, ${Object.keys(model?.affixes || {}).length} affixes).`);
