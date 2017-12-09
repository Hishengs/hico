const Hico = require('../src');
const hico = new Hico();
const path = require('path');

// module.exports = hico.src(path.join(__dirname, './frontend/page'))
// .dist(path.join(__dirname, './dist'))
// .less('./index.less').build();

module.exports = hico.src(path.join(__dirname, './frontend/page'))
                      .dist(path.join(__dirname, './dist'))
                      .ignore([
                      	'./a',
                      ])
                      .env('development')
                      // .js(['./moduleA', './moduleB'])
                      /*.css('./css.css')
                      .less([
                      	'./less.less',
                      ])*/
                      /*.sass([
                      	./moduleA/test.sass'
                      ])*/
                      .build();


/*src
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
