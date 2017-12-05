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
    if(!fs.existsSync(distDir)){
      // create dist dir
      fs.mkdirSync(distDir);
    }else {
      if(!fs.statSync(distDir).isDirectory(distDir)){
        throw new Error('invalid dist directory');
      }
    }
    this.distDir = distDir;
    return this;
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
      // this.entry[this.hash(file)] = file;
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

  // build less
  less (src){
    console.log('\n=============== less building ==============');

    const less = require('less');
    const files = [].concat(src).forEach((file, index) => {
      file = path.join(file, '');
      const fileDistPath = file.replace(this.targetDir, this.distDir).replace('.less', '.css');
      const styleData = fs.readFileSync(file, { encoding: 'utf8' });
      console.log(` ${index+1} building: ${file}`);
      less.render(styleData, { paths: [path.dirname(file)] }).then(output => {
        util.mkdirDeep(path.dirname(fileDistPath));
        fs.writeFileSync(fileDistPath, output.css, { encoding: 'utf8' });
      });
    });
    return this;
  }

  // build sass
  sass (src){
    console.log('\n=============== sass building ==============');
    
    const sass = require('node-sass');
    const files = [].concat(src).forEach((file, index) => {
      file = path.join(file, '');
      const fileDistPath = file.replace(this.targetDir, this.distDir).replace(/\.s[ac]ss/, '.css');
      const styleData = fs.readFileSync(file, { encoding: 'utf8' });
      console.log(` ${index+1} building: ${file}`);
      const compiledData = sass.renderSync({
        data: styleData,
        includePaths: [path.dirname(file)]
      });
      util.mkdirDeep(path.dirname(fileDistPath));
      fs.writeFileSync(fileDistPath, compiledData, { encoding: 'utf8' });
    });
    return this;
  }
};

module.exports = Hico;