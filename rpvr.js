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
  // Todo: Detach
  function axel(address, options, cb) {

    // Example axel command
    // axel -avn 10 -o "Top.Gear.S21E06.PROPER.HDTV.x264-RiVER.[VTV].mp4" https://ianoshorty:d4yl1ght0169@put.io/download/279908961
    // Example axel command - Mac
    // /usr/local/bin/axel -avn 10 -o "~/Top.Gear.S21E06.PROPER.HDTV.x264-RiVER.[VTV].mp4" https://ianoshorty:d4yl1ght0169@put.io/download/279908961 

    var command = spawn('/usr/local/bin/axel', ['-avn 10', '-o ' + options.file, address], {'cwd':options.cwd, 'env':process.env});

    command.stdout.on('data',  function (data) {
      cb(1, ''+data);
    });

    command.stderr.on('data', function (data) {
      cb(2, ''+data);
    });

    command.on('exit', function (code) {
      cb(3, ''+code);
    });
    
  }

  Meteor.methods({
    addAxelJob: function() {

      var job = {
        'percentage'  : null,
        'speed'       : null,
        'remaining'   : null
      };

      /*setInterval(function() {
        console.log(job);
      }, 1000);*/
 
      axel('https://ianoshorty:d4yl1ght0169@put.io/download/279905001', {
          'file':'1.mp4',
          'cwd':'/Users/ianoshorty/Downloads'
        }, 
        function(status, response){

          if (status === 1) {

            // /\[\s*([0-9]{1,3})%\].*\[\s*([0-9]+\.[0-9]+[A-Z][a-zA-Z]\/s)\]\s*\[([0-9]+:[0-9]+)\]/i

            var re = /\[\s*([0-9]{1,3})%\].*\[\s*([0-9]+\.[0-9]+[A-Z][a-zA-Z]\/s)\]\s*\[([0-9]+:[0-9]+)\]/i; 
            var str = response;
            var m;
            
            while ((m = re.exec(str)) != null) {
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }

                job.percentage   = m[1];
                job.speed        = m[2];
                job.remaining    = m[3];
            }          
          }    

          console.log(job);      
      });
    }
  });  
}
