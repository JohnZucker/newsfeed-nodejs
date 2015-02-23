var request = require('request');
var assert = require('assert');
var async = require('async');
var fs = require('fs');

var newsfeedUrl = 'http://localhost:8124/';
var RELATIVE_TEST_FILEPATH = 'test/newsfeed-display.test.html'

/* TODO - Switch back to memory streams once external IO file rw is analysed
} */

function responseVerificationString(url) {
    ws = responseVerificationStream(url)
    return ws.toString()
}

describe('newsfeed-nodejs', function() {
    this.timeout(50000);

    var newsfeedVerificationStream;
    var newsfeedVerificationString;

    function responseVerificationStream(url) {
        ws = request(url).pipe(fs.createWriteStream(RELATIVE_TEST_FILEPATH));
        //var streams = require('memory-streams');
        //ws = request(url).pipe(new streams.WritableStream());
        return ws
    }
    before(function() {
        async.series(
            [

                function(completion) {
                    newsfeedVerificationStream = responseVerificationStream(newsfeedUrl);
                    //console.log('newsfeedVerificationStream is ' + typeof newsfeedVerificationStream);
                    newsfeedVerificationStream.on('end', function() {
                        console.log('ended'), completion()
                    });
                    newsfeedVerificationStream.end()
                },
                function(completion) {
                    var readfile = fs.readFileSync(RELATIVE_TEST_FILEPATH);
                    newsfeedVerificationString = readfile.toString();
                    //console.log('newsfeedVerificationString is ' + newsfeedVerificationString);
                    completion()
                }
            ])
    });
    describe('# number of listed news items', function() {
        it('should have the expected number of opening list tags', function(done) {
            var newsfeedVerificationString = newsfeedVerificationStream.toString();
            console.log('newsfeedVerificationString is ' + newsfeedVerificationString);
            assert.equal(newsfeedVerificationString.match(/<li/g).length, 20, 'Expected count of list terminations found');
            assert.equal(newsfeedVerificationString.match(/<\/li/g).length, 20, 'Expected count of list terminations found')
        })
    })
})