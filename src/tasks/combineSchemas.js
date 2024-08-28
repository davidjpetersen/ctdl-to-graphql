import config from '../utils/config.js';
import files from '../utils/files.js';

const { createFile, readFile } = files;
const { output } = config;

// Function to combine schema files into one

const combineSchemaFiles = async schemaFiles => {
  if (!Array.isArray(schemaFiles) || schemaFiles.length === 0) {
    throw new Error('Invalid or empty schemaFiles array');
  }

  try {
    // Combine file contents
    const schemaContents = await Promise.all(schemaFiles.map(readFile));
    const schemaContent = schemaContents.join('\n');

    const outputFileName = config.output.schemaFileName || 'schema.graphql';
    await createFile(`${output.folderPath}/${outputFileName}`, schemaContent);
    return true;
  } catch (error) {
    console.error(`Error combining schema files: ${error.message}`);
    return false;
  }
};

export default combineSchemaFiles;
