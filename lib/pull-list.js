var fs = require('fs'),
    _ = require('underscore'),
    async = require('async'),
    winston = require('winston'),
    comicvine = require('./comicvine');

function PullList(filename) {
  winston.log('Loading pull list file: ' + filename);

  fs.readFile(filename, 'utf8', (function(err, data) {
    if (err) {
      winston.info('Error opening file: ' + filename);
    }

    this.lookupComics(this.processFile(data));
  }).bind(this));
}

PullList.prototype = {
  /**
   *  Processes the data from the pull list file and returns
   *  an array of comic titles
   *
   *  @param {string} data
   *  @return {Array<string>}
   */
  processFile: function(data) {
    var volumeIds = data.split('\n').filter(function(el) {
      return el.trim() !== '';
    }).map(function(el) {
      return el.split(':')[0];
    });

    return volumeIds;
  },
  
  /**
   * Fetch comic data from a set of comicvine volume ids
   *
   * @param {Array<string>} volumeIds
   */
  lookupComics: function(volumeIds) {
    var self = this;
    var issues = [];

    async.each(volumeIds, function(volumeId, callback) {
       comicvine.fetchLatestIssueFromVolume(volumeId, issues, callback);
    }, function(err) {
      var groupedIssues = _.groupBy(issues, function(issue) {
        if (self.daysSinceRelease(issue) < 6) {
          return 'new';
        } else {
          return 'old';
        }
      });

      console.log('');
      if (groupedIssues.new) {
        console.log('New issues this week');
        console.log('--------------------------------------------');

        _(groupedIssues.new).each(function(issue) {
          console.log(issue.volume.name + ' came out ' +
            self.daysSinceRelease(issue) + ' days ago');
        });
      } else {
        console.log('No new issues this week :(');
      }

      if (groupedIssues.old) {
        console.log('\nOld issues');
        console.log('--------------------------------------------');

        _(groupedIssues.old).each(function(issue) {
          console.log(issue.volume.name + ' came out ' +
            self.daysSinceRelease(issue) + ' days ago');
        });
      }

      console.log('\n\n');
    });
  },

  daysSinceRelease: function(issue) {
    var now = new Date();
    var today = new Date(now.getFullYear() + '-' + 
      (now.getMonth() + 1) + '-' + now.getDate() + ' EDT');
    var then = new Date(issue.store_date + ' EDT');
    var daysOld = (today - then) / 86400000;

    return daysOld; 
  }
};

module.exports = function(options) {
  new PullList(options[0]);
};
