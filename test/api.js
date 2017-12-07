const Hico = require('../src');
const hico = new Hico();
const path = require('path');

// test copy
// hico.target(path.join(__dirname, './frontend/page')).dist(path.join(__dirname, './dist')).copy(['./temp', './moduleA/index.less']);

// test js
/*hico.target(path.join(__dirname, './frontend/page'))
.dist(path.join(__dirname, './dist'))
.ignore(['./moduleA/index.entry.js'])
.env('production')
.js(['./moduleA', './moduleB']);*/

// test css
/*hico.target(path.join(__dirname, './frontend/page'))
.dist(path.join(__dirname, './dist'))
.ignore(['./moduleA/a1.css'])
.env('production')
.css(['./moduleA', './moduleB']);*/

// test less
/*hico.target(path.join(__dirname, './frontend/page'))
.dist(path.join(__dirname, './dist'))
.ignore(['./moduleA/a.less'])
.env('production')
.less(['./moduleA', './moduleB']);*/

// test add entry
/*hico.target(path.join(__dirname, './frontend/page'))
.dist(path.join(__dirname, './dist'))
.addEntry('test/index.less', path.join(__dirname, './frontend/page/index.less'));*/

const config = hico.target(path.join(__dirname, './frontend/page'))
.dist(path.join(__dirname, './dist'))
.less('./index.less').build();

console.log(JSON.stringify(config, null, 2));