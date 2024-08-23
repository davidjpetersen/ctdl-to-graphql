import files from '../utils/files.js';
import config from '../utils/config.js';

const { output } = config;
const { cleanDir } = files;
const cleanDirs = async () => {
	await cleanDir(output.folderPath);
};

export default cleanDirs;
