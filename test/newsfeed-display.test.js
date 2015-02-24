var request = require('request');
var assert = require('assert');
var async = require('async');
var fs = require('fs');

var newsfeedUrl = 'http://localhost:8124/';
var RELATIVE_TEST_FILEPATH = 'test/newsfeed-display.test.html'

/* TODO - Switch back to memory streams once external IO file rw is analysed */

/* var streams = require('memory-streams');
function responseVerificationStream(url) {
   ws = request(newsfeedUrl).pipe(new streams.WritableStream());
}
*/

function responseVerificationStream(url, callback) {
    writeStream = request(url).pipe(fs.createWriteStream(RELATIVE_TEST_FILEPATH));
    writeStream.end();
    writeStream.on('end', callback(ws));
    return writeStream;
}

function responseVerificationString(stream) {
    // return stream.toString();
    var readStream = fs.readFileSync(RELATIVE_TEST_FILEPATH);
    console.log('readStream is '
        readStream);
    return readStream.toString();
}

describe('newsfeed-nodejs', function() {
    var newsfeedVerificationStream;
    beforeEach(function() {
        newsfeedVerificationStream = responseVerificationStream(newsfeedUrl, function() {
            responseVerificationString(newsfeedVerificationStream)
        });
        console.log('newsfeedVerificationStream is '
            newsfeedVerificationStream);
    });
    describe('# number of listed news items', function() {
        it('should have the expected number of opening list tags', function(done) {
            var newsfeedVerificationString = newsfeedVerificationStream.toString();
            console.log('newsfeedVerificationString is '
                newsfeedVerificationString);
            assert.equal(newsfeedVerificationString.match(/<li/g).length, 20, 'Expected count of list terminations found');
            assert.equal(newsfeedVerificationString.match(/<\/li/g).length, 20, 'Expected count of list terminations found')
        })
    })
})