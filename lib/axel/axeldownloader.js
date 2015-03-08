  // Uses files to track progress, could be better.
  // Todo: Make platform independant (remove Meteor.wrapAsync)
  // Unopinionated in terms of storage

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

  // Because of its implementation, suspect this is an extremely slow call.
  // Maybe need to devise a better way of handling this.
  // Necessitated by the difficulty in reading file as its being written
  AxelDownloader.prototype.downloadStatus = function(downloadId){

    if (this.debug) {
      console.log('Getting download status for: ' + downloadId);
    }

    thisClass = this;

    function _getStatus(cb) {

      thisClass.fs.readFile(downloadId, {'encoding':'utf-8'} ,function(err, data){

        if (err) throw err;

        var response = data;

        var re = /\[\s*([0-9]{1,3})%\].*\[\s*([0-9]+\.[0-9]+[A-Z][a-zA-Z]\/s)\]\s*\[([0-9]+:[0-9]+)\]/i; 
        
        // 150 characters is about enough to get us a value we can use with a regex to get progress.
        var str = response.slice(-150);
        var m;
        var job;

        // Get Metrics
        m = re.exec(str);

        if (m != null) {
          job = {
            percentage: m[1],
            speed:      m[2],
            ttl:        m[3]
          };
        }
        else {
          job = {};
        }

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

    var logPath = (typeof options.logPath !== 'undefined')? options.logPath : '/Users/ianoshorty/Downloads/';

    function basename(str) {
       var base = new String(str).substring(str.lastIndexOf('/') + 1); 
        if(base.lastIndexOf(".") != -1)       
            base = base.substring(0, base.lastIndexOf("."));
       return base;
    }

    var downloadId  = basename(address).toString(36);              // This is a temporary functional hack
    var logName     = downloadId;

    var out = this.fs.openSync(logPath + logName + '.log', 'w'),
        err = this.fs.openSync(logPath + logName + '.log', 'w');

    var command = this.child_process.spawn('/usr/local/bin/axel', ['-avn 10', '-o ' + options.file, address], {
      'cwd'       : options.cwd, 
      'env'       : process.env,
      'detached'  : true,
      'stdio'     : [ 'ignore', out, err ]
    });

    var download = {
      'pid': command.pid,
      'address': address,
      'options': options,
      'logName': logName,
      'logPath': logPath,
      'downloadId': downloadId,
      'fileName': options.file,
      'cwd'     : options.cwd,
      'status': 'downloading'
    };

    this.downloads.push(download);

    command.unref();

    if (this.debug) {
      console.log('Download added to download queue.');
    }

    return download;
  }

  AxelDownloader.prototype.pause = function(pid, cb) {

    if (this.debug) {
      console.log('Stopping download process with id: ' + pid);
    }

    process.kill(pid);

    if (cb) {
      cb();
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

    // TODO: Pause all Downloads

    if (cb) {
      cb();
    }

    if (this.debug) {
      console.log('All downloads stopped.');
    }

    return this;
  }

  AxelDownloader.prototype.cancel = function(download, cb) {

    if (this.debug) {
      console.log('Cancelling download');
    }

    // TODO: Cancel Download

    // Remove the download
    // Todo: fix spacing bug
    this.fs.unlink(download.cwd + '/ ' + download.fileName, function (err) {
      if (err) throw err;
      
      if (cb) {
        cb();
      }
    });

    // Remove the axel tracking file
    // Todo: fix spacing bug
    this.fs.unlink(download.cwd + '/ ' + download.fileName + '.st', function (err) {
      if (err) throw err;
      
      if (cb) {
        cb();
      }
    });

    // Remove the log file
    this.fs.unlink(download.logPath + download.logName + '.log', function (err) {
      if (err) throw err;
      
      if (cb) {
        cb();
      }
    });

    if (this.debug) {
      console.log('Download Cancelled.');
    }

    return this;
  }

  AxelDownloader.prototype.checkCompleted = function(download, cb) {

    if (this.debug) {
      console.log('Removing completed download');
    }

    try {
        // Query the entry
        stats = this.fs.lstatSync(download.cwd + '/ ' + download.fileName + '.st');

        // Be quiet - do nothing if the file exists

        if (stats.isFile()) {
          return false;
        }
        else {
          return true;
        }
    }
    catch (e) {
        
        // File doesnt exist - we cant assume completed
        return true;
    }
  }

  AxelDownloader.prototype.clearCompleted = function(download, cb) {

    if (this.debug) {
      console.log('Removing completed download');
    }

    // Remove the log file
    this.fs.unlink(download.logPath + download.logName + '.log', function (err) {
      if (err) throw err;
      
      if (cb) {
        cb();
      }
    });

    if (this.debug) {
      console.log('Download Removed.');
    }

    return this;
  }
