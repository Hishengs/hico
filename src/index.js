const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const webpack = require('webpack');
const util = require('./util.js');
const webpackConfig = require('../build/base.config.js');

class Hico {
	constructor (){
  	this.entry = {};
    this.targetDir = null;
    this.distDir = null;
    this.ignores = [];
    this.webpackConfig = webpackConfig;
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

  // build resources
  build (){
  	// find entry files and flatten to array
    const files = this.recursiveFiles(this.targetDir);
    files.forEach(file => {
      // hash file path to id
      this.entry[this.hash(file)] = file;
    });
    console.log(JSON.stringify(this.entry, null, 2));
    return;
    const compiler = webpack(this.webpackConfig);
    compiler.run((err, stats) => {
      if(err){
        console.error(err);
        return;
      }
      const info = stats.toJson();
      if(stats.hasErrors()){
        console.error(info.errors);
      }else if(stats.hasWarnings()){
        console.warn(info.warnings);
      }else {
        // build done
        console.log('build done.');
      }
    });
    return this;
  }

  // build resources then watching for changes
  watch (){
  	//
  }
};

module.exports = Hico;