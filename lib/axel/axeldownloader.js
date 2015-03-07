  // Uses files to track progress, could be better.

  AxelDownloader = function(owner, debug) {

    // Get a handler to the spawn library
    this.child_process  = Npm.require('child_process');
    this.readline       = Npm.require('readline');
    this.fs             = Npm.require('fs');
    
    this.downloads    = [];
    this.owner        = owner;
    this.debug        = (typeof debug === "boolean") ? debug : false;

    return this;
  };

  // Because of its implementation, this is an extremely slow call.
  // Need to devise a better way of handling this.
  // Necessitated by the difficulty in reading file as its being written
  AxelDownloader.prototype.downloadStatus = function(downloadId){

    if (this.debug) {
      console.log('Getting download status for: ' + downloadId);
    }

    thisClass = this;

    function _getStatus(cb) {

      var command = thisClass.child_process.exec('tail -q /Users/ianoshorty/Downloads/out.log', {
        timeout: 1500
      }, function(error, stdout, stderr) {
        
        // Regular expression to parse key numbers from file
        // /\[\s*([0-9]{1,3})%\].*\[\s*([0-9]+\.[0-9]+[A-Z][a-zA-Z]\/s)\]\s*\[([0-9]+:[0-9]+)\]/i

        var re = /\[\s*([0-9]{1,3})%\].*\[\s*([0-9]+\.[0-9]+[A-Z][a-zA-Z]\/s)\]\s*\[([0-9]+:[0-9]+)\]/i; 
        
        // 150 characters is about enough to get us a value we can use with a regex to get progress.
        var str = stdout.slice(-150);
        var m;

        // Get Metrics
        m = re.exec(str);

        // Create a job object
        var job = {
          percentage: m[1],
          speed:      m[2],
          ttl:        m[3]
        };

        if (this.debug) {
          console.log('Download status for: ' + downloadId);
          console.log(job);
        }

        cb(null, job);
      });
    }

    var statusCall = Meteor.wrapAsync(_getStatus);

    return statusCall();
  }

  AxelDownloader.prototype.download = function(address, options) {

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

    var out = this.fs.openSync('/Users/ianoshorty/Downloads/out.log', 'w'),
        err = this.fs.openSync('/Users/ianoshorty/Downloads/out.log', 'w');

    var command = this.child_process.spawn('/usr/local/bin/axel', ['-avn 10', '-o ' + options.file, address], {
      'cwd'       : options.cwd, 
      'env'       : process.env,
      'detached'  : true,
      'stdio'     : [ 'ignore', out, err ]
    });

    this.downloads.push({
      'pid': command.pid,
      'address': address,
      'options': options
    });

    command.unref();

    if (this.debug) {
      console.log('Download added to download queue.');
    }

    return command;
  }

  AxelDownloader.prototype.pause = function(downloadId, cb) {

    if (this.debug) {
      console.log('Stopping download process with id: ' + downloadId);
    }

    // TODO: Pause Download

    if (cb) {
      cb();
    }

    if (this.debug) {
      console.log('Download with id: ' + downloadId + ' stopped.');
    }

    return this;
  }

  AxelDownloader.prototype.pauseAll = function(cb) {

    if (this.debug) {
      console.log('Stopping all downloads');
    }

    // TODO: Pause all Downloads

    if (cb) {
      cb();
    }

    if (this.debug) {
      console.log('All downloads stopped.');
    }

    return this;
  }