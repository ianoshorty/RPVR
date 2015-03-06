  AxelDownloader = function(owner, debug) {

    // Get a handler to the spawn library
    this.child_process  = Npm.require('child_process');
    this.readline       = Npm.require('readline');
    this.fs             = Npm.require('fs');
    this.stream         = Npm.require('stream');

    this.downloads    = [];
    this.owner        = owner;
    this.debug        = (typeof debug === "boolean") ? debug : false;

    return this;
  };

  AxelDownloader.prototype.downloadStatus = function(){

    // Need to open correct file

    //var input = this.fs.openSync('/Users/ianoshorty/Downloads/out.log', 'r');

    this.fs.readFile('/Users/ianoshorty/Downloads/out.log', 'utf-8', function(err, data) {
      if (err) throw err;

      var lines = data.trim().split('\n');
      var lastLine = lines.slice(-1)[0];

      console.log(lastLine);
    });
  }

  AxelDownloader.prototype.download = function(address, options, cb) {

    // Example axel command
    // axel -avn 10 -o "Top.Gear.S21E06.PROPER.HDTV.x264-RiVER.[VTV].mp4" https://ianoshorty:d4yl1ght0169@put.io/download/279908961
    // Example axel command - Mac
    // /usr/local/bin/axel -avn 10 -o "~/Top.Gear.S21E06.PROPER.HDTV.x264-RiVER.[VTV].mp4" https://ianoshorty:d4yl1ght0169@put.io/download/279908961 

    if (this.debug) {
      console.log('Download started from: ' + address);
      console.log('Storing into: ' + options.cwd + '/' + options.file);
    }

    //var out = this.fs.openSync(process.env.PWD + '/files/tmp/out.log', 'a'),
     //   err = this.fs.openSync(process.env.PWD + '/files/tmp/out.log', 'a');

    var out = this.fs.openSync('/Users/ianoshorty/Downloads/out.log', 'a'),
        err = this.fs.openSync('/Users/ianoshorty/Downloads/out.log', 'a');

    var command = this.child_process.spawn('/usr/local/bin/axel', ['-avn 10', '-o ' + options.file, address], {
      'cwd'       : options.cwd, 
      'env'       : process.env,
      'detached'  : true,
      'stdio'     : [ 'ignore', out, err ]
    });

    /*

    this.readline.createInterface({
      input     : command.stdout,
      terminal  : false
    }).on('line', function(line) {
      cb(1, line);
    });

    this.readline.createInterface({
      input     : command.stderr,
      terminal  : false
    }).on('line', function(line) {
      cb(2, line);
    });

    command.on('exit', function (code) {
      cb(3, ''+code);
    });

  */

    this.downloads.push({
      'pid': command.pid,
      'command': command
    });

    command.unref();

    if (this.debug) {
      console.log('Download added to download queue.');
    }


    // Code below for reading file

    // Need to handle simultanious Read / Write

    // Maybe something like https://github.com/felixge/node-growing-file

    // Needs experimenting with

    var scope = this;

    Meteor.setTimeout(function() {

      var instream = scope.fs.createReadStream('/Users/ianoshorty/Downloads/out.log');
      var outstream = new scope.stream;
      var rl = scope.readline.createInterface(instream, outstream);

      rl.on('line', function(line) {
        // process line here
        console.log(line);

        rl.removeAllListeners('line');
      });



    }, 2000);


    return command;
  }

  AxelDownloader.prototype.pause = function(pid, cb) {

    if (this.debug) {
      console.log('Stopping download process with id: ' + pid);
    }

    var processObject = _.find(this.downloads, function(object){ return object.pid == pid});

    if (typeof processObject !== 'undefined') {
      processObject.command.kill();
    }

    if (cb) {
      cb(processObject.command);
    }

    if (this.debug) {
      console.log('Download with id: ' + pid + ' stopped.');
    }

    return this;
  }

  AxelDownloader.prototype.pauseAll = function(cb) {

    if (this.debug) {
      console.log('Stopping all downloads');
    }

    _.each(this.downloads, function(processObject, key) {
        processObject.command.kill();
    });

    if (cb) {
      cb();
    }

    if (this.debug) {
      console.log('All downloads stopped.');
    }

    return this;
  }