const processCSVData = (results) => {
	const schemaTypes = {};
	const fieldTypes = {};
	results.forEach((row) => {
		const {
			'@id': typeName,
			'@type': typeCategory,
			meta_domainFor: fields,
			rdfs_subClassOf: subClassOf,
			rdfs_subPropertyOf: subPropertyOf,
			skos_broader: broader,
			dct_description: description,
			vann_usageNote: usageNote,
			schema_rangeIncludes: rangeIncludes,
		} = row;

		// Map the type of each rdf:Property
		if (typeCategory === 'rdf:Property') {
			fieldTypes[typeName] = rangeIncludes || 'String';
		}

		// Collect fields for each rdfs_Class
		if (typeCategory === 'rdfs:Class') {
			if (!schemaTypes[typeName]) {
				schemaTypes[typeName] = {
					fields: new Set(),
					parent: subClassOf || subPropertyOf || broader,
					description,
					usageNote,
				};
			}

			if (fields) {
				fields.split(',').forEach((field) => {
					schemaTypes[typeName].fields.add(field.trim());
				});
			}
		}
	});

	return { schemaTypes, fieldTypes };
};

export default processCSVData;
