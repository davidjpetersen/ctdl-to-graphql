const extractProperties = (results) => {
	const properties = [];
	for (const result of results) {
		if (result['@type'] === 'rdf:Property') {
			properties.push(result);
		}
	}
	return;
};
export default extractProperties;
