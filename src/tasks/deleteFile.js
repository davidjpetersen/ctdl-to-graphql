import fs from 'fs';
// Delete the file at the filePath if it exists
const deleteFile = (filePath) => {
	if (fs.existsSync(filePath)) {
		fs.unlinkSync(filePath);
	}
};

export default deleteFile;
