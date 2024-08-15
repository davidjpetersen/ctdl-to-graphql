import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import csv from 'csv-parser';
const parseCSV = (csvFilePath) => {
	return new Promise((resolve, reject) => {
		const results = [];
		fs.createReadStream(csvFilePath)
			.pipe(csv())
			.on('data', (data) => results.push(data))
			.on('end', () => resolve(results))
			.on('error', reject);
	});
};

export default parseCSV;
