import fs from 'fs';
import path from 'path';

// Delete the contents of the output folder and recreate it.
const cleanDir = async (folderPath) => {
	await deleteFolder(folderPath);
	await createFolder(folderPath);
};

// Define a function that checks if a file exists at the filePath
const checkFileExists = async (filePath) => {
	return new Promise((resolve, reject) => {
		fs.access(filePath, fs.constants.F_OK, (err) => {
			if (err) {
				resolve(false);
			} else {
				resolve(true);
			}
		});
	});
};

// Create the file at the filePath and write the contents to it

const createFile = async (filePath, contents) => {
	const directory = path.dirname(filePath);
	await createFolder(directory);
	await fs.promises.writeFile(filePath, contents);
	return true;
};
// Create a folder at the folderPath if it doesn't exist
const createFolder = async (folder) => {
	if (!fs.existsSync(folder)) {
		console.log('Creating folder:', folder);
		await fs.promises.mkdir(folder, { recursive: true });
	}
	return Promise.resolve();
};

// Delete the file at the filePath if it exists
const deleteFile = async (filePath) => {
	if (fs.existsSync(filePath)) {
		await fs.promises.unlink(filePath);
	}
	return;
};

// Delete the folder at the filePath if it exists
const deleteFolder = async (filePath) => {
	if (fs.existsSync(filePath)) {
		return new Promise((resolve, reject) => {
			fs.rm(filePath, { recursive: true, force: true }, (err) => {
				if (err) {
					console.error('Failed to delete folder:', err);
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
};

// Read the contents of the file at the filePath
const readFile = async (filePath) => {
	try {
		const contents = await fs.promises.readFile(filePath, 'utf8');
		return contents;
	} catch (error) {
		console.error(`Error reading file ${filePath}:`, error);
		throw error;
	}
};

const getFolderFiles = async (folderPath) => {
	try {
		const entries = await fs.promises.readdir(folderPath, {
			withFileTypes: true,
		});
		let files = [];

		for (const entry of entries) {
			const fullPath = path.join(folderPath, entry.name);
			if (entry.isDirectory()) {
				const subFiles = await getFolderFiles(fullPath);
				files = files.concat(subFiles);
			} else {
				files.push(fullPath);
			}
		}

		return files;
	} catch (error) {
		console.error(`Error reading folder ${folderPath}:`, error);
		throw error;
	}
};

export default {
	checkFileExists,
	cleanDir,
	createFile,
	createFolder,
	deleteFile,
	deleteFolder,
	getFolderFiles,
	readFile,
};
