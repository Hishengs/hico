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
    this.ignoreFiles = [];
    this.webpackConfig = null;
  }

  // set target resources directory
  target (targetDir){
    // check if is directory and exists
    if(fs.existsSync(targetDir) && util.isDir(targetDir)){
      this.targetDir = targetDir;
      return this;
    }else throw new Error('invalid target');
  }

  // set dist output directory
  dist (distDir){
    // check if is directory and exists
    if(!fs.existsSync(distDir)){
      // create dist dir
      fs.mkdirSync(distDir);
    }else {
      if(!util.isDir(distDir)){
        throw new Error('invalid dist directory');
      }
    }
    this.distDir = distDir;
    return this;
  }

  // ignore files
  ignore (ignoreFiles){
    this.ignoreFiles = [].concat(ignoreFiles).map(file => {
      return path.normalize(file);
    });
    return this;
  }

  // extract files
  extractFiles (files){
    let _files = [];
    files.forEach(file => {
      file = path.normalize(file);
      if(_files.includes(file))return;
      if(util.isDir(file)){
        // _files.push(file);
        _files = _files.concat(this.getDirFiles(file));
      }else if(util.isFile(file)){
        _files.push(file);
      }else if((/(\/\*\/)+\*\./).test(file)){
        // may be like this '/xx/yy/*.js'
      }
    });
    return _files;
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

  getDirFiles (dirPath, match = null){
    let paths = [];
    const files = fs.readdirSync(dirPath);
    for(let i=0, ilen=files.length; i<ilen; i++){
      const fileName = files[i];
      const filePath = path.join(dirPath, fileName);
      const isFile = fs.statSync(filePath).isFile();
      if(isFile){
        if(match){
          if(match(filePath)){
            paths.push(filePath);
          }
        }else paths.push(filePath);
      }else {
        paths = paths.concat(this.getDirFiles(filePath, match));
      }
    }
    return paths;
  }

  // =============== for webpack building ================

  setEntry (){
    // find entry files and flatten to array
    const files = this.getDirFiles(this.targetDir, file => {
      let isIgnore = false;
      this.ignoreFiles.forEach(ignoreFile => {
        isIgnore = file.includes(ignoreFile);
      });
      return file.includes('entry.js') && !isIgnore;
    });
    files.forEach(file => {
      const entryname = file.replace(this.targetDir, '').replace(/\\+/g, '/')/*.replace(path.extname(file), '')*/;
      this.entry[entryname] = file;
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
    console.log('\n=============== webpack building ==============');

  	this.setEntry();
    // console.log(JSON.stringify(this.entry, null, 2));
    // return;

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

  // =============== for style building ================

  // common style building
  buildStyle (src, type, ext, transform){
    console.log(`\n=============== ${type} building ==============`);

    const files = [].concat(src).forEach((file, index) => {
      file = path.normalize(file);
      const fileDistPath = file.replace(this.targetDir, this.distDir).replace(ext, '.css');
      const styleData = fs.readFileSync(file, { encoding: 'utf8' });
      console.log(` ${index+1} building: ${file}`);
      transform(styleData, file, fileDistPath);
    });
  }

  // build css
  css (src){
    this.buildStyle(src, 'css', '.css', (styleData, file, dist) => {
      util.mkdirDeep(path.dirname(dist));
      fs.writeFileSync(dist, styleData, { encoding: 'utf8' });
    });
    return this;
  }

  // build less
  less (src){
    const less = require('less');
    this.buildStyle(src, 'less', '.less', (styleData, file, dist) => {
      less.render(styleData, { paths: [path.dirname(file)] }).then(output => {
        util.mkdirDeep(path.dirname(dist));
        fs.writeFileSync(dist, output.css, { encoding: 'utf8' });
      });
    });
    return this;
  }

  // build sass
  sass (src){
    const sass = require('node-sass');
    this.buildStyle(src, 'less', '.less', (styleData, file, dist) => {
      const compiledData = sass.renderSync({
        data: styleData,
        includePaths: [path.dirname(file)]
      });
      util.mkdirDeep(path.dirname(dist));
      fs.writeFileSync(dist, compiledData, { encoding: 'utf8' });
    });
    return this;
  }
};

module.exports = Hico;