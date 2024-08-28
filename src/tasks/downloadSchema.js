import { config, files, http } from '../utils/index.js';

const { remote, raw, regex } = config;
const { checkFileExists, createFile } = files;
const { getURL } = http;
const { COLON_REGEX } = regex;

const replaceColons = item => {
  if (Array.isArray(item)) {
    return item.map(replaceColons);
  }
  if (typeof item === 'object' && item !== null) {
    return Object.fromEntries(
      Object.entries(item).map(([key, value]) => [
        key.replace(COLON_REGEX, '_'),

        replaceColons(value),
      ])
    );
  }
  if (typeof item === 'string') {
    return item.replace(COLON_REGEX, '_');
  }
  return item;
};

const downloadSchema = async () => {
  for (const [key, url] of Object.entries(remote)) {
    const fileName = raw[key];
    console.log('Download schema from', url);

    if (await checkFileExists(fileName)) continue;

    const content = (await getURL(url))['@graph'];
    const cleanedContent = replaceColons(content);
    const jsonContent = JSON.stringify(cleanedContent);

    console.log(jsonContent);
    await createFile(fileName, jsonContent);
  }
};

export default downloadSchema;
