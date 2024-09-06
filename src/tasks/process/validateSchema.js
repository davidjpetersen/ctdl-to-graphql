const validateSchema = async (MERGED_FILE_PATH, files, schema) => {
  if (!(await files.checkFileExists(MERGED_FILE_PATH))) {
    throw new Error('Merged file does not exist. Please rerun.');
  }

  if (!schema.classes?.length || !schema.properties?.length) {
    throw new Error('Schema is empty.');
  }
};

export default validateSchema;
