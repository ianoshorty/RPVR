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
    },

    listPutIOFiles: function(object) {

      var PutIO = Meteor.npmRequire('put.io-v2');

      var oauth_token = 'FZB5EO3R';

      var api = new PutIO(oauth_token);

      var parentId = null;

      if (typeof object != 'undefined') {
        parentId = object.parentId;
      }
       
      var data = Async.runSync(function(done) {

        if(typeof parentId == null) {
           parentId = 0;
        }
        
        api.files.list(parentId, function(data){
          done(null, data);
        });

      });

      if (typeof data != 'undefined') {
        var parent = Async.runSync(function(complete) {
          api.files.get(data.result.files[0].parent_id, function (data){
            complete(null, data);
          })
        });

        data.result.files.unshift({
          'content_type': "application/x-directory",
          'crc32': null,
          'created_at': "2015-03-08T01:43:16",
          'first_accessed_at': null,
          'icon': "https://put.io/images/file_types/folder.png",
          'id': parent.result.file.parent_id,
          'is_mp4_available': false,
          'is_shared': false,
          'name': "..",
          'opensubtitles_hash': null,
          'parent_id': 279903167,
          'screenshot': null,
          'size': 0
        });
      }

      return data;
    },

    config: function() {
      return publicConfig;
    }
  });  