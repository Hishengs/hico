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
      return path.resolve(this.targetDir, path.normalize(file));
    });
    return this;
  }

  // set env
  env (env){
    this._env = env;
    return this;
  }

  // =============== common functions ================

  // extract files
  extractFiles (files){
    let _files = [];
    files.forEach(file => {
      file = path.normalize(file);
      if(_files.includes(file))return;
      if(util.isDir(file)){
        // _files.push(file);
        _files = _files.concat(util.getDirFiles(file));
      }else if(util.isFile(file)){
        _files.push(file);
      }else if((/(\/\*\/)+\*\./).test(file)){
        // may be like this '/xx/yy/*.js'
      }
    });
    return _files;
  }

  hash (data){
    const md5 = crypto.createHash("md5");
    md5.update(data);
    return md5.digest('hex');
  }

  // filter ignore files
  /*filterIgnoreFiles (files){
    return files.filter(file => {
      return this.ignoreFiles.filter(ignoreFile => {
        return file.includes(ignoreFile);
      }).length;
    });
  }*/

  // check if file is ignore
  isIgnore (file){
    let ignore = false;
    for(let i=0, ilen=this.ignoreFiles.length; i<ilen; i++){
      if(file.includes(this.ignoreFiles[i])){
        ignore = true;
        break;
      }
    }
    return ignore;
  }

  // copy files
  copy (files){
    files = [].concat(files);
    files.map(file => path.resolve(this.targetDir, path.normalize(file))).forEach(file => {
      if(util.isFile(file)){
        util.copyFile(file, file.replace(this.targetDir, this.distDir));
      }else if(util.isDir(file)){
        util.copyDir(file, file.replace(this.targetDir, this.distDir));
      }
    });
  }

  // =============== for webpack building ================

  setEntry (){
    // find entry files and flatten to array
    const files = util.getDirFiles(this.targetDir, file => {
      return file.includes('entry.js') && !this.isIgnore(file);
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

    // this.buildMapFile(this.entry);

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

  // =============== for js building ================

  minifyJS (code){
    const UglifyJS = require("uglify-es");
    return UglifyJS.minify(code).code;
  }

  js (files, opt = {}){
    console.log(`\n=============== js building ==============`);

    files = [].concat(files).map(file => path.resolve(this.targetDir, path.normalize(file)));

    // babel compile
    const babel = require('babel-core');
    files.forEach((file, index) => {
      // check if ignore
      if(this.isIgnore(file))return;
      if(util.isFile(file)){
        if(path.extname(file) !== '.js')return;
        // ignore webpack entry file
        if(file.includes('entry.js'))return;
        console.log(` ${index+1} building: ${file}`);
        const compiled = babel.transformFileSync(file, Object.assign({
          extends: path.join(__dirname, '../.babelrc'),
          minified: this._env === 'production',
          presets: ['env']
        }, opt.babel || {}));
        const dist = file.replace(this.targetDir, this.distDir);
        util.mkdirDeep(path.dirname(dist));
        fs.writeFileSync(dist, compiled.code, { encoding: 'utf8' });
        // fs.writeFileSync(dist, this._env === 'production' ? this.minifyJS(compiled.code) : compiled.code, { encoding: 'utf8' });
      }else if(util.isDir(file)){
        this.js(util.getDirFiles(file));
      }
    });
    return this;
  }

  // =============== for style building ================

  // common style building
  buildStyle (files, type, ext, transform){
    console.log(`\n=============== ${type} building ==============`);
    files = [].concat(files).map(file => path.resolve(this.targetDir, path.normalize(file)));
    files.forEach((file, index) => {
      // check if ignore
      if(this.isIgnore(file))return;
      if(util.isFile(file)){
        if(path.extname(file) !== ext)return;
        const dist = file.replace(this.targetDir, this.distDir).replace(ext, '.css');
        const styleData = fs.readFileSync(file, { encoding: 'utf8' });
        console.log(` ${index+1} building: ${file}`);
        transform(styleData, file, dist);
      }else if(util.isDir(file)){
        this.buildStyle(util.getDirFiles(file), type, ext, transform);
      }
    });
  }

  // for css minify
  minifyCss (css){
    const csso = require('csso');
    return csso.minify(css).css;
  }

  // build css
  css (files){
    this.buildStyle(files, 'css', '.css', (styleData, file, dist) => {
      util.mkdirDeep(path.dirname(dist));
      fs.writeFileSync(dist, this._env === 'production' ? this.minifyCss(styleData) : styleData, { encoding: 'utf8' });
    });
    return this;
  }

  // build less
  less (files){
    const less = require('less');
    this.buildStyle(files, 'less', '.less', (styleData, file, dist) => {
      less.render(styleData, { paths: [path.dirname(file)] }).then(output => {
        util.mkdirDeep(path.dirname(dist));
        fs.writeFileSync(dist, this._env === 'production' ? this.minifyCss(output.css) : output.css, { encoding: 'utf8' });
      });
    });
    return this;
  }

  // build sass
  sass (files){
    const sass = require('node-sass');
    this.buildStyle(files, 'less', '.less', (styleData, file, dist) => {
      const compiledData = sass.renderSync({
        data: styleData,
        includePaths: [path.dirname(file)]
      });
      util.mkdirDeep(path.dirname(dist));
      fs.writeFileSync(dist, this._env === 'production' ? this.minifyCss(compiledData) : compiledData, { encoding: 'utf8' });
    });
    return this;
  }
};

module.exports = Hico;