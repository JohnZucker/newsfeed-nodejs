var request = require('request');
var assert = require('assert');

/* function responseVerificationStream(url) {
    return request(url).pipe(fs.createWriteStream('newsfeed-display.test.html'))
}
*/

var newsfeedUrl = 'http://localhost:8124/';

var streams = require('memory-streams');

function responseVerificationStream(url) {
    ws = request(newsfeedUrl).pipe(new streams.WritableStream());
    return ws
}

function responseVerificationString(url) {
    ws = responseVerificationStream(url)
    return ws.toString()
}

describe('newsfeed-nodejs', function() {
    var newsfeedVerificationStream;
    beforeEach(function() {
        newsfeedVerificationStream = responseVerificationStream(newsfeedUrl);
        console.log('newsfeedVerificationStream is ' + newsfeedVerificationStream);
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