const generateSchema = ({ schemaTypes, fieldTypes }) => {
	if (
		!schemaTypes ||
		typeof schemaTypes !== 'object' ||
		!fieldTypes ||
		typeof fieldTypes !== 'object'
	) {
		throw new Error(
			'Invalid input: schemaTypes and fieldTypes must be objects'
		);
	}

	const generateComments = ({ description, usageNote }) => {
		const descriptionComment = description
			? `  # Description: ${description}\n`
			: '';
		const usageNoteComment = usageNote ? `  # Usage Note: ${usageNote}\n` : '';
		return `${descriptionComment}${usageNoteComment}`;
	};

	const generateFields = (fields) =>
		fields
			.map((field) => {
				const fieldType = fieldTypes[field] || 'String';
				return `  ${field}: ${fieldType}`;
			})
			.join('\n');

	const generateType = ([typeName, type]) => {
		const { parent, fields, ...typeProps } = type;
		const parentExtension = parent ? ` extends ${parent}` : '';
		const comments = generateComments(typeProps);
		const fieldDefinitions = generateFields(fields);

		return `
  # Type: ${typeName}
  type ${typeName}${parentExtension} {
  ${comments}${fieldDefinitions}
  }`;
	};

	return Object.entries(schemaTypes).map(generateType).join('\n');
};

export default generateSchema;
