import fs from 'fs';

// Create the file at the filePath and write the contents to it
const createFile = (outputFilePath, contents) => {
	fs.writeFileSync(outputFilePath, contents);
};

// Create a folder at the folderPath if it doesn't exist
const createFolder = (folder) => {
	if (!fs.existsSync(folder)) {
		fs.mkdirSync(folder);
	}
};

// Delete the file at the filePath if it exists
const deleteFile = (filePath) => {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
	}
};

// Delete the folder at the filePath if it exists
const deleteFolder = (filePath) => {
	if (fs.existsSync(filePath)) {
		fs.rm(filePath, { recursive: true, force: true }, (err) => {
			if (err) {
				console.error('Failed to delete folder:', err);
			}
		});
	}
};

export { createFile, createFolder, deleteFile, deleteFolder };
