import config from '../config.js';
import { checkFileExists, createFile } from './files.js';
import getURL from './getURL.js';
const { remote, raw, replacer } = config;
const downloadSchema = async () => {
	const entries = Object.entries(remote);

	for (const [key, url] of entries) {
		const fileName = raw[key];

		if (!(await checkFileExists(fileName))) {
			const content = (await getURL(url))['@graph'];
			const jsonContent = JSON.stringify(content, replacer, 2);
			await createFile(fileName, jsonContent);
		}
	}
};

export default downloadSchema;
