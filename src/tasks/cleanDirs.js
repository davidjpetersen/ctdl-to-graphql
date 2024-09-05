import config from '../utils/config.js';
import files from '../utils/files.js';

const { output } = config;
const { cleanDir } = files;
const cleanDirs = async (files, output) => {
  await cleanDir(output);
};

export default cleanDirs;
