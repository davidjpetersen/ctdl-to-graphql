const getPrimitiveTypes = async (ctx) => {
	const properties = JSON.parse(ctx.properties);
	ctx.primitives = properties
		.filter((property) => property.allowedValues.length === 1)
		.reduce((acc, { name, allowedValues }) => {
			acc[name] = allowedValues[0];
			return acc;
		}, {});

	const primitiveTypesContent = JSON.stringify(ctx.primitives, null, 2);
	await createFile(
		`${input.folderPath}/json/primitiveTypes.json`,
		primitiveTypesContent
	);
};

export default getPrimitiveTypes;
