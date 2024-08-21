import fs from 'fs';
import path from 'path';
import config from './config.js';

const { output } = config;

// Delete the contents of the output folder and recreate it.
const cleanDirectories = async () => {
	await deleteFolder(output.folderPath);
	await createFolder(output.folderPath);
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

export default {
	checkFileExists,
	cleanDirectories,
	createFile,
	createFolder,
	deleteFile,
	deleteFolder,
	readFile,
};
