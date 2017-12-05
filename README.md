# Hico
A frontend solution for traditional website

传统网站前端工程化实践方案

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
	├── temp             // 临时性目录
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