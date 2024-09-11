import fetch from 'node-fetch';

/**

 * Fetches CTDL data from a single schema URL and returns the JSON.
 *


 * @param {string} url - The schema URL
 * @returns {Promise<Object>} - A promise that resolves to the schema data
 */

const fetchSchema = async url => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} for URL: ${url}`);
    }
    const content = await response.json();
    return content['@graph'];
  } catch (error) {
    console.error('Error fetching CTDL data:', error.message);
    throw error;
  }
};

export default fetchSchema;
