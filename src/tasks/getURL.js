// Get contents of URL using node-fetch
const getURL = async (url) => {
	const response = await fetch(url);
	const data = await response.json();
	return data;
};

export default getURL;
