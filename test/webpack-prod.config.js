const Hico = require('../src');
const hico = new Hico();
const path = require('path');

module.exports = hico.src(path.join(__dirname, './frontend/page'))
                      .dist(path.join(__dirname, './dist'))
                      .ignore([
                        './a',
                      ])
                      .env('production')
                      // .js(['./moduleA', './moduleB'])
                      /*.css('./css.css')
                      .less([
                        './less.less',
                      ])*/
                      /*.sass([
                        ./moduleA/test.sass'
                      ])*/
                      .build();