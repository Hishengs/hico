const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const util = require('./util.js');
const devConfig = require('../build/dev.config.js');
const prodConfig = require('../build/prod.config.js');

class Hico {
	constructor (){
    this._env = 'development';
  	this.entry = {};
    this.srcDir = null;
    this.distDir = null;
    this.ignoreFiles = [];
    this.webpackConfig = {};
    this.style = {
      css: {
        files: [],
        config: {},
      },
      less: {
        files: [],
        config: {},
      },
      sass: {
        files: [],
        config: {},
      },
      stylus: {
        files: [],
        config: {},
      },
    };
  }

  // set resources directory
  src (srcDir){
    // check if is directory and exists
    if(fs.existsSync(srcDir) && util.isDir(srcDir)){
      this.srcDir = srcDir;
      return this;
    }else throw new Error('invalid src directory');
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
      return path.resolve(this.srcDir, path.normalize(file));
    });
    return this;
  }

  // set env
  env (env){
    this._env = env;
    return this;
  }

  // =============== common functions ================

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

  // API: COPY, copy files
  copy (files){
    files = [].concat(files);
    files.map(file => path.resolve(this.srcDir, path.normalize(file))).forEach(file => {
      if(util.isFile(file)){
        util.copyFile(file, file.replace(this.srcDir, this.distDir));
      }else if(util.isDir(file)){
        util.copyDir(file, file.replace(this.srcDir, this.distDir));
      }
    });
  }

  // normalize files path
  normalizeFiles (files){
    return files.map(file => path.resolve(this.srcDir, path.normalize(file)));
  }

  flattenFiles (files){
    files = [].concat(files);
    let _files = [];
    this.normalizeFiles(files).forEach(file => {
      if(util.isFile(file)){
        _files.push(file);
      }else if(util.isDir(file)){
        _files = _files.concat(util.getDirFiles(file));
      }
    });
    return _files;
  }

  // =============== for js building ================

  minifyJS (code){
    const UglifyJS = require("uglify-es");
    return UglifyJS.minify(code).code;
  }

  js (files, opt = {}){
    console.log('\n API: js is not available at this version');
    process.exit();

    console.log(`\n=============== js building ==============`);

    files = [].concat(files).map(file => path.resolve(this.srcDir, path.normalize(file)));

    // babel compile
    const babel = require('babel-core');
    files.forEach((file, index) => {
      // check if ignore
      if(this.isIgnore(file))return;
      if(util.isFile(file)){
        if(path.extname(file) !== '.js')return;
        // ignore webpack entry file
        if(file.includes('index.js'))return;
        console.log(` ${index+1} building: ${file}`);
        const compiled = babel.transformFileSync(file, Object.assign({
          extends: path.join(__dirname, '../.babelrc'),
          minified: this._env === 'production',
          presets: ['env']
        }, opt.babel || {}));
        const dist = file.replace(this.srcDir, this.distDir);
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

  packStyle (files, type){
    files = this.flattenFiles(files);
    this.addEntries(files);
    this.style[type].files = files;
  }

  checkStyleLoader (type){
    try {
      if(type === 'less'){
        require('less') && require('less-loader');
      }else if(type === 'sass'){
        require('sass') && require('sass-loader');
      }else if(type === 'stylus'){
        require('stylus') && require('stylus-loader');
      }
    }catch(e) {
      console.log(`\n please install depedencies first for .${type}`);
      process.exit();
    }
  }

  // build css
  css (files){
    this.packStyle(files, 'css');
    return this;
  }

  // build less
  less (files){
    this.checkStyleLoader('less');
    this.packStyle(files, 'less');
    return this;
  }

  // build sass
  sass (files){
    this.checkStyleLoader('sass');
    this.packStyle(files, 'sass');
    return this;
  }

  // build stylus
  stylus (files){
    this.checkStyleLoader('stylus');
    this.packStyle(files, 'stylus');
    return this;
  }

  // =============== for webpack building ================

  addEntries (files){
    files.forEach(file => {
      this.addEntry(file.replace(this.srcDir, ''), file);
    });
  }

  addEntry (filename, filepath){
    const ext = path.extname(filename);
    if((/\.(css|less|s[ac]ss|styl[us])$/).test(ext)){ // stylesheet
      if(this.entry['style-puppet']){
        this.entry['style-puppet'].push(filepath);
      }else this.entry['style-puppet'] = [path.join(__dirname, './style-puppet.js') , filepath];
    }else {
      this.entry[filename.replace(ext, '')] = filepath;
    }
    return this;
  }

  // find and set entries from dist
  setWebpackEntries (){
    // find entry files and flatten to array
    let files = util.getDirFiles(this.srcDir, file => {
      return file.includes('index.js') && !this.isIgnore(file);
    });
    files = this.normalizeFiles(files);
    this.addEntries(files);
  }

  // build resources
  build (opt = {}){
    console.log('\n=============== webpack building ==============\n');

    this.setWebpackEntries();

    // build webpack config
    const makeConfig = this._env === 'production' ? prodConfig : devConfig;
    this.webpackConfig = makeConfig({
      entry: this.entry,
      src: this.srcDir,
      dist: this.distDir,
      style: this.style,
      watch: !!opt.watch,
      hotUpdate: opt.hotUpdate,
    });

    return this.webpackConfig;
  }

  // watch
  watch (){
    this.build({
      watch: true,
    });
  }

  // hot update
  hotUpdate (config = {}){
    this.build({
      hotUpdate: config,
    });
  }
};

module.exports = Hico;