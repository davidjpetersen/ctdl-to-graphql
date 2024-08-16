const extractTypes = (results) => {
	const types = [];
	for (const result of results) {
		if (result['@type'] === 'rdfs:Class') {
			types.push(result);
		}
	}
	return types;
};

export default extractTypes;
