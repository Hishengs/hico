const Hico = require('../src');
const hico = new Hico();
const path = require('path');

// build resources
hico.target(path.join(__dirname, './module'))
    .dist(path.join(__dirname, './dist'))
    .ignore(path.join(__dirname, './module/temp'))
    .build();

// or build and then watch
/*hico.target(path.join(__dirname, './module'))
    .dist(path.join(__dirname, './dist'))
    .ignore(path.join(__dirname, './module/temp'))
    .watch();*/