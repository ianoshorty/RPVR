Template.axel.helpers({
  
  downloads: function() {
    return Downloads.find({});
  },

  downloadIsPaused: function() {
    return (this.status == 'paused')? true: false;
  }

});

Template.axel.events({

  // Call the server, pass in the required url for Axel
  'keyup #url': function (event) {
    event.preventDefault();

    if (event.keyCode == 13) {    
      Meteor.call('addAxelJob', function(err, command) {});
    }
  },

  // Stop a downloads
  'click #pause': function(event){

    Meteor.call('pauseDownload', this.downloadId);
  },

  // Resume a downloads
  'click #resume': function(event){

    Meteor.call('resumeDownload', this.downloadId);
  },

  // Ignore form submit
  'submit form': function(event) {
    event.preventDefault();
  }
});