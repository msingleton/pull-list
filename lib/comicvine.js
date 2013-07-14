var http = require('http'),
    winston = require('winston');

function ComicvineClient() {
  this.apiKey = process.env.COMICVINE_API_KEY;
  this.host = 'http://www.comicvine.com';
}

ComicvineClient.prototype = {
  fetchLatestIssueFromVolume: function(volumeId, issues, callback) {
    this.fetchVolume(volumeId, (function(volume) {
     this.fetchIssue(volume.last_issue.id, (function(issue) {
        issues.push(issue);
        callback();
      }).bind(this));
    }).bind(this));
  },

  fetchVolume: function(volumeId, callback) {
    var options = {
      host: this.host,
      path: '/api/volume/' + encodeURIComponent(volumeId) + '/' +
        '?api_key=' + this.apiKey + 
        '&format=json&field_list=last_issue'
    };

    winston.log('Fetching volume: ' + volumeId + ' at ' +
      options.path);
    var req = http.get(options, function(res) {
      if(res.statusCode == 200) {
        var data = '';
        res.on('data', function(chunk) {
          data += chunk;
        });

        res.on('end', function() {
          var volumeData = JSON.parse(data);
          callback(volumeData.results);
        });
      } else {
        winston.error(res.statusCode);
      }
    });
  },

  fetchIssue: function(issueId, callback) {
    var options = {
      host: this.host,
      path: '/api/issue/' + encodeURIComponent(issueId) + '/' +
        '?api_key=' + this.apiKey + 
        '&format=json'
    };

    winston.log('Fetching issue: ' + issueId + ' at ' +
      options.path);
    var req = http.get(options, function(res) {
      if(res.statusCode == 200) {
        var data = '';
        res.on('data', function(chunk) {
          data += chunk;
        });

        res.on('end', function() {
          var issueData = JSON.parse(data);
          callback(issueData.results);
        });
      } else {
        winston.error(res.statusCode);
      }
    });

  }
};

var client = new ComicvineClient();

module.exports = {
  fetchLatestIssueFromVolume: (client.fetchLatestIssueFromVolume).bind(client)
};
