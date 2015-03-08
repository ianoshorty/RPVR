  var axel = new AxelDownloader('ian');

  // Every two seconds, poll and update the list of downloads
  // Todo: Improve this. Clear out downloads on 100% dont bother polling paused downloads
  // Todo: make reactive so that not always updating the database
  Meteor.setInterval(function() {

    _.each(Downloads.find({}).fetch(), function(download) {
      
      var status = axel.downloadStatus(download.logPath + download.logName + '.log');

      Downloads.update(download._id, {$set: status})
    });

  }, 2000);

  // Use this as a cleanup function, much larger interval (10 secs)
  // Todo: handle this better
  Meteor.setInterval(function() {

    _.each(Downloads.find({}).fetch(), function(download) {

      // if its nearly complete (remember this is timing)
      if (download.percentage >= 95) {

        // Check if axels download tracker is gone.
        if (axel.checkCompleted(download)) {

          // If completed - remove
          axel.clearCompleted(download);
          Downloads.remove(download._id);
        }
      }
    });

  }, 10000);

  Meteor.methods({
    addAxelJob: function(params) {

      var download = axel.download(params.url, {
        'file'  : params.fileName,
        'cwd'   : '/Users/ianoshorty/Downloads'
      });

      Downloads.insert(download);
    }, 

    pauseAllDownloads: function() {
    
      //axel.pauseAll(); 
    
    },

    pauseDownload: function(downloadId) {

      var download = Downloads.findOne({'downloadId': downloadId});

      axel.pause(download.pid);

      Downloads.update(download._id, {$set: {
        'status':'paused',
        'speed' :'0KB/s'
      }});
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

      function cancelTheDownload(download) {
        axel.cancel(download);

        Downloads.remove(download._id);
      }

      if (download.status == 'downloading') {
        Meteor.call('pauseDownload', downloadId, function(){
          cancelTheDownload(download);
        });
      }
      else {
        cancelTheDownload(download);
      }

    }

  });  