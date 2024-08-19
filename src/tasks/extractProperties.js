import config from '../config.js';

const { mappings } = config;

const extractProperties = (results) => {
	return results
		.filter((result) => result['@type'] === 'rdf:Property')
		.map((result) => ({
			name: result['@id'],
			extends: result['rdfs:subClassOf'] || '',
			comment: result['rdfs:comment']?.['en-US'] || '',
			description: result['dct:description']?.['en-US'] || '',
			changeHistory: result['meta.changeHistory'] || '',
			usedBy: result['schema:domainIncludes'],
			allowedValues: result['schema:rangeIncludes'],
		}));
};

export default extractProperties;
