# Hico
A Frontend Solution for Traditional Website

传统网站前端工程化实践方案

<br/>

## Features
### 工程化
解决传统网站开发模式的痛点，使用流行的构建工具及方法。
### 简洁而强大
简单的调用，背后该做的都做到了。
### 站在巨人的肩膀
基于强大的 webpack 构建，使用最优的配置，为你隐藏痛苦而琐碎的 webpack 配置过程。
### 灵活
如果你仍然需要定制，你可以在我们生成的配置基础上自己自行修改或调整配置策略。

<br/>

## Install
```js
npm i --save-dev hico
```
<br/>

## Usage

### 1. 项目结构初探

传统网站的开发方式一般是前后端分开开发的，后端人员负责逻辑与模板渲染，前端人员负责样式与交互，最后由后端开发人员在模板中引用前端的脚本和样式文件以及各种其他资源。以典型的 php 项目（laravel）为例，一般具有如下项目架构：

```js
├── project
  ├── app
  ├── bootstrap
  ├── config
  ├── database
  ├── public
    ├── dist                     // 前端最终构建后的文件输出目录放在这里
    ├── index.php
  ├── resources
    ├── assets
    ├── lang
    ├── views                    // 这就是后端的模板目录
      ├── a
        ├── index.html           // 页面 a
      ├── b
        ├── index.html           // 页面 b
      ├── index.html             // 首页
  ├── routes
  ├── storage
  ├── tests
  ├── vendor
  ├── frontend                   // 这是前端的开发目录
    ├── assets                   // 资源目录
        ├── style                // 样式
        ├── script               // 脚本
        ├── image                // 图片
        ├── font                 // 字体
    ├── components               // 通用组件（以 vue 为例）
        ├── header.vue
        ├── footer.vue
    ├── node_modules
    ├── pages                    // 主要页面开发目录
        ├── temp                 // 临时目录
        ├── a
            ├── index.js         // 页面a webpack 入口文件
            ├── index.less       // 页面样式文件
        ├── b
            ├── index.js         // 页面b webpack 入口文件
            ├── index.less       // 页面样式文件
        ├── index.js             // 首页 webpack 主入口文件
        ├── index.vue            // 首页的 vue 根组件
        ├── index.less           // 首页样式文件
    ├── .babelrc
    ├── .eslintrc.js
    ├── .gitignore
    ├── package.json
    ├── postcss.config.json
```

在上面的目录架构中，前端主要负责 `frontend` 目录的开发即可，其中 `/frontend/pages` 与后端的模板目录 `/resources/views` 是一一映射的关系。构建后的 `/public/dist` 同样存在相同的目录结构。`/resources/views` 中的页面只需要对应地引用 `/public/dist` 下的资源即可。


在前端开发目录中，主要开发目录是 `/frontend/pages`，其他目录如 `/frontend/assets` 和 `/frontend/components` 等都是资源目录，被引用但最后不会被打包到构建输出目录。



**Hico** 会遍历 `/frontend/pages` 下所有的 `index.js` 形成入口文件列表，并添加到 `webpack` 的构建入口。



正常来讲，如果应用按模块划分，每个模块都应该有一个入口文件，例如上面的`/frontend/pages/a/index.js` 和 `/frontend/pages/b/index.js` ，在模块页面中会引用此入口文件构建后的目标脚本。



可以看看此目录结构下的文件：



其中，`/frontend/pages/index.js` 是应用首页的入口文件：

```js
import './index.less';
import Vue from 'vue';
import App from './index.vue';

window.app = new Vue({
  el: '#app',
  render: h => h(App)
});
```

在应用首页 `views/index.html` 中引用构建后的脚本文件：

```html
<!DOCTYPE html>
<html>
<head>
  <title>hico</title>
</head>
<body>
  <div id="app"></div>
  <script src="/dist/index.js"></script>
</body>
</html>
```


再看看模块 a：

`/frontend/pages/a/index.js`

```js
import './index.less';

document.getElementsByTagName('h1')[0].innerText = 'A';
```

模块 a 页面 `views/a/index.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>hico</title>
</head>
<body>
  <h1 class="title"></h1>
  <script src="/dist/a/index.js"></script>
</body>
</html>
```

模块 b 同模块 a 类似。


### 2. 构建你的工程

#### 创建 `dev.config.js`
> **Hico** 的原理很简单，只是根据你的配置为你生成 `webpack` 配置，并最终交由 `webpack` 去构建你的项目。

```js
const Hico = require('hico');
const hico = new Hico();
const path = require('path');

module.exports = hico.src(path.join(__dirname, './frontend/page'))    // 指定构建入口目录
                     .dist(path.join(__dirname, './dist'))            // 指定构建输出目录
                     .ignore(['./temp'])                              // 忽略掉临时性目录
                     .env('development')                              // 设置构建环境
                     .build();                                        // 开始构建
```

#### 编辑你的 `package.json`，添加以下命令

```json
"build-dev": "./node_modules/.bin/webpack.cmd --progress --hide-modules --colors --config=dev.config.js"
```

在项目目录下执行 `npm run build-dev` 构建打包。

<br/>

## Dive Deeper

### 构建生产版本、热更新

