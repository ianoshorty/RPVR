function basename(str) {
   var base = new String(str).substring(str.lastIndexOf('/') + 1); 
    if(base.lastIndexOf(".") != -1)       
        base = base.substring(0, base.lastIndexOf("."));
   return base;
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