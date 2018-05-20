const Hico = require('../../../../src');
const hico = new Hico();
const path = require('path');

module.exports = hico.src(path.join(__dirname, '../pages'))
  .dist(path.join(__dirname, '../../public/dist'))
  .env('development')
  .ignore(path.resolve(__dirname, '../pages/style'))
  .css(path.resolve(__dirname, '../pages/style'))
  .less(path.resolve(__dirname, '../pages/style/less.less'))
  .build();
