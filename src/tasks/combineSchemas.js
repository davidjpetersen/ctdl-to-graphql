import config from '../utils/config.js';
import files from '../utils/files.js';
const { createFile } = files;
const { output } = config;

// Function to combine schema files into one
const combineSchemaFiles = async () => {
  // Combine file contents
  const schemaContent = schemaFiles.reduce((acc, file) => {
    try {
      const fileContent = fs.readFileSync(file, 'utf8');
      return acc + fileContent + '\n';
    } catch (error) {
      console.error(`Error reading file ${file}: ${error.message}`);
      return acc;
    }
  }, '');

  await createFile(`${output.folderPath}/schema.graphql`, schemaContent);
};

export default combineSchemaFiles;
