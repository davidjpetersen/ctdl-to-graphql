import fetch from 'node-fetch';

const getURL = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `HTTP error! status: ${response.status} for URL: ${url}. Response: ${await response.text()}`
    );
  }
  return response.json();
};

export default {
  getURL,
};
