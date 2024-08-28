import { config, files, http } from '../utils/index.js';

const { remote, raw } = config;
const { checkFileExists, createFile } = files;
const { getURL } = http;

const replaceColonsInKeysAndValues = obj => {
  if (Array.isArray(obj)) {
    // If the object is an array, recursively process each element
    return obj.map(item => replaceColonsInKeysAndValues(item));
  } else if (typeof obj === 'object' && obj !== null) {
    // If the object is a plain object, recursively process each key-value pair
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        // Replace colons in the key
        const newKey = key.replace(/:/g, '_');
        // Recursively process the value
        return [newKey, replaceColonsInKeysAndValues(value)];
      })
    );
  } else if (typeof obj === 'string') {
    // Replace colons in string values
    return obj.replace(/:/g, '_');
  }
  // Return the value unchanged for other data types
  return obj;
};
const downloadSchema = async () => {
  const entries = Object.entries(remote);
  for (const [key, url] of entries) {
    const fileName = raw[key];

    console.log('Download schema from', url);

    if (!(await checkFileExists(fileName))) {
      const content = (await getURL(url))['@graph'];
      const replacedContent = replaceColonsInKeysAndValues(content);
      const jsonContent = JSON.stringify(replacedContent);

      console.log(jsonContent);
      await createFile(fileName, jsonContent);
    }
  }
};

export default downloadSchema;
