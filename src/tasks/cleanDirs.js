import config from '../utils/config.js';
import files from '../utils/files.js';

const { output } = config;
const { cleanDir } = files;
const cleanDirs = async () => {
  await cleanDir(output);
};

export default cleanDirs;
