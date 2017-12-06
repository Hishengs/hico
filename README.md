# Hico
A frontend solution for traditional website

传统网站前端工程化实践方案

## Install
```js
npm i --save-dev hico
```

## Usage

### 1. 开发目录
假设你的开发目录是 `module`，目录结构如下：

```html
├── module
  ├── moduleA
      ├── index.entry.js // webpack 入口文件
      ├── index.html     // 模块页面
      ├── index.less     // 模块样式文件
      ├── dep.js         // 依赖模块
  ├── moduleB
      ├── index.entry.js // webpack 入口文件
      ├── index.html     // 模块页面
      ├── index.css      // 模块样式文件
  ├── temp               // 临时性目录
```

其中，index.entry.js 是模块默认的入口文件，webpack 会使用此文件作为该模块的入口文件：

```js
const dep = require('./dep.js');
import 'index.less'; // 引入模块的样式文件

// do something
document.getElementById('app').innerText = 'hello, hico';
dep.echo();
```

在模块页面 `index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>hico</title>
</head>
<body>
  <div id="app"></div>
  <script src="/module/moduleA/index.entry.js"></script>
</body>
</html>
```

`moduleB`目录结构类似。


### 2. 编译你的代码

创建 `webpack-dev.config.js`

```js
const Hico = require('hico');
const hico = new Hico();
const path = require('path');

module.exports = hico.target(path.join(__dirname, './module'))       // 指定项目源码目录
                      .dist(path.join(__dirname, './dist'))          // 指定打包后的目录
                      .ignore(path.join(__dirname, './module/temp')) // 忽略掉临时性目录
                      .env('development')                            // 设置打包环境
                      .build();                                      // 开始打包
```

创建 `build-dev.bat`

```bat
cls
webpack --progress --hide-modules --colors --config=webpack-dev.config.js
```

双击 `build-dev.bat` 执行打包。



## API

### target(targetDir)
**参数** `targetDir` 开发目录。<br/>
**说明** 指定你的开发目录。<br/>
**返回** 返回当前实例。<br/>


### dist(distDir)
**参数** `distDir` 输出目录。<br/>
**说明** 指定你的输出目录。<br/>
**返回** 返回当前实例。<br/>


### ignore(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组。<br/>
**说明** 忽略文件或者文件夹。<br/>
**返回** 返回当前实例。<br/>


### env(env)
**参数** `env` 当前环境。<br/>
**说明** 指定当前打包环境：`development`（默认） 或者 `production`，会根据指定环境采用不同的打包策略。<br/>
**返回** 返回当前实例。<br/>


### js(files, opt)
**参数** <br/>
```js
files 单个文件(夹)路径或者文件(夹)路径数组。
opt   配置项
  |—— babel 传给 babel 的配置项，具体参数见：http://babeljs.io/docs/core-packages/#options
```

**说明** 指定要转译的 js 文件，只是通过 babel 进行转译输出，不通过 webpack。<br/>
**返回** 返回当前实例。<br/>


### css(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组。<br/>
**说明** 指定要打包的 css 文件。<br/>
**返回** 返回当前实例。<br/>


### less(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组。<br/>
**说明** 指定要打包的 less 文件。<br/>
**返回** 返回当前实例。<br/>


### sass(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组。<br/>
**说明** 指定要打包的 sass 文件。<br/>
**返回** 返回当前实例。<br/>

### copy(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组。<br/>
**说明** 有时某些文件(夹)不想作处理，只是想简单地复制到输出目录，可使用此方法。<br/>
**返回** 返回当前实例。<br/>

### build()
**参数** 无。<br/>
**说明** 执行打包构建。<br/>
**返回** 无。<br/>