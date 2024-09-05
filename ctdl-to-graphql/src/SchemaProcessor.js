export default class SchemaProcessor {
  constructor(config, files) {
    this.config = config;
    this.files = files;

    this.schema = { classes: [], properties: [] };
  }

  /**
   * Cleans the input and output directories specified in the configuration object.
   * This method is responsible for removing any existing files or directories in the input and output paths.
   * It is skipped if the `freshStart` config option is falsy, which can be used to avoid unnecessary directory cleaning.
   */
  async cleanDirs() {
    /**
     * Skips cleaning the input and output directories if the `freshStart` config option is falsy.
     * This can be used to avoid unnecessary directory cleaning when the application is not starting from scratch.
     */
    const { freshStart, getInputFilePath, getOutputFilePath } = this.config;
    const { cleanDir } = this.files;

    if (!freshStart) {
      console.log('Skipping clean directories...');
      return;
    }
    console.log('Cleaning directories...');

    /**
     * Checks that the `getInputFilePath` and `getOutputFilePath` functions are defined in the configuration object.
     * If either function is not defined or not a function, an error is thrown.
     */
    if (!getInputFilePath || !getOutputFilePath) {
      throw new Error(
        'Invalid config: getInputFilePath or getOutputFilePath is not defined or not a function'
      );
    }

    /**
     * Cleans the input and output directories specified in the configuration object.
     * This method is responsible for removing any existing files or directories in the input and output paths.
     * It is skipped if the `freshStart` config option is falsy, which can be used to avoid unnecessary directory cleaning.
     */
    await Promise.all([
      cleanDir(getInputFilePath('')),
      cleanDir(getOutputFilePath('')),
    ]);
    console.log('Directories cleaned.');
  }

  async loadSchema() {
    try {
      const { schemas } = this.config;
      const { MERGED_FILE_PATH } = this.config.types;
