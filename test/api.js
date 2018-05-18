const Hico = require('../src');
const hico = new Hico();
const path = require('path');

hico.src(path.join(__dirname, './frontend/page'))
  .dist(path.join(__dirname, './dist'))
  .env('development')
  .hotUpdate();
