const generateTypes = (schemaTypes, primativeMappings) => {
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
				const typeDefinition = primativeMappings[field]
					? primativeMappings[field]
					: `${field}Union`;
				return `${field}: ${typeDefinition}`;
			})
			.join('\n');

		return `
  type ${name}${parentExtension} @model {
  ${comments}
  ${fieldDefinitions}
  }`;
	});

	const schema = typeDefinitions.join('\n');

	return schema.trim();
};

export default generateTypes;
