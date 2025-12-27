#!/usr/bin/env node
/*
CommonJS variant of convert-disease-symptom script for Node when package.json type=module.
*/

const fs = require('fs');
const path = require('path');
// Simple argv parsing (no external deps required)
const rawArgs = process.argv.slice(2);
function getArg(name) {
  const idx = rawArgs.indexOf(name);
  if (idx === -1) return undefined;
  const val = rawArgs[idx + 1];
  if (!val || val.startsWith('--')) return true;
  return val;
}

const argv = {
  input: getArg('--input'),
  precautions: getArg('--precautions'),
  output: getArg('--output') || 'public/data/disease_symptom_graph.json',
  syncToFunction: getArg('--syncToFunction') !== undefined
};

if (!argv.input) {
  console.error('Usage: node scripts/convert-disease-symptom.cjs --input <file> [--precautions <file>] [--output <path>] [--syncToFunction]');
  process.exit(1);
}

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split(',').map(h => h.trim());
  return lines.map(line => {
    const parts = line.split(',').map(p => p.trim());
    const obj = {};
    header.forEach((h, i) => { obj[h] = parts[i] || ''; });
    return obj;
  });
}

const inputPath = path.resolve(argv.input);
if (!fs.existsSync(inputPath)) {
  console.error('Input file does not exist:', inputPath);
  process.exit(1);
}

const raw = fs.readFileSync(inputPath, 'utf8');
const rows = parseCSV(raw);

const diseaseCol = Object.keys(rows[0]).find(k => /disease/i.test(k));
if (!diseaseCol) {
  console.error('Could not detect disease column. Columns:', Object.keys(rows[0]));
  process.exit(1);
}

const symptomCols = Object.keys(rows[0]).filter(k => /symptom/i.test(k));
let explicitSymptomMode = true;
if (symptomCols.length === 0) explicitSymptomMode = false;

const diseaseStats = new Map();
const globalSymptoms = new Map();

function cleanId(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

rows.forEach((r) => {
  const diseaseRaw = (r[diseaseCol] || '').trim();
  if (!diseaseRaw) return;
  const diseaseName = diseaseRaw;
  if (!diseaseStats.has(diseaseName)) diseaseStats.set(diseaseName, { rows: 0, symptomCounts: new Map() });
  const entry = diseaseStats.get(diseaseName);
  entry.rows += 1;

  const symptomValues = [];
  if (explicitSymptomMode) {
    symptomCols.forEach(col => { const v = (r[col] || '').trim(); if (v) symptomValues.push(v); });
  } else {
    Object.keys(r).forEach(col => {
      if (col === diseaseCol) return;
      const v = (r[col] || '').trim();
      if (v) symptomValues.push(v);
    });
  }

  symptomValues.forEach(cell => {
    cell.split(/[;|,]/).map(s => s.trim()).filter(Boolean).forEach(sym => {
      const sid = cleanId(sym);
      if (!sid) return;
      globalSymptoms.set(sid, { id: sid, name: sym, category: 'symptom' });
      const sc = entry.symptomCounts.get(sid) || 0;
      entry.symptomCounts.set(sid, sc + 1);
    });
  });
});

const precautionsMap = new Map();
if (argv.precautions) {
  const precPath = path.resolve(argv.precautions);
  if (!fs.existsSync(precPath)) {
    console.warn('Precautions file not found at', precPath, '- continuing without precautions');
  } else {
    try {
      const rawPrec = fs.readFileSync(precPath, 'utf8');
      const precRows = parseCSV(rawPrec);
      const precDiseaseCol = Object.keys(precRows[0]).find(k => /disease/i.test(k));
      const precCols = Object.keys(precRows[0]).filter(k => /precaution/i.test(k));
      precRows.forEach(r => {
        const d = (r[precDiseaseCol] || '').trim();
        if (!d) return;
        const precs = precCols.map(c => (r[c] || '').trim()).filter(Boolean);
        if (precs.length > 0) precautionsMap.set(d, precs);
      });
    } catch (err) {
      console.warn('Error parsing precautions file, ignoring:', err.message);
    }
  }
}

const diseaseNodes = [];
const symptomNodes = Array.from(globalSymptoms.values());
const edges = [];

for (const [diseaseName, stats] of diseaseStats.entries()) {
  const did = cleanId(diseaseName);
  const node = { id: did, name: diseaseName, category: 'disease' };
  const precs = precautionsMap.get(diseaseName);
  if (precs) node.precautions = precs;
  diseaseNodes.push(node);

  for (const [sid, count] of stats.symptomCounts.entries()) {
    const weight = +(count / stats.rows).toFixed(3);
    edges.push({ source: did, target: sid, type: 'symptom_of', weight });
  }
}

const nodes = [...diseaseNodes, ...symptomNodes];
const graph = { nodes, edges };

const outPath = path.resolve(argv.output);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(graph, null, 2), 'utf8');
console.log('Graph written to', outPath);

if (argv.syncToFunction) {
  try {
    const target = path.resolve('supabase/functions/predict-diseases/disease_symptom_graph.json');
    fs.writeFileSync(target, JSON.stringify(graph, null, 2), 'utf8');
    console.log('Also wrote graph to', target);
  } catch (err) {
    console.warn('Could not sync to function folder:', err.message);
  }
}
