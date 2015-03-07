  var axel = new AxelDownloader('ian');

  Meteor.methods({
    addAxelJob: function() {

      var job = {
        'percentage'  : null,
        'speed'       : null,
        'remaining'   : null
      };

      axel.download('https://ianoshorty:d4yl1ght0169@put.io/download/279905001', {
        'file':'1.mp4',
        'cwd':'/Users/ianoshorty/Downloads'
      });
    }, 

    pauseAllDownloads: function() {
      
      var status = axel.downloadStatus();
      //axel.pauseAll(); 

      console.log(status);
    }
  });  