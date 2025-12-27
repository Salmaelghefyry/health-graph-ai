#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

const argv = yargs(hideBin(process.argv))
  .option('dataset', { type: 'string', demandOption: true })
  .option('out', { type: 'string', default: 'data/raw' })
  .help()
  .argv;

const outDir = path.resolve(argv.out);
fs.mkdirSync(outDir, { recursive: true });

console.log('Downloading dataset', argv.dataset, 'to', outDir);

const res = spawnSync('kaggle', ['datasets', 'download', '-d', argv.dataset, '--unzip', '-p', outDir], { stdio: 'inherit' });

if (res.error) {
  console.error('Error running kaggle CLI:', res.error);
  process.exit(1);
}

console.log('Download complete. Look in', outDir);
