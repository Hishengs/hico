const Hico = require('../src');
const hico = new Hico();
const path = require('path');

module.exports = hico.target(path.join(__dirname, './module'))
                      .dist(path.join(__dirname, './dist'))
                      .ignore([
                        './temp',
                      ])
                      .env('development')
                      /*.js(['./moduleA', './moduleB'])
                      .css('./moduleA/a.css')
                      .less([
                        './moduleA/index.less',
                        './moduleB/index.less',
                      ])*/
                      /*.sass([
                        ./moduleA/test.sass'
                      ])*/
                      .hotUpdate({
                        contentBase: path.join(__dirname, '')
                      });