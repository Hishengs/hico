# Hico
A frontend solution for traditional website

传统网站前端工程化实践方案

## Install
```js
npm i --save-dev hico
```

## Usage

### 1. 目录结构
假设你的前端开发目录是 `frontend`，目录结构如下：

```html
├── frontend
  ├── asset                    // 资源目录
      ├── style                // 样式
      ├── script               // 脚本
      ├── image                // 图片
      ├── font                 // 字体
  ├── component                // 通用组件（以 vue 为例）
      ├── header.vue
      ├── footer.vue
  ├── page                     // 页面脚本目录
      ├── temp                 // 临时目录
      ├── a
          ├── index.entry.js   // 页面 webpack 入口文件
          ├── index.less       // 页面样式文件
      ├── b
          ├── index.entry.js   // 页面 webpack 入口文件
          ├── index.less       // 页面样式文件
      ├── index.entry.js       // 首页 webpack 主入口文件
      ├── index.less           // 首页样式
      ├── index.vue            // 首页 vue 组件
```

可以看出，你的应用主要开发目录是 `/frontend/page`，其他目录如 `/frontend/asset` 和 `/frontend/component` 等都是资源目录，被引用但最后不会被打包到构建目录。



**Hico** 会遍历 `/frontend/page` 下所有的 `index.js` 形成入口文件列表，并作为 `webpack` 的构建入口。



正常来讲，如果应用按模块划分，每个模块都应该有一个入口文件，例如上面的`/frontend/page/a/index.entry.js` 和 `/frontend/page/b/index.entry.js` ，在模块页面中会引用此入口文件构建后的目标脚本。



可以看看此目录结构下的文件：



其中，`/frontend/page/index.entry.js` 是应用首页的入口文件：

```js
import './index.less';
import Vue from 'vue';
import App from './index.vue';

window.app = new Vue({
  el: '#app',
  render: h => h(App)
});
```

在应用首页引用 `index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>hico</title>
</head>
<body>
  <div id="app"></div>
  <script src="/dist/index.entry.js"></script>
</body>
</html>
```


再看看模块 a：

`index.entry.js`

```js
import './index.less';

document.getElementsByTagName('h1')[0].innerText = 'A';
```

模块 a 页面 `index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>hico</title>
</head>
<body>
  <h1 class="title"></h1>
  <script src="/dist/a/index.entry.js"></script>
</body>
</html>
```

### 2. 构建你的工程

创建 `webpack-dev.config.js`

```js
const Hico = require('hico');
const hico = new Hico();
const path = require('path');

module.exports = hico.src(path.join(__dirname, './frontend/page'))  // 指定构建入口目录
                      .dist(path.join(__dirname, './dist'))            // 指定构建输出目录
                      .ignore(['./temp'])                              // 忽略掉临时性目录
                      .env('development')                              // 设置打包环境
                      .build();                                        // 开始打包
```

编辑你的 `package.json`，添加以下命令

```json
"build-dev": "webpack --progress --hide-modules --colors --config=webpack-dev.config.js",
```

在项目目录下执行 `npm run build-dev` 构建打包。

<br/>

## Go Deep

### 忽略文件或者文件夹

有时候开发目录下会有一些临时目录或者冗余但不能删除的文件（夹），此时这些文件（夹）是不应该被包含进构建过程的，可以指定忽略这些文件（夹）：

```js
hico.src(srcDir).dist(distDir).ignore(['./temp']).build();
```


### 指定构建环境

> 默认 env 是 development，可以指定为 production，不同的环境会触发不同的构建策略。

```js
hico.src(srcDir).dist(distDir).env('production').build();
```


### 打包样式文件

有时你只是想将某些样式文件或者目录打包到输出目录，而不是通过 webpack 引入，你可以这么做：

#### css

```js
hico.src(srcDir).dist(distDir).css(['./style']).build();
```

会将 `style` 目录下所有的 `.css` 文件打包到输出目录。

也可以指定单个文件：

```js
hico.src(srcDir).dist(distDir).css(['./style/common.css']).build();
```


#### less

```js
hico.src(srcDir).dist(distDir).less(['./style/a', './style/a/index.less']).build();
```

**Hico** 最终会将 less 文件转译为 `.css` 文件到输出目录。


#### sass

```js
hico.src(srcDir).dist(distDir).sass(['./style/a', './style/a/index.sass']).build();
```

**Hico** 最终会将 sass 文件转译为 `.css` 文件到输出目录。


### 打包其他文件

既不是样式文件，也不是脚本文件，如果也有同步的需求，可以调用简单的 `copy` 接口复制到输出目录：

```js
hico.src(srcDir).dist(distDir).copy(['./font', './image/bg.png']).build();
```

<br/>

## API

### src(srcDir)
**参数** `srcDir` 开发目录。<br/>
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

### build(config)
**参数** <br/>
```js
config = {
  extractStyle: true,                 // 是否提取单独的样式文件
  extractStyleConfig: '[name].css',   // extract-text-plugin 配置
  publicPath: 'dist',                 // 公共资源默认前缀
}
```

**说明** 执行打包构建。<br/>
**返回** 无。<br/>

<br/>

## TODO
1. 支持热更新。

<br/>

## License
under [MIT](http://opensource.org/licenses/MIT)