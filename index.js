var fs = require('fs'),
    path = require('path'),
    argv = require('optimist').argv,
    connect = require('connect'),
    open = require('open'),
    tinylr = require('tiny-lr-fork'),
    lr = require('connect-livereload'),
    vfs = require('vinyl-fs'),
    request = require('request'),
    Q = require('q'),
    spawn = require('child_process').spawn;
		
var IonicServeTask = function() {};

module.exports = IonicServeTask;