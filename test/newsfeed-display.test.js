var nock = require('nock');
var req = require('request');
var assert = require('assert');

var newsfeedUrl = 'http://localhost:8124/';
var newsfeedRecordedCallResponseArray;

function getCallResponse() {
    nock.recorder.rec({
        dont_print: true
    });
    req(newsfeedUrl, function(err, response, body) {
        if (err) {
            throw Error('Test failed because of ' + err.message)
        } else {
            while (typeof newsfeedRecordedCallResponseArray == 'undefined') {
                newsfeedRecordedCallResponseArray = nock.recorder.play()
            };
        }
    });
    newsfeedRecordedCallResponse = newsfeedRecordedCallResponseArray[0];
    console.log(newsfeedRecordedCallResponseArray);
    return newsfeedRecordedCallResponse;
}

//    newsfeedHttpRequest.get('/').delay(1000).reply(200);
// while (typeof newsfeedRecordedCallResponseArray != 'object') {}; // depends on network latency


//newsfeedRecordedCallResponse = newsfeedRecordedCallResponseArray[0];

//assert.equal(newsfeedRecordedCallResponse.match(/<li/g).length, 20, 'Expected count of list terminations found');
//assert.equal(newsfeedRecordedCallResponse.match(/<\/li/g).length, 20, 'Expected count of list terminations found');

describe('newsfeed-nodejs', function() {
    before(function() {
        getCallResponse();
    });
    describe('# number of listed news items', function() {
        it('should have the expected number of opening list tags', function(done) {
            assert.equal(newsfeedRecordedCallResponse.match(/<li/g).length, 20, 'Expected count of list terminations found');
            assert.equal(newsfeedRecordedCallResponse.match(/<\/li/g).length, 20, 'Expected count of list terminations found')
        })
    })
})