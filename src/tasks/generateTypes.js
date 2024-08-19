import lookupType from './lookupType.js';
const generateTypes = (schemaTypes) => {
	if (
		!Array.isArray(schemaTypes) ||
		!schemaTypes.every((item) => typeof item === 'object')
	) {
		throw new Error(
			`Invalid input: schemaTypes must be an array of objects, found ${typeof schemaTypes}`
		);
	}

	const typeDefinitions = schemaTypes?.map((typeInfo) => {
		const { name, fields, parent, description, usageNote } = typeInfo;
		const parentExtension = parent ? ` extends ${parent}` : '';
		const comments = [
			description && `  # Description: ${description}`,
			usageNote && `  # Usage Note: ${usageNote}`,
		]
			.filter(Boolean)
			.join('\n');

		const fieldDefinitions = fields
			?.map((field) => {
				return `  ${field}: ${lookupType(field)}`;
			})
			.join('\n');

		return `
  type ${name}${parentExtension} @model {
  ${comments}
  ${fieldDefinitions}
  }`;
	});

	const schema = `
  schema {
	query: Query
  }
  
  ${typeDefinitions.join('\n')}
  `;

	return schema.trim();
};

export default generateTypes;
