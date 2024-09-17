import { config, files } from '../../utils/index.js';

const cleanDirs = async () => {
  const { freshStart, getInputFilePath, getOutputFilePath } = config;
  const { cleanDir } = files;

  if (!freshStart) {
    console.log('Skipping clean directories...');
    return;
  }

  if (
    typeof getInputFilePath !== 'function' ||
    typeof getOutputFilePath !== 'function'
  ) {
    throw new Error(
      'Invalid config: getInputFilePath or getOutputFilePath is not a function'
    );
  }

  await Promise.all([
    cleanDir(getInputFilePath('')),
    cleanDir(getOutputFilePath('')),
  ]);
};

export default cleanDirs;
