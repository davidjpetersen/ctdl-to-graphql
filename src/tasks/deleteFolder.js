import fs from 'fs';

// Delete the folder at the filePath if it exists
const deleteFolder = (filePath) => {
	if (fs.existsSync(filePath)) {
		fs.rmdirSync(filePath, { recursive: true });
	}
};

export default deleteFolder;
