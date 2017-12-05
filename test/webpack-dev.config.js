const Hico = require('../src');
const hico = new Hico();
const path = require('path');

module.exports = hico.target(path.join(__dirname, './module'))
                      .dist(path.join(__dirname, './dist'))
                      .ignore([
                      	path.join(__dirname, './module/temp'),
                      	path.join(__dirname, './module/moduleA')
                      ])
                      .env('development')
                      .css(path.join(__dirname, './module/moduleA/a.css'))
                      .less([
                      	path.join(__dirname, './module/moduleA/index.less'),
                      	path.join(__dirname, './module/moduleB/index.less')
                      ])
                      /*.sass([
                      	path.join(__dirname, './module/moduleA/test.sass'),
                      ])*/
                      .build();


/*target
	moduleA
		- index.html
		- index.entry.js // A 模块入口文件
		- index.less
		- a1.js
		- avatar.png
	moduleB
		- index.html
		- index.entry.js // B 模块入口文件
		- index.less
		- b1.js
	moduleC
		- index.html
		- index.entry.js // C 模块入口文件*/
