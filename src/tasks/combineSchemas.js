import config from '../utils/config.js';
import files from '../utils/files.js';
import path from 'path';

const { createFile, readFile, getFolderFiles, checkFileExists } = files;
const { output } = config;

async function combineSchemas() {
  try {
    // Read all files in the /data directory
    const allFiles = await getFolderFiles('./data');

    // Filter for .graphql files
    const graphqlFiles = allFiles.filter(file => file.endsWith('.graphql'));

    // Read and concatenate the contents of all .graphql files
    const schemaContents = await Promise.all(
      graphqlFiles.map(async file => {
        return await readFile(file, 'utf8');
      })
    );

    // Combine all schema contents
    const combinedSchema = schemaContents.join('\n\n');

    // Ensure the output path is a file, not a directory
    const outputFile = path.join(output, 'schema.graphql');

    // Check if the file already exists
    const fileExists = await checkFileExists(outputFile);

    // Write the combined schema to the output file
    await createFile(outputFile, combinedSchema);

    // console.log(`Combined schema written to ${outputFile}`);
  } catch (error) {
    console.error('Error combining schemas:', error);
    throw error;
  }
}

export default combineSchemas;
