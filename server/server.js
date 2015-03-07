  var axel = new AxelDownloader('ian');

  // Every two seconds, poll and update the list of downloads
  // Todo: Improve this.
  Meteor.setInterval(function() {

    _.each(Downloads.find({}).fetch(), function(download) {
      
      var status = axel.downloadStatus(download.logPath + download.logName + '.log');

      // Todo: make reactive so that not always updating the database

      Downloads.update(download._id, {$set: status})
    });

  }, 2000);

  Meteor.methods({
    addAxelJob: function() {

      var job = {
        'percentage'  : null,
        'speed'       : null,
        'remaining'   : null
      };

      var download = axel.download('https://ianoshorty:d4yl1ght0169@put.io/download/279905001', {
        'file':'1.mp4',
        'cwd':'/Users/ianoshorty/Downloads'
      });

      Downloads.insert(download);
    }, 

    pauseAllDownloads: function() {
    
      //axel.pauseAll(); 
    
    },

    pauseDownload: function(downloadId) {

      var download = Downloads.findOne({'downloadId': downloadId});

      axel.pause(download.pid);

      Downloads.update(download._id, {$set: {'status':'paused'}});
    },

    resumeDownload: function(downloadId) {

      var download = Downloads.findOne({'downloadId': downloadId});

      var resumed = axel.download(download.address, {
        'file': download.fileName,
        'cwd' : download.cwd
      });

      Downloads.update(download._id, {$set: resumed});
    },

    cancelDownload: function(downloadId) {

      var download = Downloads.findOne({'downloadId': downloadId});

    }

  });  