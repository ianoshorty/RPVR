if (Meteor.isClient) {

  Template.axel.helpers({
  });

  Template.axel.events({

    // Call the server, pass in the required url for Axel
    'keyup #url': function (event) {
      event.preventDefault();

      if (event.keyCode == 13) {    
        Meteor.call('addAxelJob', function(err, command) {
          //console.log(command);
        });
      }
    },

    // Ignore form submit
    'submit form': function(event) {
      event.preventDefault();
    }
  });
}

if (Meteor.isServer) {

  // Get a handler to the spawn library
  var spawn;

  Meteor.startup(function () {
    // code to run on server at startup

    spawn = Npm.require('child_process').spawn;
  });

  // Make a process call into Axel
  // Todo: Detach head?
  function callAxel(cb) {

    // Example axel command
    // axel -avn 10 -o "Top.Gear.S21E06.PROPER.HDTV.x264-RiVER.[VTV].mp4" https://ianoshorty:d4yl1ght0169@put.io/download/279908961
    // Example axel command - Mac
    // /usr/local/bin/axel -avn 10 -o "~/Top.Gear.S21E06.PROPER.HDTV.x264-RiVER.[VTV].mp4" https://ianoshorty:d4yl1ght0169@put.io/download/279908961 

    var command = spawn('/usr/local/bin/axel', ['-avn 10', '-o "~/Downloads/Top.Gear.S21E06.PROPER.HDTV.x264-RiVER.[VTV].mp4"' , 'https://ianoshorty:d4yl1ght0169@put.io/download/279908961']);

    command.stdout.on('data',  function (data) {
      cb(1, 'stdout: ' + data);
    });

    command.stderr.on('data', function (data) {
      cb(2, 'stderr: ' + data);
    });

    command.on('exit', function (code) {
      cb(3, 'child process exited with code ' + code);
    });
    
  }

  Meteor.methods({
    addAxelJob: function() {

      callAxel(function(status, response){
        console.log(response);
      });

    }
  });  
}
