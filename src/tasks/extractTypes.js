const extractTypes = (results) => {
	return results
		.filter((result) => result['@type'] === 'rdfs:Class')
		.map((result) => ({
			name: result['@id'],
			extends: result['rdfs:subClassOf'] || '',
			comment: result['rdfs:comment']?.['en-US'] || '',
			description: result['dct:description']?.['en-US'] || '',
			changeHistory: result['meta.changeHistory'] || '',
			fields: result['meta:domainFor'],
		}));
};

export default extractTypes;
