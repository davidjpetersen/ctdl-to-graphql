import { config } from '../../utils/index.js';
import fetch from 'node-fetch';
import { files } from '../../utils/index.js';

const { getInputFilePath } = config;
const { createFile } = files;

/**


 * Fetches CTDL data from a single schema URL, writes it to a file, and returns the JSON.
 *


 * @param {string} name - The name of the schema.
 * @param {string} url - The schema URL

 * @returns {Promise<Object>} - A promise that resolves to an object containing the schema name and data.
 */

const fetchAndStoreSchema = async (name, url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
    }

    const rawSchema = await response.json();
    const schemaToWrite = JSON.stringify(rawSchema['@graph'], null, 2);
    const filePath = getInputFilePath(`raw/${name}.json`);
    await createFile(filePath, schemaToWrite);
    return { name, schema: rawSchema['@graph'] };
  } catch (error) {
    console.error(`Error fetching or storing schema ${name}:`, error.message);
    throw error;
  }
};

export default fetchAndStoreSchema;
