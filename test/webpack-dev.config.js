const Hico = require('../src');
const hico = new Hico();
const path = require('path');

module.exports = hico.target(path.join(__dirname, './module'))
                      .dist(path.join(__dirname, './dist'))
                      .ignore([
                      	'./temp',
                      ])
                      .env('development')
                      .js(['./moduleA', './moduleB'])
                      .css('./moduleA/a.css')
                      .less([
                      	'./moduleA/index.less',
                      	'./moduleB/index.less',
                      ])
                      /*.sass([
                      	./moduleA/test.sass'
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
