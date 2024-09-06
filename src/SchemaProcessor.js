import cleanDirs from './tasks/cleanDirs.js';
import loadSchemas from './tasks/loadSchemas.js';
export default class SchemaProcessor {
  constructor(config, files, http) {
    this.config = config;
    this.files = files;
    this.http = http;
    this.schema = { classes: [], properties: [] };
  }

  cleanDirs() {
    return cleanDirs(this.config, this.files);
  }

  loadSchemas() {
    this.schema = loadSchemas(this.config, this.files, this.http);
  }

  async processSchemas() {
    console.log('Processing schemas...');
  }
}
