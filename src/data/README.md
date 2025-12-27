This folder contains generated graph JSON files created from public datasets.

- `disease_symptom_graph.json` — disease/symptom graph used by the app.

How to regenerate:
1. Download the Kaggle dataset `choongqianzheng/disease-and-symptoms-dataset` using the Kaggle CLI or your preferred method.
2. Place the dataset file (e.g., `disease_symptom.csv`) somewhere accessible.
3. Run `node scripts/convert-disease-symptom.js --input /path/to/disease_symptom.csv --output src/data/disease_symptom_graph.json`

See `scripts/convert-disease-symptom.js` for details.
