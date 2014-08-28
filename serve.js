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
		
var IonicServeTask = {
	port: 8900,
	liveReloadPort : 35729,
	runLivereload : true,
	launchBrowser : true,
	run: function(){
		this._start();
		return 'run'
	},
	 _start:function(){
	   var self = this;
	   var app = connect();

	   if (!fs.existsSync( path.resolve('www') )) {
	     return console.log('"www" directory cannot be found. Make sure the working directory is an Ionic project.');
	   }


	   if(this.runLivereload) {
	     vfs.watch('www/**/*', {
	     }, function(f) {
				 console.log('change....sang');
	       self._changed(f.path);
	     });

	     server = tinylr();
	     server.listen(this.liveReloadPort, function(err) {
	       if(err) {
	         return console.log('Unable to start live reload server:', err);
	       } else {
	         console.log('Running live reload server:' + self.liveReloadPort );
	         if(self.launchBrowser) {
					 	open("http://localhost:" + this.port + "/");
	         }
	       }
	     });

	     app.use(require('connect-livereload')({
	       port: this.liveReloadPort
	     }));
	   }

	   app.use(connect.static('www'))
	     .listen(this.port);

	   console.log('Running dev server:' + this.port);

	   process.stdin.on('readable', function() {
	     var chunk = process.stdin.read();
	     if (chunk !== null && /exit|quit|close|stop/gi.test(chunk)) {
	       process.exit();
	     }
	   });
	 },
	 _changed : function(filePath) {
	   // Cleanup the path a bit
	   var pwd = process.cwd();
	   filePath = filePath.replace(pwd + '/', '');

	   console.log( ('  changed: ' + filePath) );

	   var req = request.get('http://localhost:' + this.liveReloadPort + '/changed', {
	     path: '/changed',
	     method: 'POST',
	     body: JSON.stringify({
	       files: [filePath]
	     })
	   }, function(err, res, body) {
	     if(err) {
	       console.error('Unable to update live reload:', err);
	     }
			 console.log(res  + ' - ' + body);
	   });
	 }
};

module.exports = IonicServeTask;