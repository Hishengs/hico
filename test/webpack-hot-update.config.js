const Hico = require('../src');
const hico = new Hico();
const path = require('path');

module.exports = hico.target(path.join(__dirname, './module'))
                      .dist(path.join(__dirname, './dist'))
                      .ignore(path.join(__dirname, './module/temp'))
                      .env('development')
                      .hotUpdate({
                      	contentBase: path.join(__dirname, '')
                      });