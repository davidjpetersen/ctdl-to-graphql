import { parse, print, visit } from 'graphql';

/**
 * Cleans a GraphQL schema by removing any object types that have no fields and removing duplicate type definitions.
 * This can help reduce the size of the schema and prevent errors with AWS AppSync.
 *
 * @param {Object} ctx - The context object containing the schema to be cleaned.
 * @param {string} ctx.mappedSchema - The GraphQL schema to be cleaned.
 * @returns {string} - The cleaned GraphQL schema.
 */
const cleanSchema = async ctx => {
  const schema = ctx.mappedSchema;
  // Parse the schema into an AST
  const ast = parse(schema);

  // Use the visitor pattern to remove types without fields
  const schemaWithoutEmptyTypes = visit(ast, removeEmptyObjectTypes);

  // Remove duplicate types
  const schemaWithoutDuplicates = removeDuplicateTypes(schemaWithoutEmptyTypes);

  // Print the cleaned schema
  let cleanedSchema = print(schemaWithoutDuplicates);
  cleanedSchema = cleanedSchema.replace(/ &/g, ',');
  ctx.cleanedSchema = cleanedSchema;

  return cleanedSchema;
};

/**
 * Removes duplicate type definitions from a GraphQL AST.
 *
 * @param {Object} ast - The GraphQL AST to be cleaned.
 * @returns {Object} - The cleaned GraphQL AST without duplicate types.
 */
const removeDuplicateTypes = ast => {
  const typeMap = new Map();
  const definitions = [];

  for (const def of ast.definitions) {
    if (
      def.kind === 'ObjectTypeDefinition' ||
      def.kind === 'InterfaceTypeDefinition' ||
      def.kind === 'InputObjectTypeDefinition'
    ) {
      const typeName = def.name.value;
      if (!typeMap.has(typeName)) {
        typeMap.set(typeName, def);
        definitions.push(def);
      }
    } else {
      definitions.push(def);
    }
  }

  return {
    ...ast,
    definitions,
  };
};

/**
 * Visitor function that removes ObjectTypeDefinition nodes from a GraphQL AST if they have no fields.
 * This can help reduce the size of the schema and prevent errors with AWS AppSync.
 *
 * @param {Object} node - The GraphQL AST node being visited.
 * @returns {Object|null} - The node, or null if the node should be removed.
 */
const removeEmptyObjectTypes = {
  ObjectTypeDefinition(node) {
    if (!node.fields || node.fields.length === 0) {
      return null;
    }
    return node;
  },
};

export default cleanSchema;
