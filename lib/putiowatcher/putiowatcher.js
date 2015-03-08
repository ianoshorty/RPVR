

  /*

  "uploaded": 0,
  "estimated_time": 5,
  "peers_getting_from_us": 0,
  "extract": false,
  "current_ratio": 0.00,
  "size": 9409268,
  "up_speed": 0,
  "id": 2293761,
  "source": "magnet:?xt=urn:btih:194a4c341487fd12d36718054c1e8fef4358b2ab3",
  "subscription_id": null,
  "status_message": "\u2193 1.2 MB/s, \u2191 0.0 bytes/s | connected to 36 peers, sending to 0 peers | dl: 2.9 MB / 9.0 MB, ul: 0.0 bytes",
  "status": "DOWNLOADING",
  "down_speed": 1249337,
  "peers_connected": 36,
  "downloaded": 2999431,
  "file_id": null,
  "peers_sending_to_us": 22,
  "percent_done": 30,
  "tracker_message": null,
  "name": "A video",
  "created_at": "2012-03-28T09:14:17",
  "error_message": null,
  "save_parent_id": 0

  */

  // PutIOTransfers

  // Get Transfers

  // If Transfer completed - check to see if in list of downloads / completed downloads / download queue

  // If not downloading / downloaded / queue

  // Add to queue

  // If downloading / in queue do nothing

  // If downloaded - remove from transfer queue. 
  // If downloaded and option set - remove from PutIO server - recommended in order to make space in putio

  var config;

  PutIOWatcher = function(){

  	this.downloadQueue = [];
  }

  PutIOWatcher.prototype.initialise = function() {

  	// Todo: Get current Queue from DB or should we reset?

  	// Put.io Transfers soft poller for downloads
	// Soft Poll Transfer queue every 5 minutes
	//Meteor.setInterval(function() {
		//this.checkTransfers();
	//}, 5 * 60 * 1000)

	// Perform initial check
  	this.checkTransfers();
  }

  PutIOWatcher.prototype.checkTransfers = function() {

    var scope = this;

  	Meteor.call('getPutIOTransfers', function(error, data) {

      var transfer = data.result.transfers[0];

      //_.each(data.result.transfers, function(transfer) {

  			if (transfer.status == 'COMPLETED') {
          //Downloads.find({});

          // Assuming not already downloaded // in download queue

          scope.findFilesInDownload(transfer);

        }
  		//});
	 });
  }

  PutIOWatcher.prototype.findFilesInDownload = function(download, allowed) {

    if (typeof allowed == 'undefined') {
      allowed = [];
    }

    var files = [];

    var IDOnServer = download.file_id;

    var PutIO = Meteor.npmRequire('put.io-v2');

    var oauth_token = 'FZB5EO3R';

    var api = new PutIO(oauth_token);

    var data = Async.runSync(function(done) {

      api.files.get(IDOnServer, function(data){
        done(null, data);
      });
    });

    if (data.result.status == 'OK') {

      // If the item is a single file, just add it to the download queue
      if (data.result.content_type != 'application/x-directory') {
        this.downloadQueue.push(data.result.file);
        this.updateQueue();
      }

      // recusively traverse the directory tree looking for acceptable content
      // TODO: recursive - atm only looks 1 level down
      else {

        /*
        var added_files = Async.runSync(function(done) {
          api.files.list(IDOnServer, function(directory_contents) {

            done(null, directory_contents);
          });
        });

        console.log(added_files);*/
      }
    }

    // File has already been removed from Put.IO, lets remove it from the transfer queue
    // Calling cancel on this seems like a hack, but it does work
    else if (data.result.status == 'ERROR' && data.result.error_type == 'NotFound') {
      api.transfers.cancel(download.id);
    }
  }

  PutIOWatcher.prototype.updateQueue = function() {

    // TODO: use a specified number of allowed concurrent downloads from config file
    // At present, only 1 download allowed at a time

    if (Downloads.find().count() == 0) {
      var download = this.downloadQueue.shift();

      Meteor.call('addAxelJob', {'fileName':download.name, 'url':buildPutIODownloadString(download.id)});
    }
  }

  Meteor.call('config', function(error, data){
    config = data;
  });

  function buildPutIODownloadString(id) {

    var username = "username";
    var password = "password";

    return 'https://' + username + ':' + password + '@put.io/download/' + id;
  }

