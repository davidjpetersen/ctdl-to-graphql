export const getUnionTypes = async (ctx) => {
	const properties = JSON.parse(ctx.properties);
	const unionPropertyTypes = properties
		.filter((property) => property.allowedValues.length > 1)
		.map(
			({ name, allowedValues }) =>
				`union ${name}Union = ${allowedValues.join(' | ')}`
		);
	ctx.unions = unionPropertyTypes.join('\n');
	await createFile(`${input.folderPath}/graphql/unions.graphql`, ctx.unions);
};
