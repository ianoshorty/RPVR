// Create default config
var config = {};

Meteor.call('config', function(error, data){
  config = data;
});

function basename(str) {
   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1)       
        base = base.substring(0, base.lastIndexOf("."));
   return base;
}

function buildPutIODownloadString(id) {

  var username = config.rpvrPutioUsername;
  var password = config.rpvrPutioPpassword;

  return 'https://' + username + ':' + password + '@put.io/download/' + id;
}

Template.axel.helpers({
  
  downloads: function() {
    return Downloads.find({});
  },

  downloadIsPaused: function() {
    return (this.status == 'paused')? true: false;
  }

});

Template.axel.events({

  // Stop a downloads
  'click #pause': function(event){

    Meteor.call('pauseDownload', this.downloadId);
  },

  // Resume a downloads
  'click #resume': function(event){

    Meteor.call('resumeDownload', this.downloadId);
  },

  // Cancel a download
  'click #cancel': function(event){

    Meteor.call('cancelDownload', this.downloadId);
  },

  // Call the server, pass in the required url for Axel
  'submit form': function(event) {
    event.preventDefault();

    var url = _.trim(event.target.url.value);

    if (_.isEmpty(url)) {

      alert('Nope.');

      return;
    }

    var fileName = _.trim(event.target.filename.value);

    if (_.isEmpty(fileName)) {
      fileName = basename(url);
    }

    Meteor.call('addAxelJob', {'fileName':fileName, 'url':url},function(err, command) {});
  }
});

Template.putio.helpers({

  items: function() {

    if (_.isEmpty(Session.get('files'))) {

      Meteor.call('listPutIOFiles', function(error, data) {
        if (typeof data != 'undefined' && typeof data.result.files != 'undefined') {
          Session.set('files', data.result.files);
        }
      });
    }

    return Session.get('files');
  }
});

Template.putio.events({
  
  'click a': function(event){
      event.preventDefault();

      Meteor.call('listPutIOFiles', {'parentId':this.id}, function(err, data){
        if (typeof data.result.files != 'undefined') {
          Session.set('files', data.result.files);
        }
      });
  },

  'click button': function(event) {
      event.preventDefault();

      var fileName = this.name;
      var url = buildPutIODownloadString(this.id);

      Meteor.call('addAxelJob', {'fileName':fileName, 'url':url});
  }

});