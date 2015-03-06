Template.axel.helpers({
});

Template.axel.events({

  // Call the server, pass in the required url for Axel
  'keyup #url': function (event) {
    event.preventDefault();

    if (event.keyCode == 13) {    
      Meteor.call('addAxelJob', function(err, command) {});
    }
  },

  // Stop all downloads
  'click #cancel': function(event){

    Meteor.call('pauseAllDownloads');
  },

  // Ignore form submit
  'submit form': function(event) {
    event.preventDefault();
  }
});