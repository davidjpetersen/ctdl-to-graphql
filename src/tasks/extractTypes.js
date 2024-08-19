const extractTypes = (results) => {
	return results
		.filter((result) => result['@type'] === 'rdfs:Class')
		.map((result) => ({
			name: result['@id'],
			extends: result['rdfs:subClassOf / rdfs:subPropertyOf / skos:broader'],
			comment: result['rdfs:comment / skos:definition'],
			description: result['dct:description'],
			fields: result['meta:domainFor'].split('\n').map((field) => field),
		}));
};

export default extractTypes;
