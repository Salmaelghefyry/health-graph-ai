/*
Script: convert-disease-symptom.js
- Reads a disease-symptoms CSV (e.g., `DiseaseAndSymptoms.csv`) and an optional precautions CSV
  (e.g., `Disease precaution.csv`), and produces a graph JSON with nodes (diseases and symptoms)
  and weighted edges (disease -> symptom) where weights are symptom frequency per disease.

Usage:
  node scripts/convert-disease-symptom.js \
    --input src/data/DiseaseAndSymptoms.csv \
    --precautions "src/data/Disease precaution.csv" \
    --output public/data/disease_symptom_graph.json \
    --syncToFunction

Options:
  --input       required, path to disease-symptom CSV
  --precautions optional, path to precautions CSV (Disease,Precaution_1,...)
  --output      path to write generated JSON (default: public/data/disease_symptom_graph.json)
  --syncToFunction boolean flag to also copy output to supabase/functions/predict-diseases/

Notes:
- The converter uses simple CSV parsing suitable for this dataset; validate the result and adjust parsing if needed.
*/

const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('input', { type: 'string', demandOption: true, describe: 'Input disease-symptom CSV path' })
  .option('precautions', { type: 'string', describe: 'Optional precautions CSV path' })
  .option('output', { type: 'string', default: 'public/data/disease_symptom_graph.json', describe: 'Output JSON path' })
  .option('syncToFunction', { type: 'boolean', default: false, describe: 'Also write JSON to Supabase function folder' })
  .help()
  .argv;

function parseCSV(content) {
  const lines = content.split(/\r?\n/).filter(Boolean);
  const header = lines.shift().split(',').map(h => h.trim());
  return lines.map(line => {
    // naive split on comma — the dataset seems well-formed without quoted commas
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

// Identify symptom columns (columns whose header contains 'symptom' or columns after the first which are likely symptoms)
const symptomCols = Object.keys(rows[0]).filter(k => /symptom/i.test(k));
let explicitSymptomMode = true;
if (symptomCols.length === 0) {
  explicitSymptomMode = false; // symptoms are in multiple columns without 'symptom' in header
}

// Aggregation structures
const diseaseStats = new Map(); // diseaseName -> { count: nRows, symptomCounts: Map }
const globalSymptoms = new Map(); // symptomId -> { id, name }

function cleanId(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

rows.forEach((r) => {
  const diseaseRaw = (r[diseaseCol] || '').trim();
  if (!diseaseRaw) return;
  const diseaseName = diseaseRaw;
  if (!diseaseStats.has(diseaseName)) {
    diseaseStats.set(diseaseName, { rows: 0, symptomCounts: new Map() });
  }
  const entry = diseaseStats.get(diseaseName);
  entry.rows += 1;

  // Collect symptoms from explicit symptom columns or by taking all other columns
  const symptomValues = [];
  if (explicitSymptomMode) {
    symptomCols.forEach(col => { const v = (r[col] || '').trim(); if (v) symptomValues.push(v); });
  } else {
    // take all columns except diseaseCol
    Object.keys(r).forEach(col => {
      if (col === diseaseCol) return;
      const v = (r[col] || '').trim();
      if (v) symptomValues.push(v);
    });
  }

  // each symptom string might contain multiple comma/; separated values
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

// Optional: read precautions file mapping disease -> precautions[]
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

// Build nodes and edges
const diseaseNodes = [];
const symptomNodes = Array.from(globalSymptoms.values());
const edges = [];

for (const [diseaseName, stats] of diseaseStats.entries()) {
  const did = cleanId(diseaseName);
  const node = { id: did, name: diseaseName, category: 'disease' };
  const precs = precautionsMap.get(diseaseName);
  if (precs) node.precautions = precs;
  diseaseNodes.push(node);

  // For each symptom, compute weight = count / rows
  for (const [sid, count] of stats.symptomCounts.entries()) {
    const weight = +(count / stats.rows).toFixed(3);
    edges.push({ source: did, target: sid, type: 'symptom_of', weight });
  }
}

// Build canonical nodes list (diseases + symptoms)
const nodes = [...diseaseNodes, ...symptomNodes];

const graph = { nodes, edges };

// Write output
const outPath = path.resolve(argv.output);
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(graph, null, 2), 'utf8');
console.log('Graph written to', outPath);

// Optionally sync to Supabase function folder
if (argv.syncToFunction) {
  try {
    const target = path.resolve('supabase/functions/predict-diseases/disease_symptom_graph.json');
    fs.writeFileSync(target, JSON.stringify(graph, null, 2), 'utf8');
    console.log('Also wrote graph to', target);
  } catch (err) {
    console.warn('Could not sync to function folder:', err.message);
  }
}

