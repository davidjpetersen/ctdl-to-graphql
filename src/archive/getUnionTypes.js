import { config, files } from '../utils/index.js';

const { raw, getInputFilePath } = config;
const { readFile, createFile } = files;
const getUnionTypes = async () => {
	const keys = Object.keys(raw);
	console.log(keys);
	// Loop through each json file in the raw object
	for (const key in raw) {
		const contents = await readFile(raw[key]);
		const properties = JSON.parse(contents);
		const unionPropertyTypes = properties
			.filter((property) => property['meta:domainFor']?.length > 1)
			.map(
				(property) =>
					`union ${property['@id']}Union = ${property['meta:domainFor'].join(
						' | '
					)}`
			);
		const unions = unionPropertyTypes.join('\n');
		await createFile(getInputFilePath('/graphql/unions.graphql'), unions);
	}
};

export default getUnionTypes;
