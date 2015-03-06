  var axel = new AxelDownloader('ian', true);

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
                
                //console.log('percentage:' + m[1]);
                //console.log('speed:' + m[2]);
                //console.log('ttl:' + m[3]);
                job.percentage = m[1];
                job.speed = m[2];
                job.ttl = m[3];
            }        
          }     
      });
    }, 

    pauseAllDownloads: function() {
      
      axel.pauseAll(); 
    }
  });  