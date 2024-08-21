export const getTypesSchema = async (ctx) => {
	const types = JSON.parse(ctx.types);
	const primitiveMappings = ctx.primitives;
	const generatedTypes = await generateTypes(types, primitiveMappings);
	await createFile(
		`${input.folderPath}/graphql/generatedTypes.graphql`,
		generatedTypes
	);
};
