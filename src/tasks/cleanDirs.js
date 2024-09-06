const cleanDirs = async (config, files) => {
  const { freshStart, getInputFilePath, getOutputFilePath } = config;
  const { cleanDir } = files;

  if (!freshStart) {
    console.log('Skipping clean directories...');
    return;
  }

  console.log('Cleaning directories...');

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

  console.log('Directories cleaned.');
};

export default cleanDirs;
