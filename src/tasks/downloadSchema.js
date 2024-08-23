import { config, files, http } from '../utils/index.js';

const { remote, raw, replacer } = config;
const { checkFileExists, createFile } = files;
const { getURL } = http;
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
