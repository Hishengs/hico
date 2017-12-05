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
                      .hotUpdate({
                      	contentBase: path.join(__dirname, '')
                      });