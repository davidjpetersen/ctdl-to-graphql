import { GraphQLObjectType, printType } from 'graphql';
import { config, files } from '../utils/index.js';

const { extensions, types } = config;
const { RDFS_CLASS_FOLDER } = types;
const { JSON_EXTENSION, GRAPHQL_EXTENSION } = extensions;

// Function to create GraphQL fields from class fields
const createFields = classFields => {
  return classFields.reduce((acc, field) => {
    const fieldName = field.replace('ceterms:', '').replace(':', '_');
    acc[fieldName] = { type: 'String' }; // Placeholder, adjust type as needed
    return acc;
  }, {});
};

// Function to process each JSON file and convert it to a GraphQL type
const processJsonFile = async file => {
  try {
    const contents = await files.readFile(file);
    const parsedData = JSON.parse(contents);

    // Extract necessary fields from the JSON
    const {
      '@id': id = '',
      'rdfs:comment': { 'en-US': comment = '' } = {},
      'meta:domainFor': classFields = [],
      'meta:changeHistory': changeHistory = '',
    } = parsedData;

    const name = id.replace(':', '_');
    const description = `${name}\n${comment}\nChange history: ${changeHistory}`;
    const fields = createFields(classFields);

    // Create a new GraphQL ObjectType
    const newType = new GraphQLObjectType({ name, description, fields });

    return { newType, file };
  } catch (error) {
    console.error(`Error processing file ${file}:`, error);
    return null;
  }
};

// Main function to read files, process them, and save as GraphQL schema
const convertRdfsClassesToGraphQL = async () => {
  try {
    // Get all JSON files in the specified folder
    const jsonFiles = await files.getFolderFiles(RDFS_CLASS_FOLDER);
    const filteredFiles = jsonFiles.filter(file =>
      file.endsWith(JSON_EXTENSION)
    );

    // Process each JSON file and convert to GraphQL type
    const processedTypes = await Promise.all(
      filteredFiles.map(processJsonFile)
    );

    // Save each GraphQL type as a .graphql file
    await Promise.all(
      processedTypes.filter(Boolean).map(async ({ newType, file }) => {
        const filePath = file.replace(JSON_EXTENSION, GRAPHQL_EXTENSION);
        const schemaString = printType(newType);
        if (schemaString) {
          await files.createFile(filePath, schemaString);
        }
      })
    );
  } catch (error) {
    console.error('Error converting RDFS classes to GraphQL:', error);
  }
};

export default convertRdfsClassesToGraphQL;
