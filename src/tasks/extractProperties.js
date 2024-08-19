import config from '../config.js';

const { mappings } = config;

const extractProperties = (results) => {
	return results
		.filter((result) => result['@type'] === 'rdf:Property')
		.map((result) => ({
			name: result['@id'],
			extends: result['rdfs:subClassOf / rdfs:subPropertyOf / skos:broader'],
			comment: result['rdfs:comment / skos:definition'],
			description: result['dct:description'],
			allowedValues: result['schema:rangeIncludes']
				?.split('\n')
				?.map((field) => {
					console.log(field);
					return mappings[field];
				}),
		}));
};

export default extractProperties;
