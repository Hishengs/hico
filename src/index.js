const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const webpack = require('webpack');
const util = require('./util.js');
const baseConfig = require('../build/base.config.js');
const devConfig = require('../build/dev.config.js');

class Hico {
	constructor (){
    this._env = 'development';
  	this.entry = {};
    this.targetDir = null;
    this.distDir = null;
    this.ignores = [];
    this.webpackConfig = null;
    this.webpackTempFile = path.join(__dirname, './webpack-temp.config.js');
  }

  // set target resources directory
  target (targetDir){
    // check if is directory and exists
    if(fs.existsSync(targetDir) && fs.statSync(targetDir).isDirectory(targetDir)){
      this.targetDir = targetDir;
      return this;
    }else throw new Error('invalid target');
  }

  // set dist output directory
  dist (distDir){
    // check if is directory and exists
    if(fs.existsSync(distDir) && fs.statSync(distDir).isDirectory(distDir)){
      this.distDir = distDir;
      return this;
    }else throw new Error('invalid dist');
  }

  // ignore resources
  ignore (ignores){
  	if(Array.isArray(ignores)){
      this.ignores = this.ignores.concat(ignores);
    }else this.ignores.push(ignores);
    return this;
  }

  // set env
  env (env){
    this._env = env;
    return this;
  }

  hash (data){
    const md5 = crypto.createHash("md5");
    md5.update(data);
    return md5.digest('hex');
  }

  recursiveFiles (dirPath){
    let paths = [];
    const files = fs.readdirSync(dirPath);
    for(let i=0, ilen=files.length; i<ilen; i++){
      const fileName = files[i];
      const filePath = path.join(dirPath, fileName);
      const isFile = fs.statSync(filePath).isFile();
      if(isFile){
        if(fileName.includes('entry.js')){
          paths.push(filePath);
        }
      }else {
        paths = paths.concat(this.recursiveFiles(filePath));
      }
    }
    return paths;
  }

  setEntry (){
    // find entry files and flatten to array
    const files = this.recursiveFiles(this.targetDir);
    files.forEach(file => {
      // hash file path to id
      this.entry[this.hash(file)] = file;
    });
  }

  buildMapFile (entry){
    const resourcesMap = {};
    for(let key of Object.keys(entry)){
      resourcesMap[entry[key]] = key;
    }
    fs.writeFileSync(path.join(process.cwd(), './resources-map.json'), JSON.stringify(resourcesMap, null, 2), { encoding: 'utf8' });
  }

  // build resources
  build (watch = false){
  	this.setEntry();

    this.webpackConfig = baseConfig({
      entry: this.entry,
      dist: this.distDir,
    });

    this.buildMapFile(this.entry);

    return this.webpackConfig;
  }

  // hot update
  hotUpdate (config = {}){
    this.setEntry();

    this.webpackConfig = devConfig({
      entry: this.entry,
      dist: this.distDir,
      devServer: config,
    });

    this.buildMapFile(this.entry);

    return this.webpackConfig;
  }
};

module.exports = Hico;