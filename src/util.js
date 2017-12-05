const path = require('path');
const fs = require('fs');

// make directory deeply
const mkdirDeep = (distPath) => {
	distPath = path.join(distPath, '');
	if(!fs.existsSync(distPath)){
		const splitedDistPath = distPath.split(path.sep);
		splitedDistPath.reduce((res, dir, index) => {
			const dirPath = index ? res + '/' + dir : dir;
			if(!fs.existsSync(dirPath)){
				fs.mkdirSync(dirPath);
			}
			return dirPath;
		}, '');
	}
};

// copy file
const copyFile = (src, dist) => {
	//
};

// copy directory
const copyDir = (src, dist) => {
	//
};

// move file
const moveFile = (src, dist) => {
	//
};

// move directory
const moveDirectory = (src, dist) => {
	//
};

// is directory
const isDir = (file) => {
	return fs.statSync(file).isDirectory(file);
};

// is file
const isFile = (file) => {
	return fs.statSync(file).isFile(file);
};

module.exports = {
	mkdirDeep,
	copyFile,
	copyFile,
	isDir,
	isFile,
};