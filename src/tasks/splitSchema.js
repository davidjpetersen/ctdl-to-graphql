import { config, files } from '../utils/index.js';
const { raw, getInputFilePath, replacer } = config;
const { readFile, createFile } = files;
const splitSchema = async () => {
	for (const key in raw) {
		const schema = await readFile(raw[key]);
		const properties = JSON.parse(schema);

		for (const property of properties) {
			const fileName = property['@id']?.replace(':', '/') || '';
			createFile(
				getInputFilePath(`${fileName}.json`),
				JSON.stringify(property) // Use null instead of replacer
			);
		}
	}
};

export default splitSchema;