#### 构建生产版本
只需要简单地将环境指定为 `production` 即可。
```js
// prod.config.js
const Hico = require('hico');
const hico = new Hico();
const path = require('path');

module.exports = hico.src(path.join(__dirname, './frontend/page'))    // 指定构建入口目录
                     .dist(path.join(__dirname, './dist'))            // 指定构建输出目录
                     .ignore(['./temp'])                              // 忽略掉临时性目录
                     .env('production')                               // 设置构建环境
                     .build();                                        // 开始构建
```

#### 热更新
将 `build()` 替换成 `hotUpdate()` 即可。
```js
// hot-update.config.js
const Hico = require('hico');
const hico = new Hico();
const path = require('path');

module.exports = hico.src(path.join(__dirname, './frontend/page'))    // 指定构建入口目录
                     .dist(path.join(__dirname, './dist'))            // 指定构建输出目录
                     .ignore(['./temp'])                              // 忽略掉临时性目录
                     .env('development')                              // 设置构建环境
                     .hotUpdate();                                    // 开始构建
```

然后，分别在 `package.json` 中添加命令：
```js
"build-prod": "./node_modules/.bin/webpack.cmd --progress --hide-modules --colors --config=prod.config.js",
"hot-update": "./node_modules/.bin/webpack-dev-server.cmd --progress --hide-modules --colors --config=hot-update.config.js"
```


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


<!-- ### 打包样式文件

有时你只是想将某些样式文件或者目录打包到输出目录，而不是通过 webpack 引入，你可以这么做：

#### css

```js
hico.src(srcDir).dist(distDir).css(['./style']).build();
```

这会将 `style` 目录下所有的 `.css` 文件打包到输出目录。

你也可以指定单个样式文件：

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

**Hico** 最终会将 sass 文件转译为 `.css` 文件到输出目录。 -->



### 同步其他文件

既不是样式文件，也不是脚本文件，如果也有同步的需求，可以调用简单的 `copy` 接口复制到输出目录：

```js
hico.src(srcDir).dist(distDir).copy(['./font', './image/bg.png']).build();
```

> 注意，以上如果你并不需要构建过程，可以把最后的 build 去掉。



### 在 Laravel 项目中使用 Hico
你可以参见本仓库中的测试项目：`/test/hico`。


<br/>

## API

### new Hico(config)
**参数** `config` 全局配置项<br/>
**说明** 创建 **Hico** 构建实例<br/>
**默认** 目前尚未支持任何配置项<br/>
<!-- ```js
{
  // 是否对所有入口文件做 hash 对比，hash 值不变的入口文件将被忽略
  entryHash: true,
}
``` -->

### src(srcDir)
**参数** `srcDir` 开发目录<br/>
**说明** 指定你的开发目录<br/>
**返回** 返回当前实例<br/>


### dist(distDir)
**参数** `distDir` 输出目录<br/>
**说明** 指定你的输出目录<br/>
**返回** 返回当前实例<br/>


### ignore(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组<br/>
**说明** 忽略文件或者文件夹<br/>
**返回** 返回当前实例<br/>


### env(env)
**参数** `env` 当前环境<br/>
**说明** 指定当前打包环境：`development`（默认） 或者 `production`，会根据指定环境采用不同的构建策略<br/>
**返回** 返回当前实例<br/>


### css(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组<br/>
**说明** 指定要打包的 css 文件<br/>
**返回** 返回当前实例<br/>


### less(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组<br/>
**说明** 指定要打包的 less 文件<br/>
**返回** 返回当前实例<br/>


<!-- ### sass(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组<br/>
**说明** 指定要打包的 sass 文件<br/>
**返回** 返回当前实例<br/> -->

### copy(files)
**参数** `files` 单个文件(夹)路径或者文件(夹)路径数组<br/>
**说明** 有时某些文件(夹)不想作处理，只是想简单地复制到输出目录，可使用此方法<br/>
**返回** 返回当前实例<br/>

### build(config)
**参数** <br/>
```js
config = {
  extractStyle: true,                 // 是否提取单独的样式文件
  extractStyleConfig: '[name].css',   // extract-text-plugin 配置
  publicPath: 'dist',                 // 公共资源默认前缀
  sourceMap: true,                    // 是否启用 sourcemap
}
```

**说明** 执行打包构建<br/>
**返回** 无<br/>

### watch(config)
**参数** `config` 构建配置，同 `build()` 配置<br/>
**说明** 开启监听模式<br/>
**返回** 无<br/>

### hotUpdate(config, devServerConfig)
**参数** `config` 构建配置，同 `build()` 配置<br/>
**参数** `devServerConfig` [devServer](https://webpack.js.org/configuration/dev-server/) 配置<br/>
**说明** 热更新（模块热替换）<br/>
**返回** 无<br/>
```js
module.exports = hico.src(path.join(__dirname, '../pages'))
  .dist(path.join(__dirname, '../../public/dist'))
  .env('development')
  .hotUpdate(undefined, {
    port: 8888,
  });
```

<br/>

## TODO
~~1. 支持热更新~~
2. supprt vendor

<br/>

## License
under [MIT](http://opensource.org/licenses/MIT)