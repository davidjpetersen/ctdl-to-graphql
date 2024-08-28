import { config, files } from '../utils/index.js';
const { raw, getInputFilePath, replacer } = config;
const { readFile, createFile } = files;
const splitSchema = async () => {
  for (const key in raw) {
    // console.log('Beginning to split schema for', key);
    const schema = await readFile(raw[key]);
    const properties = JSON.parse(schema);

    for (const property of properties) {
      const typeSegment = property['@type']?.replace(':', '/') || '';
      const idSegment = property['@id']?.replace(':', '/') || '';
      const fileName = `${typeSegment}/${idSegment}.json`;
      // console.log(fileName);

      await createFile(
        getInputFilePath(fileName),
        JSON.stringify(property, null, 2)
      );
    }
  }
};

export default splitSchema;
