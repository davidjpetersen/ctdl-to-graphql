import fetch from 'node-fetch';

/**
 * Fetches the content from the provided URL and returns the parsed JSON response.
 *
 * @param {string} url - The URL to fetch the content from.
 * @returns {Promise<Object>} - The parsed JSON response.
 * @throws {Error} - If the HTTP response is not successful.
 */
const fetchJSON = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    const errorMessage = `HTTP error! status: ${response.status} for URL: ${url}. Response: ${await response.text()}`;
    throw new Error(errorMessage);
  }
  return response.json();
};

/**
 * Processes a single schema by downloading the schema file from the provided URL and returning the parsed schema content.
 *
 * @param {Object} schema - The schema object containing the name and URL of the schema to process.
 * @param {Object} config - Configuration object containing utility functions and extensions.
 * @param {Object} files - Object containing file-related utility functions.
 * @returns {Promise<Object>} - The parsed schema content.
 */
const getSchema = async (
  { name, url },
  { getInputFilePath, extensions },
  { checkFileExists, readFile, createFile }
) => {
  const schemaPath = getInputFilePath(`${name}${extensions.JSON_EXTENSION}`);

  if (await checkFileExists(schemaPath)) {
    const schemaContent = await readFile(schemaPath);
    return JSON.parse(schemaContent);
  }

  const content = await fetchJSON(url);
  await createFile(schemaPath, JSON.stringify(content['@graph'], null, 2));
  return content;
};

export default { fetchJSON, getSchema };
