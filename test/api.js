const Hico = require('../src');
const hico = new Hico();
const path = require('path');

hico.target(path.join(__dirname, './module')).dist(path.join(__dirname, './dist')).ignore('./module/temp');

console.log(hico.ignoreFiles);